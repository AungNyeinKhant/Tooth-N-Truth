import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Module({
  providers: [AppointmentsService]
})
export class AppointmentsModule {}
