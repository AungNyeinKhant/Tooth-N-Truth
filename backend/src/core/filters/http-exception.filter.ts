import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = {
        errors: (exception as ZodError).issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      };
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || message,
      ...(typeof message === 'object' && 'errors' in message
        ? { errors: (message as any).errors }
        : {}),
      timestamp: new Date().toISOString(),
    });
  }
}
