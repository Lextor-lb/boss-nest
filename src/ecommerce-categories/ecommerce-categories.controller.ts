import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  UsePipes,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { EcommerceCategoriesService } from './ecommerce-categories.service';
import { CreateEcommerceCategoryDto } from './dto/create-ecommerce-category.dto';
import { UpdateEcommerceCategoryDto } from './dto/update-ecommerce-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, resizeImage } from 'src/media';
import { FileValidatorPipe } from 'src/shared/pipes/file-validator.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EcommerceCategoryEntity } from './entities/ecommerce-category.entity';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { RemoveManyEcommerceCategoryDto } from './dto/removeMany-commerce-category.dto';

@Controller('ecommerce-categories')
@UseGuards(JwtAuthGuard)
export class EcommerceCategoriesController {
  constructor(
    private readonly ecommerceCategoriesService: EcommerceCategoriesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @Body() createEcommerceCategoryDto: CreateEcommerceCategoryDto,
    @Req() req,
    @UploadedFile(new FileValidatorPipe()) file: Express.Multer.File,
  ) {
    await resizeImage(file.path);
    createEcommerceCategoryDto.createdByUserId = req.user.id;
    createEcommerceCategoryDto.updatedByUserId = req.user.id;
    createEcommerceCategoryDto.imageFileUrl = `/uploads/${file.filename}`;

    return await this.ecommerceCategoriesService.create(
      createEcommerceCategoryDto,
    );
  }

  @Get()
  findAll(): Promise<EcommerceCategoryEntity[]> {
    return this.ecommerceCategoriesService.findAll();
  }

  @Get(':id')
  @UsePipes(new ValidateIdExistsPipe('EcommerceCategory'))
  async findOne(@Param('id') id: number): Promise<EcommerceCategoryEntity> {
    return await this.ecommerceCategoriesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id', new ValidateIdExistsPipe('EcommerceCategory')) id: number,
    @Body() updateEcommerceCategoryDto: UpdateEcommerceCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (file) {
      await resizeImage(file.path);
      updateEcommerceCategoryDto.imageFileUrl = `/uploads/${file.filename}`;
    }
    updateEcommerceCategoryDto.updatedByUserId = req.user.id;
    return await this.ecommerceCategoriesService.update(
      id,
      updateEcommerceCategoryDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ecommerceCategoriesService.remove(id);
  }

  @Delete()
  async removeMany(
    @Body() removeManyEcommerceCategoryDto: RemoveManyEcommerceCategoryDto,
  ) {
    const result = await this.ecommerceCategoriesService.removeMany(
      removeManyEcommerceCategoryDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
