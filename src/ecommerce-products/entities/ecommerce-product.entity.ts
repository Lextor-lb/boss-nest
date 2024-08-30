export class EcommerceProduct {}
import { Gender } from '@prisma/client';
import { MediaEntity } from 'src/media/entity/media.entity';

export class EcommerceProductEntity {
  id: number;
  name: string;
  gender: Gender;
  productBrand: string;
  productCode: string;
  salePrice: number;
  discountPrice: number;
  medias: MediaEntity[];

  constructor(partial: Partial<EcommerceProductEntity> = {}) {
    Object.assign(this, partial);
  }
}
