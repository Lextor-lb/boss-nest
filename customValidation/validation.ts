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
export class PrismaExistsConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [entity] = args.constraints;
    switch (entity) {
      case 'productType':
        return await this.isProductTypeExists(value);
      case 'productBrand':
        return await this.isProductBrandExists(value);
      case 'productCategory':
        return await this.isProductCategoryExists(value);
      case 'productFitting':
        return await this.isProductFittingExists(value);
      case 'productSizing':
        return await this.isProductSizingExists(value);
      case 'productFittings':
        return await this.areProductFittingsExist(value);
      default:
        return false;
    }
  }

  // Brand
  private async isProductBrandExists(productBrandId: number) {
    const type = await prisma.productBrand.findUnique({
      where: { id: productBrandId },
    });
    return !!type;
  }

  // Category
  private async isProductCategoryExists(productCategoryId: number) {
    const type = await prisma.productCategory.findUnique({
      where: { id: productCategoryId, isArchived: null },
    });
    return !!type;
  }

  // Type
  private async isProductTypeExists(productTypeId: number) {
    const type = await prisma.productType.findUnique({
      where: { id: productTypeId, isArchived: null },
    });
    return !!type;
  }

  // Fitting
  private async isProductFittingExists(productFittingId: number) {
    const type = await prisma.productFitting.findUnique({
      where: { id: productFittingId, isArchived: null },
    });
    return !!type;
  }

  // Sizing
  private async isProductSizingExists(productSizingId: number) {
    const type = await prisma.productSizing.findUnique({
      where: { id: productSizingId, isArchived: null },
    });
    return !!type;
  }

  // Fittings
  private async areProductFittingsExist(productFittingIds: number[]) {
    const fittings = await prisma.productFitting.findMany({
      where: { id: { in: productFittingIds }, isArchived: null },
    });
    return fittings.length === productFittingIds.length;
  }
}

export function IsEntityExists(
  entity: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: PrismaExistsConstraint,
    });
  };
}

// defaultMessage(args: ValidationArguments) {
//   const [entity] = args.constraints;
//   switch (entity) {
//     case 'productType':
//       return `Product type with id ${args.value} does not exist`;
//     case 'productFitting':
//       return `Some product fittings with given ids do not exist`;
//     default:
//       return `Invalid validation`;
//   }
// }
