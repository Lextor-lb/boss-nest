import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MediaDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  async saveMedia(prisma: PrismaClient, mediaDto: MediaDto) {
    return prisma.media.create({
      data: mediaDto,
    });
  }
}
