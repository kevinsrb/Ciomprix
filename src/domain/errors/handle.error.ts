import { EntityNotFoundError } from "typeorm";
import { CustomError } from "./custom.error";
import { Response } from "express";


export const handleError = ( res: Response, error: unknown ) => {

    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json( { succes: false, statusCode: error.statusCode, error: error.message } );
    }

    if(error instanceof EntityNotFoundError){
    return res.status( 400 ).json( { succes: false, statusCode: 400, data: error.criteria,  error: error.message } );
    }

    console.log( `${ error }` );
    return res.status( 500 ).json( { error: 'Internal server error' } );
 };