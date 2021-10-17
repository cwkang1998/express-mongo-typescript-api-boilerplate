import { Router } from 'express';
import TaskController from './controller';

const initTaskModule = () => {
  const router: Router = Router();

  const controller = new TaskController();

  router.get('/', controller.getAll.bind(controller));
  router.post('/', controller.createOne.bind(controller));
  router.get('/:taskId', controller.getOne.bind(controller));
  router.put('/:taskId', controller.updateOne.bind(controller));
  router.delete('/:taskId', controller.deleteOne.bind(controller));

  return router;
};

export default initTaskModule;
