import * as mysql from "mysql2/promise";
import { logService } from "../Utils/logger";
import { DbCacheProvider } from "./redisCache";
const logger = new logService("db->provider.ts");

export class dbProvider {
  connection: mysql.Connection;
  connectionOption: mysql.ConnectionOptions;
  cache: DbCacheProvider;
  constructor(options: mysql.ConnectionOptions) {
    this.connectionOption = options;
  }

  async init() {
    this.connection = await mysql.createConnection(this.connectionOption);
    await this.connection.connect();
    this.cache = new DbCacheProvider({
      url: String(process.env.REDIS_URL),
    });
    this.cache.init();
  }

  async initTables() {
    var result: any = await this.connection.query("show tables");
    var shouldInit: Boolean = true;
    result[0].forEach((element: Object) => {
      if (Object.values(element)[0] == "submission") {
        //check if submission table is present in the db
        shouldInit = false;
      }
    });
    if (shouldInit) {
      logger.log("Table Not Found");
      await createTables(this.cache, this.connection);
      logger.log("Table Created");
    }
  }

  async makeQuery(query: string, value: Array<any> = []) {
    return await doQuery(this.cache, this.connection, query, value);
  }
  async insertTableData(table: string, data: object) {
    var keyList = Object.keys(data);
    var valueList = Object.values(data);
    var valueString = "?,".repeat(valueList.length).slice(0, -1);
    var queryString = `insert into ${table}(${keyList.join(",")}) values(${valueString})`;
    this.clearTableCache(table); //clear cache on insert
    return await doQuery(this.cache, this.connection, queryString, valueList);
  }

  async selectAll(table: string) {
    var queryString = `select * from ${table}`;
    return await doQuery(this.cache, this.connection, queryString);
  }

  async updateId(table: string, id: number, data: any) {
    var updateString = [];
    for (var key in data) {
      updateString.push(`${key}='${data[key]}'`);
    }
    var queryString = `update ${table} set ${updateString} where id=${id}`;
    this.clearTableCache("submission")
    return await doQuery(this.cache, this.connection, queryString);
  }

  async clearTableCache(table: string) {
    this.cache.expireCache(table);
  }
}

async function createTables(
  cache: DbCacheProvider,
  connection: mysql.Connection
) {
  var query: string = `CREATE TABLE submission (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(100) NOT NULL,
    language varchar(45) DEFAULT NULL,
    code longtext,
    stdin longtext,
    output longtext,
    submissionDate varchar(45) DEFAULT NULL,
    PRIMARY KEY (id)
  )`;

  doQuery(cache, connection, query, [], false);
}

async function doQuery(
  cache: DbCacheProvider,
  connection: mysql.Connection,
  queryString: string,
  value: Array<any> = [],
  toCache: Boolean = true
) {
  var searchString = connection.format(queryString, value);
  var cacheData = await cache.checkCache(searchString);

  if (cacheData) {
    logger.log("Cache Found");
    return cacheData;
  } else {
    var result = await connection.query(queryString, value);
    result = JSON.parse(JSON.stringify(result[0])); //convert row data packets to array
    cache.putCache(searchString, result);
    return result;
  }
}
