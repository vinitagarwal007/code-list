export class logService{
    id : String

    constructor(id : String){
        this.id = id 
    }
    log(...value : any){
        console.info(getDate(),this.id,...value) //can use any other logger api
    }
    error(...value : any){
        console.error(getDate(),this.id,...value) //can use any other logger api

    }
}
function getDate(){
    return new Date().toLocaleString('en-GB', { timeZone: 'IST' })
}