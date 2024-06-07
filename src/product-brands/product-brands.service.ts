import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductBrandDto } from './dto/create-product-brand.dto';

@Injectable()
export class ProductBrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductBrandDto: CreateProductBrandDto,
    filename: string,
    createdBy: number,
  ) {
    const createdMedia = await this.prisma.media.create({
      data: {
        url: `/uploads/brands/${filename}`,
        createdBy,
        updatedBy: createdBy,
      },
    });

    return this.prisma.productBrand.create({
      data: {
        name: createProductBrandDto.name,
        mediaId: createdMedia.id,
        createdBy,
        updatedBy: createdBy,
      },
    });
  }
}
