import * as mysql from 'mysql2/promise';
import { logService } from "../Utils/logger";

const logger = new logService("db->provider.ts")

export class dbProvider {
  connection: mysql.Connection
  connectionOption: mysql.ConnectionOptions
  constructor(options: mysql.ConnectionOptions) {
    this.connectionOption = options
  }

  async init() {
    this.connection = await mysql.createConnection(this.connectionOption)
    await this.connection.connect()
  }

  async initTables() {
    var result:any = await this.connection.query("show tables")
    var shouldInit: Boolean = true
    result[0].forEach((element:Object) => {
      if(Object.values((element))[0] == "submission"){
        shouldInit = false
      }
    });
    if(shouldInit){
      await createTables()
    }
  }
}
async function createTables(){
  var query:String = `CREATE TABLE 'submission' (
    'username' INT NOT NULL,
    'language' VARCHAR(45) NULL,
    'code' LONGTEXT NULL,
    'stdin' LONGTEXT NULL,
    'output' LONGTEXT NULL,
    '' VARCHAR(45) NULL,
    PRIMARY KEY ('username'));`
} 