/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { LoggerService, Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class AppLoggerService implements LoggerService {
  private logger: Logger;
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  constructor() {
    const customFormat = format.printf(
      ({ level, message, timestamp, stack, context }) => {
        const timestampStr = timestamp as string;
        const contextStr = context ? (context as string) : 'Application';
        const stackStr = stack ? (stack as string) : '';
        const levelStr = level;
        const messageStr = message as string;

        return `${timestampStr} [${contextStr}] ${levelStr}: ${messageStr} ${stackStr}`;
      },
    );

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        customFormat,
      ),
      transports: [
        // Console transport
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            customFormat,
          ),
        }),
        // File transport (Daily Rotate)
        new transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error', // Log errors to file
        }),
        new transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context: context || this.context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, {
      stack: trace,
      context: context || this.context,
    });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context: context || this.context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context: context || this.context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context: context || this.context });
  }
}
