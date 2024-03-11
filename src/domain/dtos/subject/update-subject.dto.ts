
export class UpdateSubjectDto {

  private constructor(
    public readonly name: string,
   public readonly period: string, // ID
  ) { }

  static update( props: { [ key: string ]: any; } ): [ string?, UpdateSubjectDto?] {

    const {
      name,
      period
    } = props;


    if ( !name ) return [ 'Missing name' ];
    if ( !period ) return [ 'Missing period' ];
    // if ( !Validators.isUUID(user) ) return ['Invalid User ID!'];

  
    return [  undefined,  new UpdateSubjectDto( name, period)];


  }


}