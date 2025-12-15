import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../../modules/users/users.module';
import { BranchesModule } from '../../modules/branches/branches.module';
import { DoctorsModule } from '../../modules/doctors/doctors.module';
import { ServicesModule } from '../../modules/services/services.module';
import { AnalyticsModule } from '../../modules/analytics/analytics.module';

@Module({
  imports: [
    UsersModule,
    BranchesModule,
    DoctorsModule,
    ServicesModule,
    AnalyticsModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
