import mongoose from 'mongoose';

export interface Task {
  name: string;
  description: string;
  done: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model<Task>('Task', schema);
