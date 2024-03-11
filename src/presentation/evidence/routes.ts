import { Router } from 'express';
import { EvidenceController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { EvidenceService } from '../services/evidence.service';
import { HttpResponse } from '../../utils/response';
import { FileUploadMiddleware } from '../middlewares/file.middleware';
import { UserService } from '../services/user.service';
import { SubjectService } from '../services/subject.service';
import { LogRepositoryImpl } from '../../infrastructure/repositories/log.respository.impl';
import { FileSystemDatasource } from '../../infrastructure/datasources/file-system.datasource';
import { UserRole } from '../../data';



export class EvidenceRoutes {


  static get routes(): Router {

    const LogRepository = new LogRepositoryImpl( 
      new FileSystemDatasource()
    );

    const router = Router();
    const evidenceService = new EvidenceService();
    const userService = new UserService();
    const subjectService = new SubjectService();
    const httpResponse = new HttpResponse()
    const controller = new EvidenceController(evidenceService, userService, subjectService, LogRepository, httpResponse);

    // Definir las rutas
    router.get( '/getEvidencesForSubject/',  [ AuthMiddleware.validateRole( [UserRole.ADMIN, UserRole.STUDENT]) ],  controller.getEvidencesForSubject );    
    router.get( '/getEvidencesOrderByEmailAndCreateDate',  [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.getEvidencesOrderByEmailAndCreateDate );
    router.get( '/getSubjectByIdEstudent',  [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.getPercentageOfEvidencesByFileType );
    router.post( '/',[ AuthMiddleware.validateRole( [UserRole.ADMIN, UserRole.STUDENT]) , FileUploadMiddleware.containFiles ], controller.createEvidence );
    router.put( '/:id', [ AuthMiddleware.validateRole( [UserRole.ADMIN, UserRole.STUDENT]),  FileUploadMiddleware.containFiles ], controller.UpdateEvidences );
    router.get( '/',  [ AuthMiddleware.validateRole( [UserRole.ADMIN, UserRole.STUDENT])], controller.getEvidences );




    return router;
  }


}

