// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
//   ValidationArguments,
// } from 'class-validator';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// @ValidatorConstraint({ async: true })
// export class PrismaExistsConstraint implements ValidatorConstraintInterface {
//   async validate(value: any, args: ValidationArguments) {
//     const [entity] = args.constraints;
//     switch (entity) {
//       case 'productType':
//         return await this.isProductTypeExists(value);
//       case 'productBrand':
//         return await this.isProductBrandExists(value);
//       case 'productCategory':
//         return await this.isProductCategoryExists(value);
//       case 'productFitting':
//         return await this.isProductFittingExists(value);
//       case 'productSizing':
//         return await this.isProductSizingExists(value);
//       case 'productFittings':
//         return await this.areProductFittingsExist(value);
//       default:
//         return false;
//     }
//   }

//   // Brand
//   private async isProductBrandExists(productBrandId: number) {
//     const type = await prisma.productBrand.findUnique({
//       where: { id: productBrandId },
//     });
//     return !!type;
//   }

//   // Category
//   private async isProductCategoryExists(productCategoryId: number) {
//     const type = await prisma.productCategory.findUnique({
//       where: { id: productCategoryId, isArchived: null },
//     });
//     return !!type;
//   }

//   // Type
//   private async isProductTypeExists(productTypeId: number) {
//     const type = await prisma.productType.findUnique({
//       where: { id: productTypeId, isArchived: null },
//     });
//     return !!type;
//   }

//   // Fitting
//   private async isProductFittingExists(productFittingId: number) {
//     const type = await prisma.productCategory.findUnique({
//       // Typo here, should be productFitting
//       where: { id: productFittingId, isArchived: null },
//     });
//     return !!type;
//   }

//   // Sizing
//   private async isProductSizingExists(productSizingId: number) {
//     const type = await prisma.productSizing.findUnique({
//       where: { id: productSizingId, isArchived: null },
//     });
//     return !!type;
//   }

//   // Fittings
//   private async areProductFittingsExist(productFittingIds: number[]) {
//     const fittings = await prisma.productFitting.findMany({
//       where: { id: { in: productFittingIds }, isArchived: null },
//     });
//     return fittings.length === productFittingIds.length;
//   }

//   // Add the faultMessage function
//   defaultMessage(args: ValidationArguments) {
//     const [entity] = args.constraints;
//     switch (entity) {
//       case 'productType':
//         return `Product type with ID ${args.value} does not exist`;
//       case 'productFitting':
//         return `Some product fittings with given IDs do not exist`;
//       default:
//         return `Invalid entity validation`;
//     }
//   }
// }

// export function IsEntityExists(
//   entity: string,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [entity],
//       validator: PrismaExistsConstraint,
//     });
//   };
// }
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  isNotEmpty,
  isInt,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { Transform } from 'class-transformer';

const prisma = new PrismaClient();

@ValidatorConstraint({ async: true })
export class PrismaExistsConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    if (value === null || value === undefined) {
      return false;
    }

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
      case 'productFittings':
        return await this.areProductFittingsExist(value);
      case 'productSizing':
        return await this.isProductSizingExists(value);
      case 'productSizings':
        return await this.areProductSizingsExist(value);

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

  // Sizings
  private async areProductSizingsExist(productSizingIds: number[]) {
    if (!Array.isArray(productSizingIds) || productSizingIds.length === 0)
      return false;

    const fittings = await prisma.productSizing.findMany({
      where: { id: { in: productSizingIds }, isArchived: null },
    });
    return fittings.length === productSizingIds.length;
  }

  // Fittings
  private async areProductFittingsExist(productFittingIds: number[]) {
    if (!Array.isArray(productFittingIds) || productFittingIds.length === 0)
      return false;

    const fittings = await prisma.productFitting.findMany({
      where: { id: { in: productFittingIds }, isArchived: null },
    });
    return fittings.length === productFittingIds.length;
  }

  defaultMessage(args: ValidationArguments) {
    const [entity] = args.constraints;
    switch (entity) {
      case 'productType':
        return `Product type with ID ${args.value} does not exist`;
      case 'productBrand':
        return `Product brand with ID ${args.value} does not exist`;
      case 'productCategory':
        return `Product category with ID ${args.value} does not exist`;
      case 'productFitting':
        return `Product fitting with ID ${args.value} does not exist`;
      case 'productSizing':
        return `Product sizing with ID ${args.value} does not exist`;
      case 'productSizings':
        return `Some product sizings with given IDs do not exist`;
      case 'productFittings':
        return `Some product fittings with given IDs do not exist`;
      default:
        return `Invalid entity validation`;
    }
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
