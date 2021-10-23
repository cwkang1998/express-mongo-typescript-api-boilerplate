import { Request, Response } from 'express';
import { User, UserModel } from '../models/user';
import { UserTokenModel } from '../models/user-token';
import { generateToken, hashPassword, verifyPassword } from '../utils/auth';
import HttpStatus from '../utils/http-status';

export default class UserController {
  async getAll(req: Request, res: Response) {
    const queryRes = await UserModel.find({}).select('-password').lean();
    return res.status(HttpStatus.HTTP_200_OK).json(queryRes);
  }

  async getOne(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.userId).lean();
      if (user) {
        const { password, ...publicUser } = user;
        return res.status(HttpStatus.HTTP_200_OK).json(publicUser);
      }
    } catch (error) {
      console.error(error);
    }
    return res
      .status(HttpStatus.HTTP_404_NOT_FOUND)
      .json({ error: 'User not found' });
  }

  async deleteOne(req: Request, res: Response) {
    try {
      await UserModel.findByIdAndDelete(req.params.userId);
      return res.status(HttpStatus.HTTP_204_NO_CONTENT).send();
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.HTTP_404_NOT_FOUND)
        .json({ error: 'Invalid user id' });
    }
  }

  async signup(req: Request, res: Response) {
    const newUser = req.body as User;
    if (!newUser || !newUser.email || !newUser.password) {
      return res
        .status(HttpStatus.HTTP_400_BAD_REQUEST)
        .json({ error: 'Not enough information provided.' });
    }
    try {
      const hashedPass = await hashPassword(newUser.password);

      const created = await UserModel.create({
        ...newUser,
        password: hashedPass,
      });
      const { password, ...publicUser } = created.toObject();
      return res.status(HttpStatus.HTTP_201_CREATED).json(publicUser);
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.HTTP_400_BAD_REQUEST)
        .json({ error: 'Failed to create new user.' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body as { email: string; password: string };
    const matchingUser = await UserModel.findOne({ email });
    if (matchingUser) {
      const isCorrectPass = await verifyPassword(
        password,
        matchingUser.password
      );
      if (isCorrectPass) {
        const authToken = generateToken();
        await UserTokenModel.create({
          user: matchingUser,
          token: authToken,
        });
        return res.status(HttpStatus.HTTP_200_OK).json({ token: authToken });
      }
    }
    return res
      .status(HttpStatus.HTTP_401_UNAUTHORIZED)
      .json({ error: 'Incorrect email or password.' });
  }

  async logout(req: Request, res: Response) {
    const fullToken = req.headers.authorization;
    const actualToken =
      fullToken && fullToken.length > 0 ? fullToken.split(' ')[1] : undefined;
    if (actualToken) {
      await UserTokenModel.updateOne({ token: actualToken }, { active: false });
    }
    return res.status(HttpStatus.HTTP_204_NO_CONTENT).send();
  }
}
