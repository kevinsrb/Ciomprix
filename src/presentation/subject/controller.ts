import { Response, Request } from 'express';
import { CreateSubjectDto, CustomError, PaginationDto } from '../../domain';
import { HttpResponse } from '../../utils/response';
import { SubjectService } from '../services/subject.service';
import { UpdateSubjectDto } from '../../domain/dtos/subject/update-subject.dto';
import { handleError } from '../../domain/errors/handle.error';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';





export class SubjectController {

  // DI
  constructor(
    private readonly subjectService: SubjectService,
    private readonly logRepository: LogRepository,
    private readonly httpResponse: HttpResponse,
  ) { }



  createSubject = ( req: Request, res: Response ) => {

    const [ error, createSubjectDto ] = CreateSubjectDto.create(req.body );
    if ( error )  return this.httpResponse.BadRequest( res, "Error al crear la asignatura",  error );

    this.subjectService.create(createSubjectDto!)
    .then( (subject) => this.httpResponse.Ok(res, 'Asignatura creada correctamente', subject ) )
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

  };

  public getSubjects = (req: Request, res: Response) => {
    this.subjectService .getSubjects()
    .then((subjects) => this.httpResponse.Ok(res, "Asginaturas obtenidas correctamente", subjects))
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
  };

  public getSubjectByIdEstudent = (req: Request, res: Response) => {
    const id = req.params.id;
    this.subjectService.getSubjectByIdEstudent(id)
    .then((subject) => this.httpResponse.Ok(res, "Asginatura obtenidas correctamente", subject))
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

  };

  public getSubjectById = (req: Request, res: Response) => {
    const id = req.params.id;
    this.subjectService.getSubjectById(id)
    .then((subject) => this.httpResponse.Ok(res, "Asginatura obtenida correctamente", subject))
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

  };

  public updateSubject = (req: Request, res: Response) => {
    const id = req.params.id;

    const [ error, updateSubjectDto ] = UpdateSubjectDto.update( req.body );
    if ( error ) return this.httpResponse.BadRequest( res, "Error al actualizar al usuario",  error );
   
    this.subjectService.updateSubject(id, updateSubjectDto!)
    .then((subject) => this.httpResponse.Ok(res, "Asignatura actualizada correctamente", subject))
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

  };

  
  public deleteSubject = (req: Request, res: Response) => {
    const id = req.params.id;

    this.subjectService.deleteSubject(id)
    .then((subject) => this.httpResponse.Ok(res, "Asignatura eliminada correctamente", subject))
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
  };



}