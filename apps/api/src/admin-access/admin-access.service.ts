import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { CreateStaffAccountDto } from "./dto/create-staff-account.dto";
import { SendInvitationDto } from "./dto/send-invitation.dto";

@Injectable()
export class AdminAccessService {
  private readonly protectedAdminEmail = "info@starkite.tech";

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService
  ) {}

  async summary() {
    const [totalAccounts, activeAccounts, invitedAccounts, verificationCount, restrictedAccounts, invitations, auditLogs, classrooms, children] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { accountStatus: "active" } }),
      this.prisma.user.count({ where: { accountStatus: "invited" } }),
      this.prisma.user.count({ where: { accountStatus: { in: ["pending_verification", "invited"] } } }),
      this.prisma.user.count({ where: { accountStatus: { in: ["suspended", "archived"] } } }),
      this.prisma.invitation.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      this.prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      this.prisma.classroom.findMany({ orderBy: { name: "asc" } }),
      this.prisma.child.findMany({ orderBy: { name: "asc" } })
    ]);

    return {
      email: this.email.getStatus(),
      counts: {
        totalAccounts,
        activeAccounts,
        invitedAccounts,
        verificationCount,
        restrictedAccounts
      },
      invitations,
      auditLogs,
      classrooms,
      children
    };
  }

  async listAccounts(input: { type?: string; status?: string; search?: string; page?: number; take?: number }) {
    const page = Math.max(Number(input.page ?? 1), 1);
    const take = Math.min(Math.max(Number(input.take ?? 25), 10), 50);
    const skip = (page - 1) * take;
    const search = input.search?.trim();

    const where = {
      ...(input.type === "staff" ? { staff: { isNot: null } } : {}),
      ...(input.type === "parent" ? { parent: { isNot: null } } : {}),
      ...(input.status ? { accountStatus: input.status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } }
            ]
          }
        : {})
    };

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        include: {
          staff: { include: { classrooms: true } },
          parent: { include: { children: true } }
        },
        orderBy: { name: "asc" },
        skip,
        take
      })
    ]);

    return {
      page,
      take,
      total,
      totalPages: Math.max(Math.ceil(total / take), 1),
      items: users.map((user) => this.accountListItem(user))
    };
  }

  async getUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        staff: { include: { classrooms: true, reports: { orderBy: { date: "desc" }, take: 5 } } },
        parent: { include: { children: { include: { classroom: true } }, invoices: { include: { payments: true }, orderBy: { dueDate: "desc" }, take: 6 } } },
        invitations: { orderBy: { createdAt: "desc" }, take: 8 }
      }
    });

    if (!user) throw new NotFoundException("User not found");

    const auditLogs = await this.prisma.auditLog.findMany({
      where: { target: user.email },
      orderBy: { createdAt: "desc" },
      take: 12
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      protected: user.email.toLowerCase() === this.protectedAdminEmail,
      role: user.role,
      status: this.accountStatus(user),
      onboardingLocked: Boolean(user.parent && !user.passwordHash),
      lastLogin: user.lastLoginAt,
      invitedAt: user.invitedAt,
      verifiedAt: user.verifiedAt,
      suspendedAt: user.suspendedAt,
      createdAt: user.createdAt,
      kind: user.parent ? "parent" : user.staff ? "staff" : "user",
      staff: user.staff
        ? {
            id: user.staff.id,
            roleTitle: user.staff.roleTitle,
            classrooms: user.staff.classrooms,
            reports: user.staff.reports
          }
        : null,
      parent: user.parent
        ? {
            id: user.parent.id,
            phone: user.parent.phone,
            children: user.parent.children,
            invoices: user.parent.invoices
          }
        : null,
      invitations: user.invitations,
      auditLogs
    };
  }

  async createStaffAccount(input: CreateStaffAccountDto) {
    this.ensureEmailConfigured();
    const user = await this.prisma.user.create({
      data: {
        name: input.fullName,
        email: input.email.toLowerCase(),
        role: input.role || "teacher",
        accountStatus: "pending_verification"
      }
    });

    const staff = await this.prisma.staff.create({
      data: {
        userId: user.id,
        roleTitle: input.role || "Teacher"
      },
      include: { user: true }
    });

    if (input.assignedClassroomId) {
      await this.prisma.classroom.update({
        where: { id: input.assignedClassroomId },
        data: { leadStaffId: staff.id }
      });
    }

    await this.log("Admin", "created_staff_account", user.email, `${user.name} was created as ${staff.roleTitle}`);
    const invitation = await this.sendInvitation({ userId: user.id });
    return { user, staff, invitation };
  }

  async sendInvitation(input: SendInvitationDto) {
    this.ensureEmailConfigured();
    const user = input.userId
      ? await this.prisma.user.findUnique({ where: { id: input.userId } })
      : input.email
        ? await this.prisma.user.findUnique({ where: { email: input.email.toLowerCase() } })
        : null;

    if (!user && !input.email) {
      throw new BadRequestException("Provide a userId or email to invite");
    }

    if (!user) {
      throw new BadRequestException("Create the staff account before sending an invitation.");
    }

    const email = user.email;
    this.ensureMutableAccount(email);
    const role = user?.role ?? input.role ?? "parent";
    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const invitation = await this.prisma.invitation.create({
      data: {
        userId: user?.id,
        email,
        role,
        status: "sent",
        token,
        sentAt: new Date(),
        expiresAt
      }
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { accountStatus: "invited", invitedAt: new Date() }
      });
    }

    const inviteUrl = `${process.env.WEB_ORIGIN ?? "http://localhost:3010"}/invite/${token}`;
    const emailResult = await this.email.send({
      to: email,
      subject: "Your Babies & Todd's Academy portal invitation",
      text: `You have been invited to Babies & Todd's Academy. Open this link to accept your invitation: ${inviteUrl}`,
      html: `<p>You have been invited to <strong>Babies & Todd's Academy</strong>.</p><p><a href="${inviteUrl}">Accept your invitation</a></p><p>This link expires in 7 days.</p>`
    });

    await this.log("Admin", "sent_invitation", email, `Invitation sent by ${emailResult.mode} mode`);
    return { invitation, email: emailResult, inviteUrl };
  }

  async verifyUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    this.ensureMutableAccount(user.email);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { accountStatus: user.passwordHash ? "active" : "pending_verification", verifiedAt: new Date() }
    });

    await this.log("Admin", "verified_account", updated.email, `${updated.name} was verified`);
    return updated;
  }

  async suspendUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    this.ensureMutableAccount(user.email);

    if (user.role === "admin") {
      const adminCount = await this.prisma.user.count({
        where: { role: "admin", accountStatus: { notIn: ["suspended", "archived"] } }
      });
      if (adminCount <= 1) {
        throw new BadRequestException("Cannot suspend the last active admin account.");
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { accountStatus: "suspended", suspendedAt: new Date() }
    });

    await this.log("Admin", "suspended_account", updated.email, `${updated.name} was suspended`);
    return updated;
  }

  async restoreUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    this.ensureMutableAccount(user.email);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { accountStatus: user.passwordHash ? "active" : "pending_verification", suspendedAt: null }
    });

    await this.log("Admin", "restored_account", updated.email, `${updated.name} was restored`);
    return updated;
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { parent: true, staff: true }
    });
    if (!user) throw new NotFoundException("User not found");
    this.ensureMutableAccount(user.email);

    if (user.role === "admin") {
      const adminCount = await this.prisma.user.count({
        where: { role: "admin", accountStatus: { notIn: ["suspended", "archived"] } }
      });
      if (adminCount <= 1) {
        throw new BadRequestException("Cannot delete the last active admin account.");
      }
    }

    await this.prisma.$transaction(async (tx) => {
      if (user.parent) {
        const invoices = await tx.invoice.findMany({ where: { parentId: user.parent.id }, select: { id: true } });
        await tx.child.updateMany({ where: { parentId: user.parent.id }, data: { parentId: null } });
        if (invoices.length > 0) {
          await tx.payment.deleteMany({ where: { invoiceId: { in: invoices.map((invoice) => invoice.id) } } });
        }
        await tx.invoice.deleteMany({ where: { parentId: user.parent.id } });
        await tx.parent.delete({ where: { id: user.parent.id } });
      }

      if (user.staff) {
        await tx.classroom.updateMany({ where: { leadStaffId: user.staff.id }, data: { leadStaffId: null } });
        await tx.dailyReport.updateMany({ where: { staffId: user.staff.id }, data: { staffId: null } });
        await tx.staff.delete({ where: { id: user.staff.id } });
      }

      await tx.invitation.deleteMany({ where: { userId: user.id } });
      await tx.user.delete({ where: { id: user.id } });
      await tx.auditLog.create({
        data: {
          actor: "Admin",
          event: "deleted_account",
          target: user.email,
          detail: `${user.name} was permanently deleted from Users & Access.`
        }
      });
    });

    return { ok: true };
  }

  async cancelParentOnboarding(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { parent: { include: { children: true } } }
    });

    if (!user) throw new NotFoundException("User not found");
    this.ensureMutableAccount(user.email);

    if (!user.parent) {
      throw new BadRequestException("Only parent onboarding can be cancelled here.");
    }

    if (user.passwordHash) {
      throw new BadRequestException("This parent has already set a password. Suspend or delete the account instead.");
    }

    const childIds = user.parent.children.map((child) => child.id);

    await this.prisma.$transaction(async (tx) => {
      if (childIds.length > 0) {
        await tx.attendance.deleteMany({ where: { childId: { in: childIds } } });
        await tx.dailyReport.deleteMany({ where: { childId: { in: childIds } } });
        await tx.authorizedPickup.deleteMany({ where: { childId: { in: childIds } } });
        await tx.healthRecord.deleteMany({ where: { childId: { in: childIds } } });
        await tx.allergy.deleteMany({ where: { childId: { in: childIds } } });
        await tx.incident.deleteMany({ where: { childId: { in: childIds } } });
        await tx.mediaFile.deleteMany({ where: { childId: { in: childIds } } });
        await tx.admissionApplication.updateMany({
          where: { convertedChildId: { in: childIds } },
          data: {
            status: "rejected",
            convertedChildId: null,
            adminNote: "Parent onboarding was cancelled before password setup."
          }
        });
        await tx.child.deleteMany({ where: { id: { in: childIds } } });
      }

      const invoices = await tx.invoice.findMany({ where: { parentId: user.parent!.id }, select: { id: true } });
      if (invoices.length > 0) {
        await tx.payment.deleteMany({ where: { invoiceId: { in: invoices.map((invoice) => invoice.id) } } });
      }
      await tx.invoice.deleteMany({ where: { parentId: user.parent!.id } });
      await tx.invitation.deleteMany({ where: { userId: user.id } });
      await tx.parent.delete({ where: { id: user.parent!.id } });
      await tx.user.delete({ where: { id: user.id } });
      await tx.auditLog.create({
        data: {
          actor: "Admin",
          event: "cancelled_parent_onboarding",
          target: user.email,
          detail: `Cancelled invite for ${user.name} and deleted ${childIds.length} linked learner${childIds.length === 1 ? "" : "s"}.`
        }
      });
    });

    return { ok: true, deletedLearners: childIds.length };
  }

  private accountListItem(user: {
    id: string;
    name: string;
    email: string;
    role: string;
    accountStatus?: string | null;
    passwordHash?: string | null;
    verifiedAt?: Date | null;
    invitedAt?: Date | null;
    lastLoginAt?: Date | null;
    staff?: { roleTitle: string; classrooms: Array<{ name: string }> } | null;
    parent?: { phone: string; children: Array<{ name: string }> } | null;
  }) {
    const isParent = Boolean(user.parent);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: isParent ? "PARENT" : user.staff?.roleTitle ?? user.role,
      kind: isParent ? "parent" : user.staff ? "staff" : "user",
      phone: user.parent?.phone ?? "Not captured",
      status: this.accountStatus(user),
      lastLogin: user.lastLoginAt,
      invitedAt: user.invitedAt,
      verifiedAt: user.verifiedAt,
      primaryLink: isParent ? user.parent?.children[0]?.name ?? "No child linked" : user.staff?.classrooms[0]?.name ?? "No classroom",
      secondary: isParent ? `${user.parent?.children.length ?? 0} learner links` : user.staff?.roleTitle ?? user.role
    };
  }

  private accountStatus(user: { accountStatus?: string | null; passwordHash?: string | null; verifiedAt?: Date | null }) {
    if (user.accountStatus) return user.accountStatus;
    if (!user.verifiedAt) return "pending_verification";
    return user.passwordHash ? "active" : "invited";
  }

  private verificationChecks(
    user: { id: string; role: string; verifiedAt?: Date | null },
    staffAccounts: Array<{ id: string; assignedClassroom: string; role: string }>,
    parentAccounts: Array<{ id: string; linkedChild: string; pickupPermission: boolean; emergencyContactStatus: string }>
  ) {
    if (user.role.toLowerCase().includes("parent")) {
      const parent = parentAccounts.find((item) => item.id === user.id);
      return [
        { label: "Linked child", value: parent?.linkedChild ?? "Not linked", status: parent?.linkedChild && parent.linkedChild !== "Not linked" ? "ready" : "missing" },
        { label: "Pickup permission", value: parent?.pickupPermission ? "Allowed" : "Not set", status: parent?.pickupPermission ? "ready" : "review" },
        { label: "Emergency contact", value: parent?.emergencyContactStatus ?? "pending", status: parent?.emergencyContactStatus === "on_file" ? "ready" : "review" },
        { label: "Consent status", value: user.verifiedAt ? "Confirmed" : "Review", status: user.verifiedAt ? "ready" : "review" }
      ];
    }

    const staff = staffAccounts.find((item) => item.id === user.id);
    return [
      { label: "Role confirmation", value: staff?.role ?? user.role, status: "ready" },
      { label: "Classroom assignment", value: staff?.assignedClassroom ?? "Unassigned", status: staff?.assignedClassroom && staff.assignedClassroom !== "Unassigned" ? "ready" : "review" },
      { label: "Employment status", value: "Pending HR confirmation", status: "review" },
      { label: "Certification status", value: "Review", status: "review" }
    ];
  }

  private async log(actor: string, event: string, target: string, detail: string) {
    await this.prisma.auditLog.create({ data: { actor, event, target, detail } });
  }

  private ensureMutableAccount(email: string) {
    if (email.toLowerCase() === this.protectedAdminEmail) {
      throw new BadRequestException("The initial academy admin account is protected.");
    }
  }

  private ensureEmailConfigured() {
    if (!this.email.getStatus().configured) {
      throw new BadRequestException("Invitation email is not configured.");
    }
  }
}
