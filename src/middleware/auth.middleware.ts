import { Request, Response, NextFunction } from 'express';
import { AuthError, ForbiddenError } from '../common/utils/custom-error';
import { createHashKey } from '../common/utils/keygen';
import { prisma } from '../db/prisma';
import { getContext } from '../common/utils/context';
import { Role } from '../prisma/generated/primsa/enums';

export const authMiddleware = (allowedRoles: Role[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.path === '/health') {
      return next();
    }
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      throw new AuthError('Missing or invalid api key');
    }
    try {
      const hashkey = createHashKey(apiKey.trim());
      const user = await prisma.user.findUniqueOrThrow({
        where: { credentials: hashkey }
      });
      (req as any).user = user;
      if (allowedRoles?.length && !allowedRoles.includes((req as any)?.user?.role)) {
        const forbiddenError = new ForbiddenError("You are not authorised to access this resource.")
        next(forbiddenError);
      }
      const ctx = getContext();
      if (ctx?.userId == undefined) ctx!.userId = user.id || "sys";
      next();
    } catch (error) {
      throw new AuthError('Invalid api key');
    }
  }
}
