import { Request, Response } from "express";
import { AssingSubjectsDto } from "../../domain/dtos/user/assign-subjects";
import { UserService } from "../services/user.service";
import { HttpResponse } from "../../utils/response";
import { SubjectService } from "../services/subject.service";
import { UpdateUserDto } from "../../domain/dtos/user/update-user.dto";
import { LogRepository } from "../../domain/repository/log.repository";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { handleError } from "../../domain/errors/handle.error";

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly subjectService: SubjectService,
    private readonly logRepository: LogRepository,
    private readonly httpResponse: HttpResponse
  ) {}


  public getUsers = (req: Request, res: Response) => {
    this.userService.getUsers()
    .then((user) => this.httpResponse.Ok(res, "Usuarios obtenido correctamente", user))
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

  public getStudentsOrderByLastname = (req: Request, res: Response) => {
    this.userService.getStudentsOrderByLastname()
    .then((user) => this.httpResponse.Ok(res, "Usuarios obtenido correctamente", user))
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

  public getCountStudent = (req: Request, res: Response) => {
    this.userService.getCountStudent()
    .then((user) => this.httpResponse.Ok(res, "Usuarios obtenido correctamente", user))
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

  public getStudentForMoreEvidences = (req: Request, res: Response) => {
    this.userService.getStudentForMoreEvidences()
    .then((user) => this.httpResponse.Ok(res, "Usuarios obtenido correctamente", user))
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


  public getUserById = (req: Request, res: Response) => {
    const id = req.params.id;
    this.userService.getUserById(id)
    .then((user) => this.httpResponse.Ok(res, "Usuario obtenido correctamente", user))
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

  public updateUser = (req: Request, res: Response) => {
    const id = req.params.id;

    const [ error, updateUserDto ] = UpdateUserDto.update( req.body );
    if ( error ) return this.httpResponse.BadRequest( res, "Error al actualizar al usuario",  error );
   
    this.userService.updateUser(id, updateUserDto!)
    .then((user) => this.httpResponse.Ok(res, "Usuario obtenido correctamente", user))
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

  
  public deleteUser = (req: Request, res: Response) => {
    const id = req.params.id;

    this.userService.deleteUser(id)
    .then((user) => this.httpResponse.Ok(res, "usuario eliminado correctamente", user))
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


  public assignSubjects = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, assingSubject] = AssingSubjectsDto.assingSubject(req.body);
    if (error) return res.status(400).json({ error });

    this.subjectService.getByIds(assingSubject!)
    .then((subjects) =>  {
      this.userService.asssingSubject(id, subjects!)
      .then((user) =>  this.httpResponse.Ok( res, "Se asignaron correctamente las asignaturas",  user  )  )
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
    })
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
