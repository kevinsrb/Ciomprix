import { Router } from 'express';
import { LogsController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { HttpResponse } from '../../utils/response';
import { LogRepositoryImpl } from '../../infrastructure/repositories/log.respository.impl';
import { FileSystemDatasource } from '../../infrastructure/datasources/file-system.datasource';
import { UserRole } from '../../data';
import { LogsService } from '../services';



export class LogsRoutes {


  static get routes(): Router {

    const LogRepository = new LogRepositoryImpl( 
      new FileSystemDatasource()
    );

    const router = Router();
    const logsService = new LogsService();
    const httpResponse = new HttpResponse()
    const controller = new LogsController(LogRepository, logsService, httpResponse);

    // Definir las rutas
  
    router.get( '/',  [ AuthMiddleware.validateRole( [UserRole.ADMIN])], controller.getLogs );




    return router;
  }


}

