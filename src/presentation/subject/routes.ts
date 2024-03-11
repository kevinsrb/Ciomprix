import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { SubjectController } from './controller';;
import { HttpResponse } from '../../utils/response';
import { SubjectService } from '../services/subject.service';
import { LogRepositoryImpl } from '../../infrastructure/repositories/log.respository.impl';
import { FileSystemDatasource } from '../../infrastructure/datasources/file-system.datasource';
import { UserRole } from '../../data';

export class SubjectRoutes {


  static get routes(): Router {

    const router = Router();


    const httpResponse = new HttpResponse();

    const LogRepository = new LogRepositoryImpl( 
      new FileSystemDatasource()
    );


    const subjectService = new SubjectService();
    const controller = new SubjectController(subjectService, LogRepository, httpResponse);

    // Definir las rutas
    router.get( '/', [ AuthMiddleware.validateRole( [UserRole.ADMIN, UserRole.STUDENT]) ],  controller.getSubjects );
    router.post( '/',  [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.createSubject );
    router.get( '/:id', [ AuthMiddleware.validateRole( [UserRole.ADMIN, UserRole.STUDENT]) ], controller.getSubjectById );
    router.put( '/:id', [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.updateSubject );
    router.delete( '/:id',  [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.deleteSubject );




    return router;
  }


}

