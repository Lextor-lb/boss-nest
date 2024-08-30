import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class CustomBadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    if (Array.isArray(exceptionResponse.message)) {
      const formattedErrors = exceptionResponse.message.map((msg: string) => {
        // Find the first dot which separates the path part from the actual message
        const firstDotIndex = msg.indexOf('.');

        // If there is a dot, remove the part before it
        if (firstDotIndex !== -1) {
          return msg.slice(firstDotIndex + 1).trim();
        }

        return msg;
      });

      response.status(status).json({
        ...exceptionResponse,
        message: formattedErrors,
      });
    } else {
      response.status(status).json(exceptionResponse);
    }
  }
}
