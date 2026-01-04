import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { Roles } from '../../core/decorators/roles.decorator';
import { Public } from '../../core/decorators/public.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UsersService } from '../../modules/users/users.service';
import { AppointmentsService } from '../../modules/appointments/appointments.service';
import { ServicesService } from '../../modules/services/services.service';
import { BaseRole } from '@prisma/client';
import { AuthenticatedUser } from '../../utils/interfaces/jwt-payload.interface';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  ChangeEmailDto,
} from '../../modules/users/dto';
import { CreateAppointmentDto } from '../../modules/appointments/dto';

@Controller('patient')
@Roles(BaseRole.PATIENT)
export class PatientController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appointmentsService: AppointmentsService,
    private readonly servicesService: ServicesService,
  ) {}

  @Get('hello')
  @Public()
  getHello() {
    return 'Hello World!';
  }

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

  @Patch('profile/email')
  changeEmail(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangeEmailDto,
  ) {
    return this.usersService.changeEmail(user.id, dto);
  }

  // ─── APPOINTMENTS ─────────────────────────
  @Get('appointments')
  getMyAppointments(@CurrentUser() user: AuthenticatedUser) {
    return this.appointmentsService.findByPatient(user.id);
  }

  @Post('appointments')
  bookAppointment(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(user.id, dto);
  }

  @Patch('appointments/:id/cancel')
  cancelAppointment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.cancel(id, user.id);
  }

  // ─── SERVICES ─────────────────────────────
  @Get('services')
  getServices() {
    return this.servicesService.findAllActive();
  }
  */
}
