import express, {
  Application, Router, Request, Response,
} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import taskRoutes from './routes/task';
import swaggerDoc from './openapi.json';

const app: Application = express();
const main: Router = Router();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

main.get('/', (_req: Request, res: Response) => {
  res.send('Root of API');
});

main.use('/task', taskRoutes);

// Documentation
main.use('/docs', swaggerUi.serve);
main.get('/docs', swaggerUi.setup(swaggerDoc));

// Api Version Main Route
app.use('/', main);

export default app;
