import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../common/utils/custom-error';
export function validationMiddleware(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObj = plainToInstance(dtoClass, {...req.body, ...req.params, ...req.query});
      const errors = await validate(dtoObj);
      if (errors.length > 0) {
        const formattedErrors = errors.map(err => ({
          property: err.property,
          constraints: err.constraints,
        }));
        console.log("err", errors);
        throw new ValidationError('Invalid input data', formattedErrors);
      } else {
        req.body = dtoObj;
        next();
      }
    }
    catch (error) {
      next(error);
    }
  }
}