import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Module({
  providers: [DoctorsService]
})
export class DoctorsModule {}
