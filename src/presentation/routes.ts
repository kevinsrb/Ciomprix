import { Router } from 'express';

import { Authroutes } from './auth/routes';
import { EvidenceRoutes } from './evidence/routes';
import { SubjectRoutes } from './subject/routes';
import { UserRoutes } from './users/routes';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { LogsRoutes } from './logs/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth',  Authroutes.routes );
    router.use('/api/evidences', [ AuthMiddleware.validateJWT ] ,EvidenceRoutes.routes );
    router.use('/api/subjects',  [ AuthMiddleware.validateJWT ], SubjectRoutes.routes );
    router.use('/api/users',  [ AuthMiddleware.validateJWT], UserRoutes.routes );
    router.use('/api/logs',  [ AuthMiddleware.validateJWT], LogsRoutes.routes );



    return router;
  }


}

