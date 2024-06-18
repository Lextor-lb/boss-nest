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
