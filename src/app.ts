import "reflect-metadata";
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { postgresDataSource } from "./data/postgres/postgres-databse";


(async()=> {
  main();
})();


async function main() {

  await postgresDataSource.initialize()
  .then(() => {
      console.log('Connecton sucesfly')
  })
  .catch((error) => console.log(error))

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}