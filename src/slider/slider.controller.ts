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
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  async indexAll(): Promise<Record<string, any>>{
    const sliders = await this.sliderService.indexAll();
    
    const imageUrl = "https://amt.santar.store/uploads";

    const formattedSliders = [
      {
        desktopImage: imageUrl + sliders[0].place1Desktop.url,
        mobileImage: imageUrl + sliders[0].place1Desktop.url,
        sorting:1,
      },
      {
        desktopImage: imageUrl + sliders[0].place2Desktop.url,
        mobileImage: imageUrl + sliders[0].place2Desktop.url,
        sorting:2,
      },
      {
        desktopImage: imageUrl + sliders[0].place3Desktop.url,
        mobileImage: imageUrl + sliders[0].place3Desktop.url,
        sorting:3,
      },
      {
        desktopImage: imageUrl + sliders[0].place4Desktop.url,
        mobileImage: imageUrl + sliders[0].place4Desktop.url,
        sorting:4,
      }
    ]

    
    return {
      status: true,
      message: 'Fetched Successfully!',
      data: formattedSliders,
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){
    const slider = await this.sliderService.findOne(id);
    return new SliderEntity(slider);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
