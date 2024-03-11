import { Router } from 'express';
import { AuthController } from './controller';
import { HttpResponse } from '../../utils/response';
import { AuthService } from '../services';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogRepositoryImpl } from '../../infrastructure/repositories/log.respository.impl';
import { FileSystemDatasource } from "../../infrastructure/datasources/file-system.datasource"



export class Authroutes {


  static get routes(): Router {

    const router = Router();

    const LogRepository = new LogRepositoryImpl( 
      new FileSystemDatasource()
    );

    const httpResponse = new HttpResponse()

    const authService = new AuthService();
    const controller = new AuthController(authService, httpResponse, LogRepository);
    
    // Definir las rutas
    router.post('/login', controller.loginUser );
    router.post('/register', controller.registerUser );
    



    return router;
  }


}

