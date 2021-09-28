import { Router, Request, Response } from 'express';
import Task, { BaseTaskDocument } from '../models/task';
import HttpStatus from '../utils/http-status';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const queryRes = await Task.find({}).lean();
  return res.status(HttpStatus.HTTP_200_OK).json(queryRes);
});

router.post('/', async (req: Request, res: Response) => {
  const newTask = req.body as BaseTaskDocument;
  if (!newTask) {
    return res.status(HttpStatus.HTTP_400_BAD_REQUEST);
  }
  try {
    const created = await Task.create(newTask);
    return res.status(HttpStatus.HTTP_201_CREATED).json(created.toObject());
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.HTTP_400_BAD_REQUEST)
      .json({ error: 'Failed to create new task.' });
  }
});

router.get('/:taskId', async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskId).lean();
    res.status(HttpStatus.HTTP_200_OK).json(task);
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.HTTP_404_NOT_FOUND)
      .json({ error: 'No task with the given id.' });
  }
});

router.put('/:taskId', async (req: Request, res: Response) => {
  if (!req.body) {
    return res
      .status(HttpStatus.HTTP_400_BAD_REQUEST)
      .json({ error: 'No field given' });
  }
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body);
    if (task) {
      return res.status(HttpStatus.HTTP_204_NO_CONTENT).send();
    }
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.HTTP_400_BAD_REQUEST)
      .json({ error: 'Failed to update model' });
  }
  return res
    .status(HttpStatus.HTTP_404_NOT_FOUND)
    .json({ error: 'Invalid task id' });
});

router.delete('/:taskId', async (req: Request, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    return res.status(HttpStatus.HTTP_204_NO_CONTENT).send();
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatus.HTTP_404_NOT_FOUND)
      .json({ error: 'Invalid task id' });
  }
});

export default router;
