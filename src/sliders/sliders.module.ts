import { Module } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  controllers: [SlidersController],
  providers: [SlidersService],
  imports:[MinioModule]
})
export class SlidersModule {}
