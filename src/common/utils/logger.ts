import pino, { Logger } from 'pino';
import { getContext } from './context';
import path from 'path';

let loggerInstance: Logger | null = null;

function createLogger(): Logger {
  const transport = process.env.LOG_SINK === 'console'
    ? pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard'
        }
      })
    : pino.transport({
        target: 'pino/file',
        options: {
          destination: path.join(__dirname , '../../../logs/app.log'),
          mkdir: true
        }
      });

  return pino(
    {
      level: process.env.LOG_LEVEL,
      timestamp: pino.stdTimeFunctions.isoTime,
      serializers: {
        req: (req: any) => ({
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
          params: req.params
        }),
        res: (res: any) => ({
          statusCode: res.statusCode,
          body: res.body
        })
      }
    },
    transport
  );
}

export function getLogger(): Logger {
  if (!loggerInstance) {
    loggerInstance = createLogger();
  }
  return loggerInstance;
}

export function createRequestLogger(
  method: string,
  url: string,
  statusCode: number,
  durationMs: number
) {
  const logger = getLogger();
  const context = getContext();

  logger.info({
    msg: 'HTTP request',
    requestId: context?.requestId,
    userId: context?.userId,
    method,
    url,
    statusCode,
    durationMs
  });
}
