import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './multer-config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaService } from './media.service';

@Module({
  // controllers: [MediaController],
  providers: [MediaService],
  imports: [MulterModule.register(multerOptions), PrismaModule],
  exports: [MediaService],
})
export class MediaModule {}
