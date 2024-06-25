import { Injectable } from '@nestjs/common';
import { CreateSpecialDto } from './dto/create-special.dto';
import { UpdateSpecialDto } from './dto/update-special.dto';

@Injectable()
export class SpecialsService {
  create(createSpecialDto: CreateSpecialDto) {
    return 'This action adds a new special';
  }

  findAll() {
    return `This action returns all specials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} special`;
  }

  update(id: number, updateSpecialDto: UpdateSpecialDto) {
    return `This action updates a #${id} special`;
  }

  remove(id: number) {
    return `This action removes a #${id} special`;
  }
}
