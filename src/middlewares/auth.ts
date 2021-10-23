import { NextFunction, Request, Response } from 'express';
import { UserTokenModel } from '../models/user-token';
import HttpStatus from '../utils/http-status';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fullToken = req.headers.authorization;
  const tokenKeyword =
    fullToken && fullToken.length > 0 ? fullToken.split(' ')[0] : undefined;
  const actualToken =
    fullToken && fullToken.length > 0 ? fullToken.split(' ')[1] : undefined;
  if (tokenKeyword !== 'Token') {
    return res
      .status(HttpStatus.HTTP_401_UNAUTHORIZED)
      .json({ error: 'Incorrect token keyword' });
  }
  if (tokenKeyword && actualToken) {
    const userToken = await UserTokenModel.findOne({ token: actualToken });
    if (userToken) {
      return next();
    }
  }
  return res
    .status(HttpStatus.HTTP_401_UNAUTHORIZED)
    .json({ error: 'User unauthenticated' });
};
