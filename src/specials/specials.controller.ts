import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecialsService } from './specials.service';
import { CreateSpecialDto } from './dto/create-special.dto';
import { UpdateSpecialDto } from './dto/update-special.dto';

@Controller('specials')
export class SpecialsController {
  constructor(private readonly specialsService: SpecialsService) {}

  @Post()
  create(@Body() createSpecialDto: CreateSpecialDto) {
    return this.specialsService.create(createSpecialDto);
  }

  @Get()
  findAll() {
    return this.specialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecialDto: UpdateSpecialDto) {
    return this.specialsService.update(+id, updateSpecialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialsService.remove(+id);
  }
}
