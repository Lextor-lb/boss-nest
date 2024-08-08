import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpecialDto } from './dto/create-special.dto';
import { UpdateSpecialDto } from './dto/update-special.dto';
import { SearchOption, SpecialPagination } from 'src/shared/types';
import { SpecialEntity } from './entities';
import { RemoveManySpecialDto } from './dto';
import { createEntityProps } from 'src/shared/utils/createEntityProps';
import { Prisma } from '@prisma/client';

@Injectable()
export class SpecialsService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.SpecialWhereInput = {
    isArchived: null,
  };

  async create(createSpecialDto: CreateSpecialDto) {
    return this.prisma.special.create({
      data: createSpecialDto,
    });
  }

  async indexAll(): Promise<SpecialEntity[]> {
    const specials = await this.prisma.special.findMany({
      where: this.whereCheckingNullClause,
    });

    return specials.map(
      (special) => new SpecialEntity(createEntityProps(special)),
    );
  }

  async findAll(searchOptions: SearchOption): Promise<SpecialPagination> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;

    const [total, specials] = await this.prisma.$transaction([
      this.prisma.special.count({
        where: {
          ...this.whereCheckingNullClause,
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

  async remove(id: number): Promise<SpecialEntity> {
    const deletedSpecial = await this.prisma.special.update({
      where: {
        id,
      },
      data: {
        isArchived: new Date(),
      },
    });

    return new SpecialEntity(deletedSpecial);
  }

  async removeMany(removeManySpecialDto: RemoveManySpecialDto) {
    const { ids } = removeManySpecialDto;

    try {
      const { count } = await this.prisma.customer.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          isArchived: new Date(),
        },
      });

      return {
        status: true,
        message: `Special with ids count of ${count} have been deleted sucessfull.`,
        archivedIds: ids,
      };
    } catch (error) {
      // Log any errors that occur
      console.error('Error updating records:', error);
      throw new Error('Failed to update records');
    }
  }
}
