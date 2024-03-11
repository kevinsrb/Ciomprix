

export enum LogSeverityLevel {
    low    = 'low',
    medium = 'medium',
    high   = 'high',
  }
  

export interface LogEntityOptions {
    ip: string;
    endpoint: string;
    statuscode: number;
    level: LogSeverityLevel;
    user: string;
    createdAt?: Date;
}

export class LogEntity {
    public ip: string;
    public endpoint: string;
    public statuscode: number;
    public level: LogSeverityLevel;
    public user: string;
    public createdAt: Date;

 
    constructor(options: LogEntityOptions ) {
        const { ip, endpoint, statuscode, level, user, createdAt = new Date() } = options;
        this.ip = ip;
        this.endpoint = endpoint;
        this.statuscode =  statuscode;
        this.level = level;
        this.user = user;
        this.createdAt = createdAt;
    }

    static fromJson = (json: string):LogEntity => {
        json = (json === '')? '{}' : json;
        const {ip, endpoint, statuscode, level, user } = JSON.parse(json);
        const log = new LogEntity({ip, endpoint, statuscode, level, user })

        return log;
        
    }

    static fromObject = (object: { [key: string]: any }): LogEntity => {
        const { ip, endpoint, statuscode, level, user } = object;

        const log = new LogEntity({
            ip, endpoint, statuscode, level, user
        })

        return log;
 
    }

}