import { Request, Response, NextFunction } from 'express';
import { createRequestLogger } from '../common/utils/logger';

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
    try {
        const startTime = Date.now();
        res.on('finish', () => {
            const durationMs = Date.now() - startTime;
            createRequestLogger(req.method, req.originalUrl, res.statusCode, durationMs);
        });
        next();
    } catch (error) {
        next(error);
    }
}
