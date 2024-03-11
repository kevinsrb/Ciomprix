import { DataSource } from "typeorm"
import { envs } from "../../config"
import { User } from "./entities/User.entity"
import { Evidence } from "./entities/Evidence.entity"
import { Subject } from "./entities/Subject.entity"

export const postgresDataSource = new DataSource({
    type: "postgres",
    host: envs.POSTGRES_HOST,
    port: envs.POSTGRES_PORT,
    username: envs.POSTGRES_USER,
    password: envs.POSTGRES_PASSWORD,
    database: envs.POSTGRES_DB,
    entities: [__dirname + "/entities/*.entity{.ts,.js}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
    synchronize: false,
    migrationsRun: true,
    logging: false,
    //entities: [User, Evidence, Subject],
    
})
