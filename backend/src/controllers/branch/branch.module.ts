import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { UsersModule } from '../../modules/users/users.module';
import { AppointmentsModule } from '../../modules/appointments/appointments.module';
import { SchedulesModule } from '../../modules/schedules/schedules.module';
import { DoctorsModule } from '../../modules/doctors/doctors.module';
import { LabsModule } from '../../modules/labs/labs.module';

@Module({
  imports: [
    UsersModule,
    AppointmentsModule,
    SchedulesModule,
    DoctorsModule,
    LabsModule,
  ],
  controllers: [BranchController],
})
export class BranchModule {}
