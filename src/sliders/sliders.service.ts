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
    return this.prisma.slider.findMany({
      orderBy: {
        sorting: 'asc', 
      },
    });
  }

  findOne(id: number) {
    return  this.prisma.slider.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSliderDto: UpdateSliderDto) {
    const updateData: Record<string, any> = {};
  
    if (updateSliderDto.mobileImage !== undefined && updateSliderDto.mobileImage !== null) {
      updateData.mobileImage = updateSliderDto.mobileImage;
    }
  
    if (updateSliderDto.desktopImage !== undefined && updateSliderDto.desktopImage !== null) {
      updateData.desktopImage = updateSliderDto.desktopImage;
    }
  
    if (updateSliderDto.sorting !== undefined && updateSliderDto.sorting !== null) {
      updateData.sorting = parseInt(updateSliderDto.sorting as any, 10);
    }
  
    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields to update');
    }
  
    return await this.prisma.slider.update({
      where: { id },
      data: updateData,
    });
  }
  
  async remove(id: number) {
    return await this.prisma.slider.delete({
      where: { id },
    });
  }
}
