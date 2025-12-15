import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UsersService } from '../../modules/users/users.service';
import { BranchesService } from '../../modules/branches/branches.service';
import { DoctorsService } from '../../modules/doctors/doctors.service';
import { BaseRole } from '@prisma/client';
import { AuthenticatedUser } from '../../utils/interfaces/jwt-payload.interface';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  ChangeEmailDto,
  CreateSubAdminDto,
} from '../../modules/users/dto';
import { CreateBranchDto, UpdateBranchDto } from '../../modules/branches/dto';
import { CreateDoctorDto } from '../../modules/doctors/dto';

@Controller('admin')
@Roles(BaseRole.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly branchesService: BranchesService,
    private readonly doctorsService: DoctorsService,
  ) {}

  @Get('hello')
  hello() {
    return { message: 'Hello from Admin' };
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

  @Patch('profile/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  updateAvatar(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarUrl = `/uploads/${file.filename}`;
    return this.usersService.updateAvatar(user.id, avatarUrl);
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

  // ─── SUB-ADMINS ───────────────────────────
  @Post('users/sub-admin')
  createSubAdmin(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSubAdminDto,
  ) {
    return this.usersService.createSubAdmin(user.id, dto);
  }

  @Get('users/my-staff')
  getMySubAdmins(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findByParent(user.id);
  }

  @Patch('users/:id/deactivate')
  deactivateUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.usersService.deactivateUser(user.id, id);
  }

  @Patch('users/:id/activate')
  activateUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.usersService.activateUser(user.id, id);
  }

  @Get('users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  // ─── BRANCHES ─────────────────────────────
  @Get('branches')
  getAllBranches() {
    return this.branchesService.findAll();
  }

  @Post('branches')
  createBranch(@Body() dto: CreateBranchDto) {
    return this.branchesService.create(dto);
  }

  @Patch('branches/:id')
  updateBranch(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchesService.update(id, dto);
  }

  @Delete('branches/:id')
  deleteBranch(@Param('id') id: string) {
    return this.branchesService.delete(id);
  }

  // ─── DOCTORS ──────────────────────────────
  @Get('doctors')
  getAllDoctors() {
    return this.doctorsService.findAll();
  }

  @Post('doctors')
  createDoctor(@Body() dto: CreateDoctorDto) {
    return this.doctorsService.create(dto);
  }
    */
}
