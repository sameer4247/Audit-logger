import { HTTP_RESPONSE } from "../constants/httpResponse";

export class CustomError extends Error {
  statusCode: number;
  errorCode: string;
  constructor(errorCode: string,  message: string = HTTP_RESPONSE.ERROR.MESSAGE.INTERNAL_SERVER_ERROR, statusCode: number = HTTP_RESPONSE.ERROR.STATUS.INTERNAL_SERVER_ERROR, ) {
    super(message);
    this.statusCode = statusCode ;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class ValidationError extends CustomError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}
export class AuthError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super('AUTH_ERROR', message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
  }
}