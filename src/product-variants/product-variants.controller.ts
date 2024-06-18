import {
  Body,
  Controller,
  Post,
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
}
