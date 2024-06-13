// import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<any> {
    const {
      name,
      isEcommerce,
      isPos,
      gender,
      salePrice,
      stockPrice,
      productBrandId,
      productCategoryId,
      productFittingId,
      productTypeId,
      productVariants,
    } = createProductDto;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Create the product
        const product = await prisma.product.create({
          data: {
            name,
            isEcommerce,
            isPos,
            gender,
            stockPrice,
            salePrice,
            productBrandId,
            productCategoryId,
            productFittingId,
            productTypeId,
          },
        });

        // Save product images
        const productImages = files.filter(
          (file) => file.fieldname === 'images',
        );
        const mediaPromises = productImages.map((file) =>
          prisma.media.create({
            data: {
              url: `/uploads/products/${file.filename}`,
              productId: product.id,
            },
          }),
        );
        await Promise.all(mediaPromises);

        // Save product variants and their images
        if (productVariants && productVariants.length > 0) {
          for (let i = 0; i < productVariants.length; i++) {
            const variant = productVariants[i];
            const {
              shopCode,
              productCode,
              colorCode,
              barcode,
              productSizingId,
            } = variant;

            // Save the image for the variant
            const variantImageFieldname = `productVariants[${i}][image]`;
            const variantImage = files.find(
              (file) => file.fieldname === variantImageFieldname,
            );

            let mediaId: number | null = null;
            if (variantImage) {
              const media = await prisma.media.create({
                data: {
                  url: `/uploads/products/${variantImage.filename}`,
                },
              });
              mediaId = media.id;
            }

            await prisma.productVariant.create({
              data: {
                shopCode,
                productCode,
                colorCode,
                barcode,
                productSizingId,
                createdByUserId: createProductDto.createdByUserId,
                productId: product.id,
                mediaId,
              },
            });
          }
        }

        return {
          status: true,
          message: 'Created Successfully',
        };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log('Unique constraint violation error meta:', error.meta);
          // Adjust this condition based on the logged structure of error.meta
          if (
            error.meta &&
            Array.isArray(error.meta.target) &&
            error.meta.target.includes('barcode')
          ) {
            throw new BadRequestException('The barcode must be unique.');
          }
        }
      }
      console.error(error);
      throw new BadRequestException('Error creating product');
    }
  }
}
