import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MediaDto } from './dto/media.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prismaSeed: PrismaService) {}
  async saveMedia(prisma: PrismaClient, mediaDto: MediaDto) {
    return prisma.media.create({
      data: mediaDto,
    });
  }

  async updateMedia(prisma: PrismaClient, id: number, mediaDto: MediaDto) {
    return prisma.media.update({
      where: { id },
      data: mediaDto,
    });
  }

  async seedMedia(mediaDto: MediaDto) {
    return this.prismaSeed.media.create({
      data: mediaDto,
    });
  }
}

// async saveMedia(prisma: PrismaClient, mediaDto: MediaDto) {
//   const baseUrl = this.configService.get<string>('app.baseUrl');

//   const media = await prisma.media.create({
//     data: mediaDto,
//   });
//   return new MediaEntity({ ...media, baseUrl });
// }
