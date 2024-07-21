import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class FormDataMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Transform boolean fields
    if (req.body.isEcommerce !== undefined){
      req.body.isEcommerce = req.body.isEcommerce === 'true';
    }
    if (req.body.isPos !== undefined) {
      req.body.isPos = req.body.isPos === 'true';
    }

    // Transform integer fields
    const integerFields = [
      'stockPrice',
      'salePrice',
      'productBrandId',
      'productTypeId',
      'productCategoryId',
      'productFittingId',
    ];

    integerFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.body[field] = parseInt(req.body[field], 10);
      }
    });
    console.log('running');
    next();
  }
}
