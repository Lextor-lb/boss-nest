import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantEntity } from './entity/product-variant.entity';
import { multerOptions, resizeImage } from 'src/media/multer-config';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileValidatorPipe } from 'src/shared/pipes/file-validator.pipe';
import { RemoveManyProductVariantDto } from './dto/removeMany-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { Roles } from 'src/auth/role';
import { RolesGuard } from 'src/auth/role-guard';
import { UserRole } from '@prisma/client';
import { MinioService } from 'src/minio/minio.service';
import { PrismaService } from 'src/prisma';

@Controller('product-variants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
    private readonly minioService: MinioService,
    private readonly prisma: PrismaService,
  ) {}
  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductVariant: CreateProductVariantDto,
    @UploadedFile(new FileValidatorPipe()) file: Express.Multer.File, // Apply custom validation
    @Req() req,
  ) {
    if (!createProductVariant.productId) {
      throw new BadRequestException('productId should not be empty');
    }
    const imageUrl = await this.minioService.uploadFile(file);
    createProductVariant.imageFileUrl = imageUrl;
    createProductVariant.createdByUserId = req.user.id;
    createProductVariant.updatedByUserId = req.user.id;
    const productVariant =
      await this.productVariantsService.create(createProductVariant);

    return {
      status: true,
      message: 'Created Successfully!',
      data: new ProductVariantEntity(productVariant),
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<any> {
    if (file) {
      const existingVariant = await this.prisma.productVariant.findUnique({
        where: { id },
        include: { media: true },
      });

      const imageUrl = await this.minioService.uploadFile(
        file,
        existingVariant.media.url,
      );
      updateProductVariantDto.imageFileUrl = imageUrl;
    }
    updateProductVariantDto.updatedByUserId = req.user.id;
    return await this.productVariantsService.update(
      id,
      updateProductVariantDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productVariantsService.remove(id);
  }

  @Delete()
  @Roles(UserRole.ADMIN)
  async removeMany(
    @Body() removeManyProductVariantDto: RemoveManyProductVariantDto,
  ) {
    const result = await this.productVariantsService.removeMany(
      removeManyProductVariantDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
