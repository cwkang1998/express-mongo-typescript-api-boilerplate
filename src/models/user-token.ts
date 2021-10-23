import mongoose from 'mongoose';

export interface UserToken {
  user?: string;
  token: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

export const UserTokenModel = mongoose.model<UserToken>('UserToken', schema);
