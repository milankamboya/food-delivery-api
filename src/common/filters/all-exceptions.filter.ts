import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppLoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: AppLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] | object = 'Internal server error';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        message = (response as any).message;
      } else {
        message = exception.message;
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      // timestamp: new Date().toISOString(),
      // path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
      message,
    };

    // Log the error
    let errorMessage = 'Unknown Error';
    let stackTrace = '';

    if (exception instanceof Error) {
      errorMessage = exception.message;
      stackTrace = exception.stack || '';
    }

    this.logger.error(
      `Http Status: ${httpStatus} Error Message: ${errorMessage}`,
      stackTrace,
      'AllExceptionsFilter',
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
