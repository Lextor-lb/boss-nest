import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, Req } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { Slider } from './entities/slider.entity';

@Controller('api/v1/sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) { }

  @Post()
  async create(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {

    if (files && files.length > 0) 
    {
      createSliderDto.mobileImage = files[0]?.path; // Save file path or URL
      createSliderDto.desktopImage = files[1]?.path; // Save file path or URL
    }

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
