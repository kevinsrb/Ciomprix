import { NextFunction, Request, Response } from 'express';
import { JwtAdapter, bcryptAdapter } from '../../config';
import { User, UserRole } from '../../data';


export class AuthMiddleware {

  constructor(role: string)
  {
    
  }
  
  
  static async validateJWT( req: Request, res: Response, next: NextFunction ) {

    const authorization = req.header('Authorization');
    if( !authorization ) return res.status(401).json({ error: 'No token provided' });
    if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ error: 'Invalid Bearer token' });

    const token = authorization.split(' ').at(1) || '';


    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if ( !payload ) return res.status(401).json({ error: 'Invalid token' })
      
      const user = await User.findOneBy({ id: payload.id } );
      if ( !user ) return res.status(401).json({ error: 'Invalid token - user' }); 

      req.body.user = user;

      next();

    } catch (error) {
      
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });

    }
    
   }

   static validateRole(role: string[]) {
    return  (req: Request, res: Response, next: NextFunction) => {
      const user = req.body.user;
      if (!user) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
  
      if (!role.includes( user.role )) {
        return res.status(403).json({  success: false, error: 'Acceso prohibido. Rol no autorizado.' });
      }
  
      next();
    };
  }

}


