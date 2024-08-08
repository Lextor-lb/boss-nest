import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, BadRequestException, Req, ParseIntPipe } from '@nestjs/common';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { JwtAuthGuard } from 'src/auth';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { multerOptions, resizeImage } from 'src/media';
import { FetchedSlider, MessageWithSlider } from 'src/shared/types/slider';
import { SliderEntity } from './entities/slider.entity';

@Controller('slider')
@UseGuards(JwtAuthGuard)
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async create(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    // Validate and process the uploaded files
    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    // Assume each place can have one desktop and one mobile image
    const places = ['place1', 'place2', 'place3', 'place4'];
    for (const place of places) {
      const desktopFile = files.find(file => file.fieldname === `${place}Desktop`);
      const mobileFile = files.find(file => file.fieldname === `${place}Mobile`);

      if (!desktopFile || !mobileFile) {
        throw new BadRequestException(`Images for ${place} are missing`);
      }

      await resizeImage(desktopFile.path); // Resize desktop image
      await resizeImage(mobileFile.path); // Resize mobile image

      createSliderDto[`${place}Desktop`] = `/uploads/${desktopFile.filename}`;
      createSliderDto[`${place}Mobile`] = `/uploads/${mobileFile.filename}`;
    }

    const slider = await this.sliderService.create(createSliderDto);
    return {
      status: true,
      message: 'Created Successfully!',
      data: slider,
    };
  }

  @Get('all')
  async indexAll(): Promise<any> {
    const sliders = await this.sliderService.indexAll();

    const formattedData = sliders.map(slider => {
      const entity = new SliderEntity(slider);
      return [
        {
          desktopImage: entity.place1Desktop,
          mobileImage: entity.place1Mobile,
          sorting: 1,
        },
        {
          desktopImage: entity.place2Desktop,
          mobileImage: entity.place2Mobile,
          sorting: 2,
        },
        {
          desktopImage: entity.place3Desktop,
          mobileImage: entity.place3Mobile,
          sorting: 3,
        },
        {
          desktopImage: entity.place4Desktop,
          mobileImage: entity.place4Mobile,
          sorting: 4,
        },
      ];
    });

    return {
      status: true,
      message: 'Fetched Successfully!',
      data: formattedData,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){
    const slider = await this.sliderService.findOne(id);
    return new SliderEntity(slider);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async update(
    @Param('id',ParseIntPipe) id: number,
    @Req() req, 
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateSliderDto: UpdateSliderDto): Promise<MessageWithSlider> {
    updateSliderDto.updatedByUserId = req.user.id;
    let userId = req.user.id;
    const updatedSlider = await this.sliderService.update(
      id,
      updateSliderDto,
      files,
      userId
    );

    return {
      status: true,
      message: 'Updated Successfully!',
      data: new SliderEntity(updatedSlider)
    };
  }
}
