export class logService {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
  log(...value: any) {
    console.info(getDate(), this.id, ...value); //can use any other logger api
  }
  error(...value: any) {
    console.error(getDate(), this.id, ...value); //can use any other logger api
  }
}
function getDate() {
  return new Date().toLocaleString("en-GB", { timeZone: "IST" });
}
