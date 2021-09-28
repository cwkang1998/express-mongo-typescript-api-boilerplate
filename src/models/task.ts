import mongoose from 'mongoose';

export interface BaseTaskDocument {
  name: string;
  description: string;
  done: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface TaskDocument extends BaseTaskDocument, mongoose.Document {}

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

export default mongoose.model<TaskDocument>('Task', schema);
