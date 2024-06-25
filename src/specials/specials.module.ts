import { Module } from '@nestjs/common';
import { SpecialsService } from './specials.service';
import { SpecialsController } from './specials.controller';

@Module({
  controllers: [SpecialsController],
  providers: [SpecialsService],
})
export class SpecialsModule {}
