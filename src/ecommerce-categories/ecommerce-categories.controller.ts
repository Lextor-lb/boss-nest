import {
  Controller,
  Get,
  Post,
  Body,
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
import { FileValidatorPipe } from 'src/shared/pipes/file-validator.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EcommerceCategoryEntity } from './entities/ecommerce-category.entity';
import { ValidateIdExistsPipe } from 'src/shared/pipes/validateIdExists.pipe';
import { RemoveManyEcommerceCategoryDto } from './dto/removeMany-commerce-category.dto';
import { MinioService } from 'src/minio/minio.service';
import { RolesGuard } from 'src/auth/role-guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/role';

@Controller('ecommerce-categories')
export class EcommerceCategoriesController {
  constructor(
    private readonly ecommerceCategoriesService: EcommerceCategoriesService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createEcommerceCategoryDto: CreateEcommerceCategoryDto,
    @Req() req,
    @UploadedFile(new FileValidatorPipe()) file: Express.Multer.File,
  ) {
    const imageUrl = await this.minioService.uploadFile(file);
    createEcommerceCategoryDto.createdByUserId = req.user.id;
    createEcommerceCategoryDto.updatedByUserId = req.user.id;
    createEcommerceCategoryDto.imageFileUrl = imageUrl;

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', new ValidateIdExistsPipe('EcommerceCategory')) id: number,
    @Body() updateEcommerceCategoryDto: UpdateEcommerceCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (file) {
      const existing = await this.ecommerceCategoriesService.findOne(id);
      const imageUrl = await this.minioService.uploadFile(
        file,
        existing.media.image()?.split('/').pop(),
      );
      updateEcommerceCategoryDto.imageFileUrl = imageUrl;
    }
    updateEcommerceCategoryDto.updatedByUserId = req.user.id;
    return await this.ecommerceCategoriesService.update(
      id,
      updateEcommerceCategoryDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ecommerceCategoriesService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
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
