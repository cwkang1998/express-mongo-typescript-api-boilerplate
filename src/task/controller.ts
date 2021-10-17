import { Request, Response } from 'express';
import { Task, TaskModel } from '../models/task';
import HttpStatus from '../utils/http-status';

export default class TaskController {
  async getAll(req: Request, res: Response) {
    const queryRes = await TaskModel.find({}).lean();
    return res.status(HttpStatus.HTTP_200_OK).json(queryRes);
  }

  async createOne(req: Request, res: Response) {
    const newTask = req.body as Partial<Task>;
    if (!newTask) {
      return res.status(HttpStatus.HTTP_400_BAD_REQUEST);
    }
    try {
      const created = await TaskModel.create(newTask);
      return res.status(HttpStatus.HTTP_201_CREATED).json(created.toObject());
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.HTTP_400_BAD_REQUEST)
        .json({ error: 'Failed to create new task.' });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const task = await TaskModel.findById(req.params.taskId).lean();
      res.status(HttpStatus.HTTP_200_OK).json(task);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.HTTP_404_NOT_FOUND)
        .json({ error: 'No task with the given id.' });
    }
  }

  async updateOne(req: Request, res: Response) {
    if (!req.body) {
      return res
        .status(HttpStatus.HTTP_400_BAD_REQUEST)
        .json({ error: 'No field given' });
    }
    try {
      const task = await TaskModel.findByIdAndUpdate(
        req.params.taskId,
        req.body
      );
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
  }

  async deleteOne(req: Request, res: Response) {
    try {
      await TaskModel.findByIdAndDelete(req.params.taskId);
      return res.status(HttpStatus.HTTP_204_NO_CONTENT).send();
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.HTTP_404_NOT_FOUND)
        .json({ error: 'Invalid task id' });
    }
  }
}
