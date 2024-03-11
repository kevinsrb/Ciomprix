import { Request, Response } from 'express';
import { LoginUserDto, RegisterUserDto} from '../../domain';

import { HttpResponse } from '../../utils/response';
import { AuthService } from '../services';
import { handleError } from '../../domain/errors/handle.error';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';



export class AuthController {

  // DI
  constructor(
    private readonly authService: AuthService,
    private readonly httpResponse: HttpResponse,
    private readonly logRepository: LogRepository
  ) {}



  public  registerUser = async (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if ( error ) return res.status(400).json({error})

    this.authService.registerUser(registerDto!)
    .then( (user) => this.httpResponse.Create(res, 'Usuario creaado correctamente', user ) )
    .catch( error => {
      
        const log =  new LogEntity({
          ip: req.ip, 
          endpoint: req.originalUrl,
          statuscode: res.statusCode,
          level: LogSeverityLevel.high,
          user: '',
        });

        this.logRepository.saveLog(log);
        return handleError(res, error)
     });
      
  }


  loginUser = (req: Request, res: Response) => {

    const [error, loginUserDto] = LoginUserDto.login(req.body);
    if ( error ) return res.status(400).json({error})

    this.authService.loginUser(loginUserDto!)
    .then( (user) => this.httpResponse.Ok(res, 'Logueado correctamente', user ) )
    .catch( error => {
      
      const log =  new LogEntity({
        ip: req.ip, 
        endpoint: req.originalUrl,
        statuscode: res.statusCode,
        level: LogSeverityLevel.high,
        user: '',
      });

      this.logRepository.saveLog(log);
      return handleError(res, error)
   });
      
  }

}