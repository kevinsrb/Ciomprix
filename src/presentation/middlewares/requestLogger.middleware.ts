import { Request, NextFunction, Response } from 'express';
import fs from 'fs';

export class RequestLogger {
    static logRequest(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip;
        const statusCode = req.statusCode;
        const endpoint = req.originalUrl;
        const timestamp = new Date().toISOString();
        const user = req.body.user;

        const log = `${ip} | ${endpoint} | ${statusCode} | ${user} | ${timestamp} \n`;

        fs.appendFile('requests.log', log, (err) => {
            if (err) {
                console.error('Error al escribir en el archivo de registro de solicitudes:', err);
            }
        });

        next();
    }
}