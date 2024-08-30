import { HttpException, HttpStatus } from '@nestjs/common';

export class BarcodeAlreadyExistsException extends HttpException {
  constructor() {
    super('Barcode already exists', HttpStatus.CONFLICT);
  }
}
