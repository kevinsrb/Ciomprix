import { validate as isValidUUID } from 'uuid';



export class Validators {


 

  static isUUID( id: string ) {
    return isValidUUID(id)
  }


 


}