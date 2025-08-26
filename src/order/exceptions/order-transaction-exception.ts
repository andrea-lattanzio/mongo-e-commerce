import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderTransactionException extends HttpException {
  constructor(error) {
    super('An error occured while performing the order', HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
  }
}