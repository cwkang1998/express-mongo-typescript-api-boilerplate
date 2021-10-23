import crypto from 'crypto';
import { compare, hash } from 'bcrypt';

const SALT_ROUNDS = 16;

export const generateToken = () => crypto.randomBytes(128).toString('base64');

export const hashPassword = async (password: string) =>
  hash(password, SALT_ROUNDS);

export const verifyPassword = async (password: string, hashString: string) =>
  compare(password, hashString);
