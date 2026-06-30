import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { UsersModule } from "./users/users.module";
import { ChildrenModule } from "./children/children.module";
import { ParentsModule } from "./parents/parents.module";
import { StaffModule } from "./staff/staff.module";
import { ClassroomsModule } from "./classrooms/classrooms.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { DailyReportsModule } from "./daily-reports/daily-reports.module";
import { MessagesModule } from "./messages/messages.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { PaymentsModule } from "./payments/payments.module";
import { AuthorizedPickupsModule } from "./authorized-pickups/authorized-pickups.module";
import { HealthRecordsModule } from "./health-records/health-records.module";
import { AllergiesModule } from "./allergies/allergies.module";
import { IncidentsModule } from "./incidents/incidents.module";
import { AnnouncementsModule } from "./announcements/announcements.module";
import { MediaFilesModule } from "./media-files/media-files.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { AdminAccessModule } from "./admin-access/admin-access.module";
import { AdmissionsModule } from "./admissions/admissions.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminAccessModule,
    AdmissionsModule,
    HealthModule,
    UsersModule,
    ChildrenModule,
    ParentsModule,
    StaffModule,
    ClassroomsModule,
    AttendanceModule,
    DailyReportsModule,
    MessagesModule,
    InvoicesModule,
    PaymentsModule,
    AuthorizedPickupsModule,
    HealthRecordsModule,
    AllergiesModule,
    IncidentsModule,
    AnnouncementsModule,
    MediaFilesModule
  ]
})
export class AppModule {}
