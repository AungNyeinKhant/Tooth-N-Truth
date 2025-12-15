import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { BranchModule } from './branch/branch.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [AdminModule, BranchModule, PatientModule],
})
export class ControllersModule {}
