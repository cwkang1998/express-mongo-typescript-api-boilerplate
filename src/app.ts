import express, { Application, Router } from 'express';
import { Mongoose } from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import AdminBro from 'admin-bro';
import AdminBroMongooseAdapter from '@admin-bro/mongoose';
import AdminBroExpress from '@admin-bro/express';
import swaggerUi from 'swagger-ui-express';
import initTaskModule from './task';
import initUserModule from './user';
import swaggerDoc from './openapi.json';

const createApp = (mongoose: Mongoose) => {
  const app: Application = express();
  const main: Router = Router();

  AdminBro.registerAdapter(AdminBroMongooseAdapter);
  const adminBro = new AdminBro({
    databases: [mongoose],
    rootPath: '/admin',
  });
  const adminPanelRouter = AdminBroExpress.buildRouter(adminBro);

  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'));

  const taskRoutes = initTaskModule();
  const userRoutes = initUserModule();

  main.use(adminBro.options.rootPath, adminPanelRouter);
  main.use('/task', taskRoutes);
  main.use('/user', userRoutes);

  // Documentation
  main.use('/docs', swaggerUi.serve);
  main.get('/docs', swaggerUi.setup(swaggerDoc));

  // Api Version Main Route
  app.use('/', main);
  return app;
};

export default createApp;
