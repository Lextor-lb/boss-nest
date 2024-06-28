import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, Query } from '@nestjs/common';
import { SpecialsService } from './specials.service';
import { CreateSpecialDto } from './dto/create-special.dto';
import { UpdateSpecialDto } from './dto/update-special.dto';
import { MessageWithSpecial, SearchOption, SpecialPagination } from 'src/shared/types';
import { SpecialEntity } from './entities';

@Controller('specials')
export class SpecialsController {
  constructor(private readonly specialsService: SpecialsService) {}

  @Post()
  async create(@Body() createSpecialDto: CreateSpecialDto) {
    return this.specialsService.create(createSpecialDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<SpecialPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection
    };

    const specials = await this.specialsService.findAll(searchOptions);
    return {
      data: specials.data.map((special) => new SpecialEntity(special)),
      page: specials.page,
      limit: specials.limit,
      total: specials.total
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const special = await this.specialsService.findOne(id);
    return new SpecialEntity(special);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateSpecialDto: UpdateSpecialDto
  ): Promise<MessageWithSpecial> {
    updateSpecialDto.updatedByUserId = req.user.id;
    const updatedSpecial = await this.specialsService.update(id, updateSpecialDto);

    return {
      status: true,
      message: 'Updated Successfully!',
      data: new SpecialEntity(updatedSpecial)
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<MessageWithSpecial> {
    const result = await this.specialsService.remove(id);

    return {
      status: true,
      message: 'Deleted Successfully!'
    };
  }
}