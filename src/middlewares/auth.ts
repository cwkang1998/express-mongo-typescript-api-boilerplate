import jwt from 'express-jwt';

const AUTH_SECRET: string = process.env.JWT_SECRET || 'placeholder-secret';

export default jwt({ secret: AUTH_SECRET, algorithms: ['HS256'] });
