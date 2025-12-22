import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../common/utils/custom-error';
import { createHashKey } from '../common/utils/keygen';
import { prisma } from '../db/prisma';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if(req.path === '/health') {
    return next();
  }
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) {
    throw new AuthError('Missing or invalid api key');
  }
  try {
    const hashkey = createHashKey(apiKey.trim());
    const user = await prisma.user.findUniqueOrThrow({
        where : {credentials: hashkey}
    })
    Object.assign(req, user)
    next();
  } catch (error) {
    throw new AuthError('Invalid api key');
  }
}
