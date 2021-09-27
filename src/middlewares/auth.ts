import jwt from 'express-jwt';
import crypto from 'crypto';

const AUTH_SECRET: string = process.env.JWT_SECRET || 'placeholder-secret';

export default jwt({ secret: AUTH_SECRET, algorithms: ['HS256'] });
