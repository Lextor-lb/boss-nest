import { Module } from '@nestjs/common';
import { SliderService } from './slider.service';
import { SliderController } from './slider.controller';
import { ImageModule } from '@faker-js/faker';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [SliderController],
  providers: [SliderService],
})
export class SliderModule {}
