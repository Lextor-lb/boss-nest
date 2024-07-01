import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpecialDto } from './dto/create-special.dto';
import { UpdateSpecialDto } from './dto/update-special.dto';
import { SearchOption, SpecialPagination } from 'src/shared/types';

@Injectable()
export class SpecialsService {
  constructor(private prisma: PrismaService) {}

  async create(createSpecialDto: CreateSpecialDto) {
    return this.prisma.special.create({
      data: createSpecialDto,
    });
  }

  async findAll(searchOptions: SearchOption): Promise<SpecialPagination> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;

    const [total, specials] = await this.prisma.$transaction([
      this.prisma.special.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      this.prisma.special.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [orderBy]: orderDirection,
        },
      }),
    ]);
    const totalPages = Math.ceil(total / limit);

    return {
      data: specials,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async findOne(id: number) {
    const special = await this.prisma.special.findUnique({
      where: { id },
    });

    if (!special) {
      throw new NotFoundException(`Special with ID ${id} not found`);
    }

    return special;
  }

  async update(id: number, updateSpecialDto: UpdateSpecialDto) {
    const special = await this.findOne(id);

    return this.prisma.special.update({
      where: { id },
      data: updateSpecialDto,
    });
  }

  async remove(id: number) {
    const special = await this.findOne(id);

    return this.prisma.special.delete({
      where: { id },
    });
  }
}
