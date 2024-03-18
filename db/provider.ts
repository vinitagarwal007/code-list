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

  async makeQuery(query: string, value: Array<string>) {
    await doQuery(this.cache, this.connection, query, value);
  }
}

async function createTables(
  cache: DbCacheProvider,
  connection: mysql.Connection,
) {
  var query: string = `CREATE TABLE submission(
    username VARCHAR(100) NOT NULL,
    language VARCHAR(45) NULL,
    code LONGTEXT NULL,
    stdin LONGTEXT NULL,
    output LONGTEXT NULL,
    token LONGTEXT NULL,
    PRIMARY KEY (username));`;
  doQuery(cache, connection, query, [], false);
}

async function doQuery(
  cache: DbCacheProvider,
  connection: mysql.Connection,
  queryString: string,
  value: Array<any>,
  toCache: Boolean = true,
) {
  logger.log("Query Received", queryString);
  var searchString = connection.format(queryString, value);
  var cacheData = toCache ? await cache.checkCache(searchString) : false;
  if (cacheData) {
    logger.log("cached:", cacheData);
  } else {
    var result = await connection.query(queryString, value);
    cache.putCache(queryString, result[0]);
  }
}
