import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UserController } from './controller';
import { UserService } from '../services/user.service';
import { HttpResponse } from '../../utils/response';
import { SubjectService } from '../services/subject.service';
import { LogRepositoryImpl } from '../../infrastructure/repositories/log.respository.impl';
import { FileSystemDatasource } from '../../infrastructure/datasources/file-system.datasource';
import { UserRole } from '../../data';

export class UserRoutes {


  static get routes(): Router {

    const router = Router();
    const LogRepository = new LogRepositoryImpl( 
      new FileSystemDatasource()
    );
    const userService = new UserService();
    const subjectService = new SubjectService();
    const httpResponse = new HttpResponse();
    const controller = new UserController( userService, subjectService, LogRepository, httpResponse );

    // Definir las rutas
    router.get( '/getCountStudent', [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.getCountStudent );
    router.get( '/getStudentsOrderByLastname', [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.getStudentsOrderByLastname );
    router.get( '/getStudentForMoreEvidences', [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.getStudentForMoreEvidences );
    router.get( '/:id', controller.getUserById, [ AuthMiddleware.validateRole( [UserRole.ADMIN, UserRole.STUDENT]) ], );
    router.put( '/:id', controller.updateUser, [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ],  );
    router.delete( '/:id', controller.deleteUser, [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ],  );
    router.post( '/assignSubjects/:id', [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ],  controller.assignSubjects );
    router.get( '/', [ AuthMiddleware.validateRole( [UserRole.ADMIN]) ], controller.getUsers );
   //router.post( '/',[ AuthMiddleware.validateJWT ], controller.createProduct );




    return router;
  }


}

