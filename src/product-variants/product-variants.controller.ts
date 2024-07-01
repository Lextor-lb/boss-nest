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
import { multerOptions } from 'src/media/multer-config';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileValidatorPipe } from 'src/shared/pipes/file-validator.pipe';
import { RemoveManyProductVariantDto } from './dto/removeMany-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Controller('product-variants')
@UseGuards(JwtAuthGuard)
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @Body() createProductVariant: CreateProductVariantDto,
    @UploadedFile(new FileValidatorPipe()) file: Express.Multer.File, // Apply custom validation
    @Req() req,
  ) {
    if (!createProductVariant.productId) {
      throw new BadRequestException('productId should not be empty');
    }
    createProductVariant.imageFileUrl = `/uploads/${file.filename}`;
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
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<any> {
    if (file) {
      updateProductVariantDto.imageFileUrl = `/uploads/${file.filename}`;
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
