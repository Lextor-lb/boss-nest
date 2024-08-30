import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma';
import { Prisma } from '@prisma/client';
import { AddressEntity } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}
  whereCheckingNullClause: Prisma.AddressWhereInput = {
    isArchived: null,
  };

  async create({ EcommerceUserId, ...addressData }: CreateAddressDto) {
    const address = await this.prisma.address.create({
      data: {
        ...addressData,
        ecommerceUser: {
          connect: { id: EcommerceUserId },
        },
      },
    });

    return new AddressEntity(address);
  }

  async findAll(ecommerceUserId: number) {
    const address = await this.prisma.address.findMany({
      where: { ...this.whereCheckingNullClause, ecommerceUserId },
    });

    return address.map((a) => new AddressEntity(a));
  }

  async findOne(id: number, ecommerceUserId: number) {
    const addressExists = await this.prisma.address.findUnique({
      where: {
        id,
        ecommerceUserId,
      },
    });

    if (!addressExists) {
      throw new NotFoundException(
        'Address not found or does not belong to this user.',
      );
    }
    const address = await this.prisma.address.findUnique({
      where: { ...this.whereCheckingNullClause, ecommerceUserId, id },
    });
    return new AddressEntity(address);
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
    ecommerceUserId: number,
  ) {
    const addressExists = await this.prisma.address.findUnique({
      where: {
        id,
        ecommerceUserId,
      },
    });

    if (!addressExists) {
      throw new NotFoundException(
        'Address not found or does not belong to this user.',
      );
    }

    const address = await this.prisma.address.update({
      where: { ...this.whereCheckingNullClause, ecommerceUserId, id },
      data: { ...updateAddressDto },
    });
    return new AddressEntity(address);
  }

  async remove(id: number, ecommerceUserId: number) {
    const addressExists = await this.prisma.address.findUnique({
      where: {
        id,
        ecommerceUserId,
      },
    });

    if (!addressExists) {
      throw new NotFoundException(
        'Address not found or does not belong to this user.',
      );
    }

    await this.prisma.address.update({
      where: { ...this.whereCheckingNullClause, id, ecommerceUserId },
      data: { isArchived: new Date() },
    });
    return {
      status: true,
      message: `Deleted address successfully.`,
    };
  }
}
