import * as fs from 'fs'
import * as path from 'path';
import { CustomError } from '../../domain';


export class LogsService {


  constructor() {}


  async getLogs( ) {

    
    try{
      const logsFile = path.resolve( __dirname, '../../../', 'requests.log' );
      const data =  fs.readFileSync(logsFile, 'utf8');
      const logLines = data.trim().split('\n');
      const lastTenLogs = logLines.slice(-10);

      return lastTenLogs;
    } catch ( error ) {
      console.log(error);
      return '';
    }

  }



}