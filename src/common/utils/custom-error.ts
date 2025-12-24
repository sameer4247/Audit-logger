import { HTTP_RESPONSE } from "../constants/httpResponse";


type CustomErrorType<T> = {
  errorCode: string,
  message: string,
  statusCode: number
  details?: T
}
export class CustomError<T> extends Error {
  statusCode: number;
  errorCode: string;
  details?: T;
  constructor({errorCode,  message = HTTP_RESPONSE.ERROR.MESSAGE.INTERNAL_SERVER_ERROR, statusCode =HTTP_RESPONSE.ERROR.STATUS.INTERNAL_SERVER_ERROR, details} : CustomErrorType<T>) {
    super(message);
    this.statusCode = statusCode ;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class ValidationError<T> extends CustomError<T>{
  constructor(message: string, details?: T) {
    super({errorCode: 'VALIDATION_ERROR', message, statusCode: 400, details});
  }
}
export class AuthError<T> extends CustomError<T> {
  constructor(message: string, details?: T) {
    super({errorCode: 'AUTH_ERROR', message, statusCode: 401, details});
  }
}

export class ForbiddenError<T> extends CustomError<T> {
  constructor(message: string, details?: T) {
    super({errorCode: 'FORBIDDEN', message, statusCode: 403, details});
  }
}

export class NotFoundError<T> extends CustomError<T> {
  constructor(resource: string, details?: T) {
    super({errorCode: 'RESOURCE_NOT_FOUND', message: `${resource} not found`, statusCode: 404, details});
  }
}

export class ConflictError<T> extends CustomError<T> {
  constructor(message: string, details?: T) {
        super({errorCode: 'CONFLICT', message, statusCode: 409, details});
  }
}

export class DatabaseError<T> extends CustomError<T> {
   constructor(message: string, details?: T) {
        super({errorCode: 'DB_ERROR', message, statusCode: 409, details});
  }
}