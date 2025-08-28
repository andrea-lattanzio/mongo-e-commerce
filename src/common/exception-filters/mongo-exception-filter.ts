import { Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { MongooseError, Error as MongooseBaseError } from "mongoose";
import { ArgumentsHost, HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Response } from "express";
import { MongoServerError } from "mongodb";

interface ErrorResponse {
  statusCode: number;
  message: string;
}

@Catch(
  MongooseError,
  MongoServerError
)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context: HttpArgumentsHost = host.switchToHttp();
    const response: Response = context.getResponse<Response>();

    let errorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    }

    if (exception instanceof MongoServerError && exception.code === 11000) {
      errorResponse = {
        statusCode: HttpStatus.CONFLICT,
        message: 'Duplicate key error',
      };
    }

    if (exception instanceof MongooseBaseError.ValidationError) {
      errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
      };
    }

    if (exception instanceof MongooseBaseError.DocumentNotFoundError) {
      errorResponse = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Document was not found',
      };
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

}