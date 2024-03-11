import { regularExps } from '../../../config';



export class UpdateUserDto {

  private constructor(
    public name: string,
    public lastname: string,
    public phone: string,
    public password: string,
  ) {}

  static update( object: { [key:string]:any } ): [string?, UpdateUserDto?] {
    const { name, lastname, phone, password, birthdate } = object;

    if ( !name ) return ['Missing name'];
    if ( !lastname ) return ['Missing lastName'];
    if ( !password ) return ['Missing password'];
    if ( password.length < 6 ) return ['Password too short'];
    if ( !phone ) return ['Missing phone'];

    return [undefined, new UpdateUserDto(name, lastname, phone, password )];

  }


}