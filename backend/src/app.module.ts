import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BranchesModule } from './modules/branches/branches.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { ServicesModule } from './modules/services/services.module';
import { LabsModule } from './modules/labs/labs.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminController } from './controllers/admin/admin.controller';
import { AdminService } from './controllers/admin/admin.service';
import { BranchController } from './controllers/branch/branch.controller';
import { PatientController } from './controllers/patient/patient.controller';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, BranchesModule, DoctorsModule, AppointmentsModule, SchedulesModule, ServicesModule, LabsModule, AnalyticsModule],
  controllers: [AppController, AdminController, BranchController, PatientController],
  providers: [AppService, AdminService],
})
export class AppModule {}
