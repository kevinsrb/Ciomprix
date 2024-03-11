import { Response, Request } from 'express';
import { HttpResponse } from '../../utils/response';
import { handleError } from '../../domain/errors/handle.error';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import { LogsService } from '../services';




export class LogsController {

  
  constructor(
    private readonly logRepository: LogRepository,
    private readonly logsService: LogsService,
    private readonly httpResponse: HttpResponse,
  ) {}



  public getLogs = ( req: Request, res: Response ) => {
   

    this.logsService.getLogs()
    .then((logs) =>  this.httpResponse.Ok(res, "Logs obtenido correctamente!", logs))
    .catch( error => {
      
      const log =  new LogEntity({
        ip: req.ip, 
        endpoint: req.originalUrl,
        statuscode: res.statusCode,
        level: LogSeverityLevel.high,
        user: req.body.user.email,
      });

      this.logRepository.saveLog(log);
      return handleError(res, error)
   });

  }

}