import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UsersService } from '../../modules/users/users.service';
import { AppointmentsService } from '../../modules/appointments/appointments.service';
import { DoctorsService } from '../../modules/doctors/doctors.service';
import { BaseRole } from '@prisma/client';
import { AuthenticatedUser } from '../../utils/interfaces/jwt-payload.interface';
import {
  CreateBranchStaffDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from '../../modules/users/dto';
import {
  CreateWalkinDto,
  UpdateAppointmentStatusDto,
} from '../../modules/appointments/dto';

@Controller('branch')
@Roles(BaseRole.BRANCH)
export class BranchController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appointmentsService: AppointmentsService,
    private readonly doctorsService: DoctorsService,
  ) {}

  // ─── PROFILE ──────────────────────────────
  /*
  @Get('profile')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findById(user.id);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('profile/password')
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, dto);
  }

  // ─── STAFF ────────────────────────────────
  @Post('staff')
  createStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBranchStaffDto,
  ) {
    return this.usersService.createBranchStaff(user.id, dto);
  }

  @Get('staff')
  getMyStaff(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findByParent(user.id);
  }

  // ─── APPOINTMENTS ─────────────────────────
  @Get('appointments')
  getTodayAppointments(@CurrentUser() user: AuthenticatedUser) {
    return this.appointmentsService.findByBranch(user.branchId!, new Date());
  }

  @Post('appointments/walkin')
  createWalkin(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWalkinDto,
  ) {
    return this.appointmentsService.createWalkin(user.branchId!, dto);
  }

  @Patch('appointments/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(id, dto);
  }

  // ─── DOCTORS ──────────────────────────────
  @Get('doctors')
  getBranchDoctors(@CurrentUser() user: AuthenticatedUser) {
    return this.doctorsService.findByBranch(user.branchId!);
  }
    */
}
