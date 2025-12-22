import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { asyncContext } from '../common/utils/context';

export function injectContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  const userId = (req as any)?.user?.userId;

  asyncContext.run(
    {
      requestId,
      userId,
      timestamp: Date.now()
    },
    () => {
      res.setHeader('x-request-id', requestId);
      next();
    }
  );
}