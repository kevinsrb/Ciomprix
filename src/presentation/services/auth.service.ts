import { JwtAdapter, bcryptAdapter } from "../../config";

import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { User } from "../../data";


export class AuthService {
  constructor(
   )   {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    try {
 
      const existEmail = await User.findOneBy( { email: registerUserDto.email } );
      if ( existEmail ) throw CustomError.badRequest( 'El email ya esta registrado' );

      const existIdentification = await User.findOneBy( { identification: registerUserDto.identification } );
      if ( existIdentification ) throw CustomError.badRequest( 'La identificacion ya esta registrad' );


      const user = new User();
      user.name = registerUserDto.name;
      user.lastname = registerUserDto.lastname;
      user.email = registerUserDto.email;
      user.identification = registerUserDto.identification;
      user.password = bcryptAdapter.hash(registerUserDto.password);
      user.phone = registerUserDto.phone;
      user.birthdate = registerUserDto.birthdate;
    
      await user.save()

      const {password, ...restuser } = user

      return restuser;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {

    const user = await User.findOneBy( { email: loginUserDto.email } );
    if ( !user ) throw CustomError.badRequest( 'El email ya esta registrado' );

    const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
    if ( !isMatching ) throw CustomError.badRequest('Password is not valid');


    const { password, ...userEntity} =  user;
    
    const token = await JwtAdapter.generateToken({ id: user.id });
    if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
    }

  }
}
