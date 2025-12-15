import { PrismaClient, DayOfWeek, BaseRole, Gender } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  Permission,
  ALL_PERMISSIONS,
  PERMISSIONS,
} from '@shared/utils/permission.utl';

const prisma = new PrismaClient();

async function main() {
  console.log('🦷 Seeding Tooth & Truth Dental Clinic...\n');

  // ==========================================
  // 1. BUSINESS SETTINGS
  // ==========================================
  console.log('⚙️  Setting up business configuration...');

  const settings = [
    {
      key: 'branding',
      value: {
        name: 'Tooth & Truth',
        tagline: 'Where healthy smiles and honest care meet',
        logo: '/assets/logo.png',
        footerLogo: '/assets/footer-logo.png',
        favicon: '/assets/favicon.png',
        primaryColor: '#2563EB',
        secondaryColor: '#10B981',
        accentColor: '#F59E0B',
        themeName: 'default',
      },
    },
    {
      key: 'clinicInfo',
      value: {
        established: 2017,
        email: 'contact@toothandtruth.com',
        phone: '+95 9 123 456 789',
        website: 'https://toothandtruth.com',
        socialMedia: {
          facebook: 'https://facebook.com/toothandtruth',
          tiktok: 'https://tiktok.com/@toothandtruth',
        },
      },
    },
    {
      key: 'appointmentSettings',
      value: {
        defaultSlotDuration: 30,
        bufferMinutes: 5,
        maxAdvanceBookingDays: 30,
        minAdvanceBookingHours: 2,
        allowWalkins: true,
        allowOnlineBooking: true,
        allowPhoneBooking: true,
        reminderHoursBefore: 1,
      },
    },
    {
      key: 'workingHours',
      value: {
        default: {
          MONDAY: { open: '09:00', close: '18:00' },
          TUESDAY: { open: '09:00', close: '18:00' },
          WEDNESDAY: { open: '09:00', close: '18:00' },
          THURSDAY: { open: '09:00', close: '18:00' },
          FRIDAY: { open: '09:00', close: '18:00' },
          SATURDAY: { open: '09:00', close: '14:00' },
          SUNDAY: null,
        },
      },
    },
  ];

  for (const s of settings) {
    await prisma.businessSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  // ==========================================
  // 2. SYSTEM ROLES
  // ==========================================
  console.log('🔐 Creating system roles...');

  // Helper function for system roles (no branch)
  async function upsertSystemRole(data: {
    name: string;
    description: string;
    permissions: string[];
    isSystem?: boolean;
  }) {
    const existing = await prisma.role.findFirst({
      where: {
        name: data.name,
        branchId: null,
      },
    });

    if (existing) {
      return prisma.role.update({
        where: { id: existing.id },
        data: { permissions: data.permissions },
      });
    }

    return prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: data.permissions,
        branchId: null,
        isSystem: data.isSystem ?? true,
      },
    });
  }

  const superAdminRole = await upsertSystemRole({
    name: 'Super Admin',
    description: 'Full system access',
    permissions: ALL_PERMISSIONS,
  });

  const branchManagerRole = await upsertSystemRole({
    name: 'Branch Manager',
    description: 'Manage branch operations',
    permissions: [
      PERMISSIONS.APPOINTMENT.VIEW,
      PERMISSIONS.APPOINTMENT.CREATE,
      PERMISSIONS.APPOINTMENT.EDIT,
      PERMISSIONS.APPOINTMENT.CANCEL,
      PERMISSIONS.SCHEDULE.VIEW,
      PERMISSIONS.SCHEDULE.CREATE,
      PERMISSIONS.SCHEDULE.EDIT,
      PERMISSIONS.SCHEDULE.BLOCK,
      PERMISSIONS.DOCTOR.VIEW,
      PERMISSIONS.DOCTOR.ASSIGN,
      PERMISSIONS.PATIENT.VIEW,
      PERMISSIONS.PATIENT.CREATE,
      PERMISSIONS.PATIENT.VIEW_RECORDS,
      PERMISSIONS.LAB.VIEW,
      PERMISSIONS.LAB.CREATE,
      PERMISSIONS.LAB.UPDATE_RESULT,
      PERMISSIONS.SERVICE.VIEW,
      PERMISSIONS.ANALYTICS.BRANCH,
      PERMISSIONS.PROFILE.VIEW,
      PERMISSIONS.PROFILE.EDIT,
    ],
  });

  const staffRole = await upsertSystemRole({
    name: 'Staff',
    description: 'Branch staff',
    permissions: [
      PERMISSIONS.APPOINTMENT.VIEW,
      PERMISSIONS.APPOINTMENT.CREATE,
      PERMISSIONS.APPOINTMENT.EDIT,
      PERMISSIONS.SCHEDULE.VIEW,
      PERMISSIONS.PATIENT.VIEW,
      PERMISSIONS.PATIENT.CREATE,
      PERMISSIONS.SERVICE.VIEW,
      PERMISSIONS.PROFILE.VIEW,
      PERMISSIONS.PROFILE.EDIT,
    ],
  });

  const patientRole = await upsertSystemRole({
    name: 'Patient',
    description: 'Registered patient',
    permissions: [
      PERMISSIONS.APPOINTMENT.VIEW_OWN,
      PERMISSIONS.APPOINTMENT.CREATE_OWN,
      PERMISSIONS.APPOINTMENT.CANCEL_OWN,
      PERMISSIONS.SCHEDULE.VIEW_AVAILABLE,
      PERMISSIONS.SERVICE.VIEW,
      PERMISSIONS.PROFILE.VIEW,
      PERMISSIONS.PROFILE.EDIT,
    ],
  });

  // ==========================================
  // 3. DENTAL SERVICES
  // ==========================================
  console.log('🦷 Creating dental services...');

  const servicesData = [
    {
      name: 'Dental Check-up',
      description: 'Comprehensive oral examination',
      basePrice: 15000,
      duration: 30,
      category: 'General',
    },
    {
      name: 'Tooth Extraction',
      description: 'Simple tooth removal',
      basePrice: 25000,
      duration: 45,
      category: 'General',
    },
    {
      name: 'Tooth Filling',
      description: 'Composite or amalgam filling',
      basePrice: 30000,
      duration: 45,
      category: 'General',
    },
    {
      name: 'Decay Removal',
      description: 'Removal of tooth decay',
      basePrice: 20000,
      duration: 30,
      category: 'General',
    },
    {
      name: 'Dental Crown',
      description: 'Porcelain or metal crown',
      basePrice: 150000,
      duration: 60,
      category: 'Restorative',
    },
    {
      name: 'Braces Consultation',
      description: 'Initial braces assessment',
      basePrice: 20000,
      duration: 45,
      category: 'Orthodontics',
    },
    {
      name: 'Braces Installation',
      description: 'Metal or ceramic braces',
      basePrice: 800000,
      duration: 90,
      category: 'Orthodontics',
    },
    {
      name: 'Braces Adjustment',
      description: 'Monthly tightening',
      basePrice: 30000,
      duration: 30,
      category: 'Orthodontics',
    },
    {
      name: 'Teeth Whitening',
      description: 'Professional whitening',
      basePrice: 100000,
      duration: 60,
      category: 'Cosmetic',
    },
    {
      name: 'Dental Cleaning',
      description: 'Scaling and polishing',
      basePrice: 35000,
      duration: 45,
      category: 'Preventive',
    },
  ];

  const services = await Promise.all(
    servicesData.map((s) =>
      prisma.service.upsert({
        where: { name: s.name },
        update: {},
        create: { ...s, isActive: true },
      }),
    ),
  );

  // ==========================================
  // 4. EXTERNAL LABS
  // ==========================================
  console.log('🔬 Creating external labs...');

  await prisma.externalLab.upsert({
    where: { id: 'lab-yangon-dental' },
    update: {},
    create: {
      id: 'lab-yangon-dental',
      name: 'Yangon Dental Laboratory',
      address: '123 Pyay Road, Yangon',
      phone: '+95 9 111 222 333',
      email: 'info@yangondentallab.com',
      services: ['Crown', 'Bridge', 'Denture', 'Implant Crown'],
      isActive: true,
    },
  });

  await prisma.externalLab.upsert({
    where: { id: 'lab-medical-diagnostics' },
    update: {},
    create: {
      id: 'lab-medical-diagnostics',
      name: 'Myanmar Medical Diagnostics',
      address: '456 University Ave, Yangon',
      phone: '+95 9 444 555 666',
      email: 'lab@mmdlab.com',
      services: ['Blood Work', 'Biopsy', 'X-Ray', 'Bacterial Culture'],
      isActive: true,
    },
  });

  // ==========================================
  // 5. USERS (Login Accounts)
  // ==========================================
  console.log('👥 Creating users...');

  const pw = await bcrypt.hash('password123', 10);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@toothandtruth.com' },
    update: {},
    create: {
      email: 'admin@toothandtruth.com',
      password: pw,
      baseRole: BaseRole.ADMIN,
      firstName: 'System',
      lastName: 'Admin',
      phone: '+95 9 000 000 001',
      isOriginal: true,
      parentId: null,
    },
  });

  // Branch Managers
  const manager1 = await prisma.user.upsert({
    where: { email: 'manager.okkalapa@toothandtruth.com' },
    update: {},
    create: {
      email: 'manager.okkalapa@toothandtruth.com',
      password: pw,
      baseRole: BaseRole.BRANCH,
      firstName: 'Aung',
      lastName: 'Ko',
      phone: '+95 9 000 000 020',
      isOriginal: true,
      parentId: null,
    },
  });

  const manager2 = await prisma.user.upsert({
    where: { email: 'manager.sanchaung@toothandtruth.com' },
    update: {},
    create: {
      email: 'manager.sanchaung@toothandtruth.com',
      password: pw,
      baseRole: BaseRole.BRANCH,
      firstName: 'Mya',
      lastName: 'Win',
      phone: '+95 9 000 000 021',
      isOriginal: true,
      parentId: null,
    },
  });

  // Patient
  const patient1 = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      password: pw,
      baseRole: BaseRole.PATIENT,
      firstName: 'Kyaw',
      lastName: 'Zin',
      phone: '+95 9 000 000 100',
      gender: Gender.MALE,
      dateOfBirth: new Date('1990-05-15'),
      isOriginal: false,
      parentId: null,
    },
  });

  // ==========================================
  // 6. BRANCHES
  // ==========================================
  console.log('🏢 Creating branches...');

  const branch1 = await prisma.branch.upsert({
    where: { id: 'branch-south-okkalapa' },
    update: {},
    create: {
      id: 'branch-south-okkalapa',
      name: 'South Okkalapa Branch',
      address: 'No. 123, Thitsar Road, South Okkalapa, Yangon',
      phone: '+95 9 100 200 001',
      email: 'okkalapa@toothandtruth.com',
      managerId: manager1.id,
      isActive: true,
    },
  });

  const branch2 = await prisma.branch.upsert({
    where: { id: 'branch-sanchaung' },
    update: {},
    create: {
      id: 'branch-sanchaung',
      name: 'Sanchaung Branch',
      address: 'No. 45, Bargayar Road, Sanchaung, Yangon',
      phone: '+95 9 100 200 002',
      email: 'sanchaung@toothandtruth.com',
      managerId: manager2.id,
      isActive: true,
    },
  });

  // ==========================================
  // 7. DOCTORS (No Login - Managed by Staff)
  // ==========================================
  console.log('👨‍⚕️ Creating doctors...');

  const doctor1 = await prisma.doctor.upsert({
    where: { id: 'doctor-thein-zaw' },
    update: {},
    create: {
      id: 'doctor-thein-zaw',
      firstName: 'Thein',
      lastName: 'Zaw',
      phone: '+95 9 000 000 010',
      email: 'dr.thein@toothandtruth.com',
      gender: Gender.MALE,
      licenseNumber: 'DENT-2010-001',
      specialization: 'General Dentistry',
      bio: '15 years of experience in general dentistry',
      experience: 15,
      isActive: true,
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { id: 'doctor-aye-mon' },
    update: {},
    create: {
      id: 'doctor-aye-mon',
      firstName: 'Aye',
      lastName: 'Mon',
      phone: '+95 9 000 000 011',
      email: 'dr.aye@toothandtruth.com',
      gender: Gender.FEMALE,
      licenseNumber: 'DENT-2015-042',
      specialization: 'Orthodontics',
      bio: 'Specialist in braces and teeth alignment',
      experience: 10,
      isActive: true,
    },
  });

  // ==========================================
  // 8. SUB-USERS (Hierarchy)
  // ==========================================
  console.log('👥 Creating sub-users...');

  // Small Admin Role - use the helper function
  const smallAdminRole = await upsertSystemRole({
    name: 'Small Admin',
    description: 'Limited admin access',
    permissions: [
      PERMISSIONS.BRANCH.VIEW,
      PERMISSIONS.DOCTOR.VIEW,
      PERMISSIONS.DOCTOR.CREATE,
      PERMISSIONS.SERVICE.VIEW,
      PERMISSIONS.SERVICE.CREATE,
      PERMISSIONS.ANALYTICS.VIEW_ALL,
    ],
    isSystem: false,
  });
  // Small Admin User
  const smallAdmin = await prisma.user.upsert({
    where: { email: 'smalladmin@toothandtruth.com' },
    update: {},
    create: {
      email: 'smalladmin@toothandtruth.com',
      password: pw,
      baseRole: BaseRole.ADMIN,
      firstName: 'Min',
      lastName: 'Thu',
      phone: '+95 9 000 000 002',
      isOriginal: false,
      parentId: superAdmin.id,
    },
  });

  // Receptionist Role (Branch-specific)
  const receptionistRole = await prisma.role.upsert({
    where: { name_branchId: { name: 'Receptionist', branchId: branch1.id } },
    update: {},
    create: {
      name: 'Receptionist',
      description: 'Front desk staff',
      permissions: [
        PERMISSIONS.APPOINTMENT.VIEW,
        PERMISSIONS.APPOINTMENT.CREATE,
        PERMISSIONS.APPOINTMENT.EDIT,
        PERMISSIONS.PATIENT.VIEW,
        PERMISSIONS.PATIENT.CREATE,
        PERMISSIONS.SCHEDULE.VIEW,
      ],
      isSystem: false,
      branchId: branch1.id,
    },
  });

  // Receptionist User
  const receptionist = await prisma.user.upsert({
    where: { email: 'reception.okkalapa@toothandtruth.com' },
    update: {},
    create: {
      email: 'reception.okkalapa@toothandtruth.com',
      password: pw,
      baseRole: BaseRole.BRANCH,
      firstName: 'Su',
      lastName: 'Myat',
      phone: '+95 9 000 000 030',
      isOriginal: false,
      parentId: manager1.id,
    },
  });

  // Assign receptionist to branch
  await prisma.branchStaff.upsert({
    where: {
      branchId_userId: { branchId: branch1.id, userId: receptionist.id },
    },
    update: {},
    create: {
      branchId: branch1.id,
      userId: receptionist.id,
      position: 'Receptionist',
      isActive: true,
    },
  });

  // ==========================================
  // 9. ASSIGN ROLES
  // ==========================================
  console.log('🔗 Assigning roles...');

  const roleAssignments = [
    { userId: superAdmin.id, roleId: superAdminRole.id },
    { userId: smallAdmin.id, roleId: smallAdminRole.id },
    { userId: manager1.id, roleId: branchManagerRole.id },
    { userId: manager2.id, roleId: branchManagerRole.id },
    { userId: receptionist.id, roleId: receptionistRole.id },
    { userId: patient1.id, roleId: patientRole.id },
  ];

  for (const a of roleAssignments) {
    await prisma.userRole.upsert({
      where: { userId_roleId: a },
      update: {},
      create: a,
    });
  }

  // ==========================================
  // 10. ASSIGN DOCTORS TO BRANCHES
  // ==========================================
  console.log('👨‍⚕️ Assigning doctors to branches...');

  const branchDoctors = [
    { branchId: branch1.id, doctorId: doctor1.id },
    { branchId: branch1.id, doctorId: doctor2.id },
    { branchId: branch2.id, doctorId: doctor1.id },
  ];

  for (const bd of branchDoctors) {
    await prisma.branchDoctor.upsert({
      where: { branchId_doctorId: bd },
      update: {},
      create: { ...bd, isActive: true },
    });
  }

  // ==========================================
  // 11. ASSIGN SERVICES TO BRANCHES
  // ==========================================
  console.log('🦷 Assigning services to branches...');

  for (const service of services) {
    for (const branch of [branch1, branch2]) {
      await prisma.branchService.upsert({
        where: {
          branchId_serviceId: { branchId: branch.id, serviceId: service.id },
        },
        update: {},
        create: { branchId: branch.id, serviceId: service.id, isActive: true },
      });
    }
  }

  // ==========================================
  // 12. DOCTOR SCHEDULES
  // ==========================================
  console.log('📅 Creating schedules...');

  const weekdays: DayOfWeek[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
  ];
  const drAyeDays: DayOfWeek[] = [
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  for (const day of weekdays) {
    await prisma.schedule.upsert({
      where: {
        branchId_doctorId_dayOfWeek: {
          branchId: branch1.id,
          doctorId: doctor1.id,
          dayOfWeek: day,
        },
      },
      update: {},
      create: {
        branchId: branch1.id,
        doctorId: doctor1.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        bufferMinutes: 5,
        slotDuration: 30,
        isActive: true,
      },
    });
  }

  for (const day of drAyeDays) {
    await prisma.schedule.upsert({
      where: {
        branchId_doctorId_dayOfWeek: {
          branchId: branch1.id,
          doctorId: doctor2.id,
          dayOfWeek: day,
        },
      },
      update: {},
      create: {
        branchId: branch1.id,
        doctorId: doctor2.id,
        dayOfWeek: day,
        startTime: day === 'SATURDAY' ? '09:00' : '10:00',
        endTime: day === 'SATURDAY' ? '14:00' : '18:00',
        bufferMinutes: 5,
        slotDuration: 30,
        isActive: true,
      },
    });
  }

  // ==========================================
  // 13. PATIENT PROFILE
  // ==========================================
  console.log('🧑‍🦱 Creating patient profile...');

  await prisma.patientProfile.upsert({
    where: { userId: patient1.id },
    update: {},
    create: {
      userId: patient1.id,
      bloodType: 'O+',
      allergies: ['Penicillin'],
      medicalConditions: [],
      emergencyContact: 'Daw Khin May',
      emergencyPhone: '+95 9 000 000 101',
      preferredBranchId: branch1.id,
      preferredDoctorId: doctor1.id,
    },
  });

  // ==========================================
  // DONE
  // ==========================================
  console.log('\n✅ Seeding complete!\n');
  console.log(
    '┌──────────────────────────────────────────────────────────────────┐',
  );
  console.log(
    '│  USERS (Can Login)                                               │',
  );
  console.log(
    '├──────────────────────────────────────────────────────────────────┤',
  );
  console.log(
    '│  👑 admin@toothandtruth.com              [Super Admin]           │',
  );
  console.log(
    '│    └─ smalladmin@toothandtruth.com       [Small Admin]           │',
  );
  console.log(
    '│  🏢 manager.okkalapa@toothandtruth.com   [Branch Manager]        │',
  );
  console.log(
    '│    └─ reception.okkalapa@toothandtruth.com [Receptionist]        │',
  );
  console.log(
    '│  🏢 manager.sanchaung@toothandtruth.com  [Branch Manager]        │',
  );
  console.log(
    '│  🧑‍🦱 patient@example.com                  [Patient]              │',
  );
  console.log(
    '├──────────────────────────────────────────────────────────────────┤',
  );
  console.log(
    '│  DOCTORS (No Login - Managed by Staff)                           │',
  );
  console.log(
    '├──────────────────────────────────────────────────────────────────┤',
  );
  console.log(
    '│  👨‍⚕️ Dr. Thein Zaw    [General Dentistry]                        │',
  );
  console.log(
    '│  👩‍⚕️ Dr. Aye Mon      [Orthodontics]                             │',
  );
  console.log(
    '├──────────────────────────────────────────────────────────────────┤',
  );
  console.log(
    '│  🔑 Password: password123                                        │',
  );
  console.log(
    '└──────────────────────────────────────────────────────────────────┘',
  );
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
