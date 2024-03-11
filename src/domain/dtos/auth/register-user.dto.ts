import { regularExps } from '../../../config';



export class RegisterUserDto {

  private constructor(
    public name: string,
    public lastname: string,
    public email: string,
    public identification: string,
    public phone: string,
    public password: string,
    public birthdate: Date,
  ) {}

  static create( object: { [key:string]:any } ): [string?, RegisterUserDto?] {
    const { name, lastname, email, identification, phone, password, birthdate } = object;

    if ( !name ) return ['Missing name'];
    if ( !lastname ) return ['Missing lastName'];
    if ( !email ) return ['Missing email'];
    if ( !regularExps.email.test( email ) ) return ['Email is not valid'];
    if ( !password ) return ['Missing password'];
    if ( password.length < 6 ) return ['Password too short'];
    if ( !identification ) return ['Missing identification'];
    if ( !phone ) return ['Missing phone'];
    if ( !birthdate ) return ['Missing birthdate'];

    return [undefined, new RegisterUserDto(name, lastname, email, identification, phone, password, birthdate )];

  }


}