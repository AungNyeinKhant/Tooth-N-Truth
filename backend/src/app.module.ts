import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BranchesModule } from './modules/branches/branches.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { ServicesModule } from './modules/services/services.module';
import { LabsModule } from './modules/labs/labs.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ControllersModule } from './controllers/controllers.module';
import { JwtAuthGuard } from './core/guards/jwt.guard';
import { RolesGuard } from './core/guards/roles.guard';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    BranchesModule,
    DoctorsModule,
    AppointmentsModule,
    SchedulesModule,
    ServicesModule,
    LabsModule,
    AnalyticsModule,
    ControllersModule,
  ],
  providers: [
    // Global Zod validation
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    // Global JWT Guard
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Global Roles Guard
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
