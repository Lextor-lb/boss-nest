import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantEntity } from './entity/product-variant.entity';
import { MediaEntity } from 'src/media/entity/media.entity';
import { MediaDto } from 'src/media/dto/media.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService, // Inject MediaService
  ) {}
  whereCheckingNullClause: Prisma.ProductVariantWhereInput = {
    isArchived: null,
  };

  async create(createProductVariantDto: CreateProductVariantDto) {
    try {
      const { imageFileUrl, ...variantData } = createProductVariantDto;

      const productVariant = await this.prisma.$transaction(
        async (transactionClient: PrismaClient) => {
          const mediaDto = new MediaDto();
          mediaDto.url = imageFileUrl;
          const uploadedMedia = await this.mediaService.saveMedia(
            transactionClient,
            mediaDto,
          );

          const productVariant = await transactionClient.productVariant.create({
            data: { ...variantData, mediaId: uploadedMedia.id },
          });

          return { ...productVariant, media: uploadedMedia };
        },
      );
      return new ProductVariantEntity({
        ...productVariant,
        media: new MediaEntity(productVariant.media),
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('The barcode must be unique.');
        }
      }
      console.error(error);
      throw new BadRequestException('Error creating product');
    }
  }

  async createWithTransaction(
    transactionClient: PrismaClient,
    createProductVariantDto: CreateProductVariantDto,
  ) {
    try {
      const { imageFileUrl, ...variantData } = createProductVariantDto;

      const mediaDto = new MediaDto();
      mediaDto.url = imageFileUrl;
      const uploadedMedia = await this.mediaService.saveMedia(
        transactionClient,
        mediaDto,
      );

      const productVariant = await transactionClient.productVariant.create({
        data: { ...variantData, mediaId: uploadedMedia.id },
      });

      return productVariant;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('The barcode must be unique.');
        }
      }
      console.error(error);
      throw new BadRequestException('Error creating product variant');
    }
  }
}
