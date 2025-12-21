import { Response } from 'express';
import { HTTP_RESPONSE } from '../constants/httpResponse';

type CustomResponse<T> = {
  res: Response;
  statusCode: number;
  message: string;
  data?: T;
};

export function sendCustomResponse<T>({
  res,
  statusCode = HTTP_RESPONSE.SUCCESS.STATUS.OK,
  message = HTTP_RESPONSE.SUCCESS.MESSAGE.OK,
  data,
}: CustomResponse<T>) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}