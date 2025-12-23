import { Response } from 'express';
import { getContext } from './context';
type CustomResponseType<T> = {
  res: Response;
  statusCode: number;
  message: string;
  data?: T;
};

export function sendCustomResponse<T>({
  res,
  statusCode,
  message,
  data,
}: CustomResponseType<T>) {
  const requestId = getContext()?.requestId;
  const userId = getContext()?.userId;
  //async audit-logging here
  const auditPayload = {

  }
  return res.status(statusCode).json({
    requestId,
    message,
    data,
  });
}