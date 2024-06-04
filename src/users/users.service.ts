import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getAllUser() {
    return this.prisma.user.findMany();
  }

  async create(
    // where: Prisma.UserWhereUniqueInput,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const existing = await this.prisma.user.findFirst({
      where: { name: createUserDto.name },
    });

    if (existing) {
      throw new ConflictException('Username already exists'); // Capitalize "Username" for consistency
    }

    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
