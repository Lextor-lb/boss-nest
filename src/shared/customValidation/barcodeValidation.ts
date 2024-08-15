import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@ValidatorConstraint({ async: true })
class IsUniqueVoucherCodeConstraint implements ValidatorConstraintInterface {
  async validate(voucherCode: string, args: ValidationArguments) {
    const voucher = await prisma.voucher.findUnique({
      where: { voucherCode },
    });
    return !voucher; // Return true if no voucher with the same voucherCode is found
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} already exists. Please use another voucher code.`;
  }
}

@ValidatorConstraint({ async: true })
class IsUniqueBarcodeConstraint implements ValidatorConstraintInterface {
  async validate(barcode: string, args: ValidationArguments) {
    const productVariant = await prisma.productVariant.findUnique({
      where: { barcode },
    });
    return !productVariant; // Return true if no productVariant with the same barcode is found
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} already exists. Please use another barcode.`;
  }
}

@ValidatorConstraint({ async: true })
class IsUniqueOrderIdConstraint implements ValidatorConstraintInterface {
  async validate(orderCode: string, args: ValidationArguments) {
    const order = await prisma.order.findUnique({
      where: { orderCode },
    });
    return !order; // Return true if no order with the same orderId is found
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} already exists. Please use another order ID.`;
  }
}

export function IsUniqueVoucherCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueVoucherCodeConstraint,
    });
  };
}

export function IsUniqueBarcode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueBarcodeConstraint,
    });
  };
}

export function IsUniqueOrderId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueOrderIdConstraint,
    });
  };
}
