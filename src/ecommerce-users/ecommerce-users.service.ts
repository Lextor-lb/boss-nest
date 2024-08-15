import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEcommerceUserDto } from './dto/update-ecommerce-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EcommerceUserEntity } from './entities/ecommerce-user.entity';

@Injectable()
export class EcommerceUsersService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.EcommerceUserWhereInput = {
    isArchived: null,
  };
  async findOne(id: number) {
    const ecommerceUser = await this.prisma.ecommerceUser.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });

    return new EcommerceUserEntity(ecommerceUser);
  }

  async update(id: number, updateEcommerceUserDto: UpdateEcommerceUserDto) {
    const existingEcommerceUser = await this.prisma.ecommerceUser.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });
    if (!existingEcommerceUser) {
      throw new NotFoundException(`EcommerceUser with id ${id} not found`);
    }

    const ecommerceUser = await this.prisma.ecommerceUser.update({
      where: { id },
      data: updateEcommerceUserDto,
    });
    return new EcommerceUserEntity(ecommerceUser);
  }
}
