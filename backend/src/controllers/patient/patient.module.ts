import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { UsersModule } from '../../modules/users/users.module';
import { AppointmentsModule } from '../../modules/appointments/appointments.module';
import { ServicesModule } from '../../modules/services/services.module';
import { SchedulesModule } from '../../modules/schedules/schedules.module';

@Module({
  imports: [UsersModule, AppointmentsModule, ServicesModule, SchedulesModule],
  controllers: [PatientController],
})
export class PatientModule {}
