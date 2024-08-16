import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, Req, BadRequestException ,UseInterceptors} from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { Slider } from './entities/slider.entity';
import { multerOptions, resizeImage } from 'src';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) { }

  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async create(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {

   
    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }
  
    const desktopImage = files.find((file) => file.fieldname === 'desktopImage');
    const mobileImage = files.find((file) => file.fieldname === 'mobileImage');
  
    if (!desktopImage || !mobileImage) {
      throw new BadRequestException('Both desktop and mobile images are required');
    }
  
    // Assuming resizeImage returns the path of the resized image
    const resizedDesktopImagePath =  desktopImage.path;
    const resizedMobileImagePath =  mobileImage.path;
  
    createSliderDto.desktopImage = "https://amt.santar.store/uploads" + resizedDesktopImagePath;
    createSliderDto.mobileImage = "https://amt.santar.store/uploads" + resizedMobileImagePath;
    
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSliderDto: UpdateSliderDto) {
  //   return this.slidersService.update(+id, updateSliderDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slidersService.remove(+id);
  }
}
