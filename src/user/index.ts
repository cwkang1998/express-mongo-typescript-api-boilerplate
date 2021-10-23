import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth';
import TaskController from './controller';

const initUserModule = () => {
  const router: Router = Router();

  const controller = new TaskController();

  router.get('/', isAuthenticated, controller.getAll.bind(controller));
  router.get('/:userId', isAuthenticated, controller.getOne.bind(controller));
  router.delete(
    '/:userId',
    isAuthenticated,
    controller.deleteOne.bind(controller)
  );

  router.post('/signup', controller.signup.bind(controller));
  router.post('/login', controller.login.bind(controller));
  router.get('/logout', isAuthenticated, controller.logout.bind(controller));
  return router;
};

export default initUserModule;
