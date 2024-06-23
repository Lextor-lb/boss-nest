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

  async updateMedia(prisma: PrismaClient, id: number, mediaDto: MediaDto) {
    return prisma.media.update({
      where: { id },
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
