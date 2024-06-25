import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
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
    @Req() req
  ): Promise<SpecialPagination> {
    const {page, limit, search, orderBy, orderDirection} = req.query;
    const searchOptions: SearchOption = {
      page: parseInt(page, 10) || 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search: search || '',
      orderBy: orderBy || 'id',
      orderDirection: orderDirection || 'ASC'
    };

    const specials = await this.specialsService.findAll(searchOptions);
    return {
      data: specials.data.map((special) => new SpecialEntity(special));
      page: specials.page,
      limit: specials.limit
    }
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
    const updatedSpecial = await this.specialsService.update(
      id,
      updateSpecialDto
    );

    return {
      status: true,
      message: 'Updated Successfully!',
      data: new SpecialEntity(updatedSpecial)
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number): Promise<MessageWithSpecial> {
    const result = await this.specialsService.remove(id);

    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result
    }
  }
}
