import { Response, Request } from 'express';
import { CreateEvidenceDto, CustomError, PaginationDto } from '../../domain';
import { EvidenceService } from '../services/evidence.service';
import { HttpResponse } from '../../utils/response';
import { UploadedFile } from 'express-fileupload';
import { FormatFile } from '../../data';
import { handleError } from '../../domain/errors/handle.error';
import { UpdateEvidenceDto } from '../../domain/dtos/evidence/update-evidence.dto';
import { UserService } from '../services/user.service';
import { SubjectService } from '../services/subject.service';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';




export class EvidenceController {

  // DI
  constructor(
    private readonly evidenceService: EvidenceService,
    private readonly userService: UserService,
    private readonly subjectService: SubjectService,
    private readonly logRepository: LogRepository,
    private readonly httpResponse: HttpResponse,
  ) {}



  public createEvidence = ( req: Request, res: Response ) => {
    const file = req.body.files.at(0) as UploadedFile;
    if(!file) return this.httpResponse.BadRequest(res, 'No selecciono ningun archivo', {} )

    const { subject } = req.body;
    if(!subject) return this.httpResponse.BadRequest(res, 'No hay asignaturas a las que asignar la evidencia', {} )

    const { name: filename, size } = file;
    const validExtensions: string[] = Object.values(FormatFile);


    const fileExtension = file.mimetype.split('/').at(1) ?? '';
    if ( !validExtensions.includes(fileExtension)) return this.httpResponse.BadRequest(res, `Invalid extension: ${ fileExtension }, valid ones ${ validExtensions }`, {});

    
    const [ error, createEvidenceDto ] = CreateEvidenceDto.create({ filename, size, format: fileExtension, subject  } );
    if ( error ) return res.status( 400 ).json( { error } );

    this.userService.getUserCompleteById(req.body.user.id)
    .then( (user) => {
      this.subjectService.getSubjectById(subject )
      .then( (subject) =>  {
        this.evidenceService.createEvidence(file,  createEvidenceDto!,  subject, user )
        .then( evidence =>  this.httpResponse.Ok(res,  'Evidences obtained correctly', evidence))
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

  public getEvidences = async ( req: Request, res: Response ) => {
    
    this.evidenceService.getEvidences()
      .then( evidences => this.httpResponse.Ok(res,  'Evidences obtained correctly', evidences))
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


  public getPercentageOfEvidencesByFileType = async ( req: Request, res: Response ) => {
    
    this.evidenceService.getPercentageOfEvidencesByFileType()
      .then( evidences => this.httpResponse.Ok(res,  'Evidences obtained correctly', evidences))
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

  

  public UpdateEvidences = ( req: Request, res: Response ) => {
    const { id } = req.params

    const file = req.body.files.at(0) as UploadedFile;
    if(!file) return this.httpResponse.BadRequest(res, 'No selecciono ningun archivo', {} )

    const { name: filename, size } = file;
    const validExtensions: string[] = Object.values(FormatFile);

    const fileExtension = file.mimetype.split('/').at(1) ?? '';
    if ( !validExtensions.includes(fileExtension)) return this.httpResponse.BadRequest(res, `Invalid extension: ${ fileExtension }, valid ones ${ validExtensions }`, {});

    
    const [ error, updateEvidenceDto ] = UpdateEvidenceDto.update({ filename, size, format: fileExtension  } );
    if ( error ) return res.status( 400 ).json( { error } );


    this.evidenceService.updateEvidence(id, file,  updateEvidenceDto! )
    .then( evidence =>  this.httpResponse.Ok(res,  'Evidences update correctly', evidence))
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


  public getEvidencesOrderByEmailAndCreateDate = ( req: Request, res: Response) => {
    this.evidenceService.getEvidencesOrderByEmailAndCreateDate()
    .then( evidences => this.httpResponse.Ok(res,  'Evidences obtained correctly', evidences))
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

  public getEvidencesForSubject = ( req: Request, res: Response) => {
    this.evidenceService.getEvidencesForSubject()
    .then( evidences => this.httpResponse.Ok(res,  'Evidences obtained correctly', evidences))
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