import { Module } from '@nestjs/common';
import { LabsService } from './labs.service';

@Module({
  providers: [LabsService],
  exports: [LabsService],
})
export class LabsModule {}
