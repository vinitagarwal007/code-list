export class logService {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
  log(...value: any) {
    console.info(this.getDate(), this.id, ...value); //can use any other logger api
  }
  error(...value: any) {
    console.error(this.getDate(), this.id, ...value); //can use any other logger api
  }
  getDate() {
    return new Date().toLocaleString("en-GB", { timeZone: "IST" });
  }
}

