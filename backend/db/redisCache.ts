import * as redis from "redis";
import { logService } from "../Utils/logger";
const logger = new logService("db->redisCache.ts");
interface cacheValue extends Object {
  time: Date;
  value: any;
}
const expireTime = parseInt(process.env.REDIS_EXPIRE || "0");

export class DbCacheProvider {
  Options: Object;
  client: ReturnType<typeof redis.createClient>;
  constructor(serverUrl: Object) {
    this.Options = serverUrl;
  }
  async init() {
      this.client = await redis.createClient(this.Options);
      await this.client.connect();
  }

  async checkCache(query: string) {
    try {
      var cacheResult: string | null = await this.client.get(query);
      if (cacheResult && query.includes("select")) {
        //only cache check the select command
        var cacheJson = JSON.parse(cacheResult);
        var cacheExpireTime = new Date(cacheJson.time);
        cacheExpireTime.setSeconds(cacheExpireTime.getSeconds() + expireTime); //add the expiration time to cached time to check if it exceeds current time
        if (compareDates(cacheExpireTime, new Date()) >= 0) {
          return cacheJson.value;
        } else {
          await this.client.del(query);
          return false;
        }
      }
    } catch (err) {
      //return false on cache failure while redis try to reconnect
      this.init();
    }
    return false;
  }

  async putCache(query: string, value: any) {
    try {
      if (query.includes("select") && value.length != 0) {
        var cacheValue: cacheValue = {
          time: new Date(),
          value: value,
        };
        this.client.set(query, JSON.stringify(cacheValue));
      }
    } catch (err) {
      this.init;
    }
  }
  async expireCache(query: string) {
    await this.client.del(query);
    for await (const key of this.client.scanIterator({
      TYPE: 'string', // `SCAN` only
      MATCH: `*${query}*`,
      COUNT: 100
    })) {
      await this.client.del(key);
    }
  }
}

const compareDates = (d1: Date, d2: Date) => {
  if (d1 < d2) {
    return -1;
  } else if (d1 > d2) {
    return 1;
  } else {
    return 0;
  }
};
