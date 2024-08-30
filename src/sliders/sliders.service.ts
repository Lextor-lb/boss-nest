import { Injectable } from '@nestjs/common';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class SlidersService {

  constructor(private prisma: PrismaService) {}

 async create(createSliderDto: CreateSliderDto) {

    return await this.prisma.slider.create({
      data: {
        mobileImage: createSliderDto.mobileImage,
        desktopImage: createSliderDto.desktopImage,
        sorting: parseInt(createSliderDto.sorting as any, 10), // Parsing sorting as an integer
      },
    });
    
  }

  findAll() {
    return this.prisma.slider.findMany();
  }

  findOne(id: number) {
    return  this.prisma.slider.findUnique({
      where: { id },
    });
  }

  update(id: number, updateSliderDto: UpdateSliderDto) {
    return `This action updates a #${id} slider`;
  }

  async remove(id: number) {
    return await this.prisma.slider.delete({
      where: { id },
    });
  }
}
