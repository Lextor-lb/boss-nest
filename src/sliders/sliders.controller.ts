import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  Req,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { Slider } from './entities/slider.entity';
import { multerOptions, PrismaService, resizeImage } from 'src';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { MinioService } from 'src/minio/minio.service';

dotenv.config();

@Controller('api/v1/sliders')
export class SlidersController {
  constructor(
    private readonly slidersService: SlidersService,
    private readonly minioService: MinioService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    const desktopImage = files.find(
      (file) => file.fieldname === 'desktopImage',
    );

    const mobileImage = files.find((file) => file.fieldname === 'mobileImage');

    if (!desktopImage || !mobileImage) {
      throw new BadRequestException(
        'Both desktop and mobile images are required',
      );
    }

    const desktopImageUrl = await this.minioService.uploadFile(desktopImage);

    const mobileImageUrl = await this.minioService.uploadFile(mobileImage);

    // Assuming resizeImage returns the path of the resized image
    const resizedDesktopImagePath = desktopImageUrl;

    const resizedMobileImagePath = mobileImageUrl;

    // Upload the images to Minio

    createSliderDto.desktopImage =
      `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/` +
      resizedDesktopImagePath;

    createSliderDto.mobileImage =
      `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/` +
      resizedMobileImagePath;

    createSliderDto.sorting = req.body.sorting;

    const newSlider = await this.slidersService.create(createSliderDto);

    return newSlider;
  }

  @Get()
  async findAll() {
    const sliders = await this.slidersService.findAll();

    return {
      status: true,
      message: 'Fetched Successfully!',
      data: sliders.map((slider) => new Slider(slider)),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new Slider(await this.slidersService.findOne(+id));
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const existingSlider = await this.prisma.slider.findUnique({
      where: { id: +id },
    });
    const oldDesktopImageFileUrl = existingSlider.desktopImage.split('/').pop();
    const oldMobileImageFileUrl = existingSlider.mobileImage.split('/').pop();

    let desktopImageUrl: string | null = null;
    let mobileImageUrl: string | null = null;

    if (files && files.length > 0) {
      const desktopImage = files.find(
        (file) => file.fieldname === 'desktopImage',
      );
      const mobileImage = files.find(
        (file) => file.fieldname === 'mobileImage',
      );

      if (desktopImage) {
        desktopImageUrl = await this.minioService.uploadFile(
          desktopImage,
          oldDesktopImageFileUrl,
        );
        updateSliderDto.desktopImage = `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${desktopImageUrl}`;
      }

      if (mobileImage) {
        mobileImageUrl = await this.minioService.uploadFile(
          mobileImage,
          oldMobileImageFileUrl,
        );
        // Set the full URL for mobile image
        updateSliderDto.mobileImage = `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${mobileImageUrl}`;
      }
    }

    if (req.body.sorting !== undefined && req.body.sorting !== null) {
      updateSliderDto.sorting = req.body.sorting;
    }

    const updatedSlider = await this.slidersService.update(
      +id,
      updateSliderDto,
    );

    return updatedSlider;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slidersService.remove(+id);
  }
}
