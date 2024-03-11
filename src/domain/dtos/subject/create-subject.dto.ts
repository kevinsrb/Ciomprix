import { Validators } from '../../../config';

export class CreateSubjectDto {

  private constructor(
    public readonly name: string,
   public readonly period: string, // ID
  ) { }

  static create( props: { [ key: string ]: any; } ): [ string?, CreateSubjectDto?] {

    const {
      name,
      period
    } = props;


    if ( !name ) return [ 'Missing name' ];
    if ( !period ) return [ 'Missing period' ];
    // if ( !Validators.isUUID(user) ) return ['Invalid User ID!'];

  
    return [  undefined,  new CreateSubjectDto( name, period)];


  }


}