import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { CreateParentAccountDto } from "./dto/create-parent-account.dto";
import { CreateStaffAccountDto } from "./dto/create-staff-account.dto";
import { SendInvitationDto } from "./dto/send-invitation.dto";

@Injectable()
export class AdminAccessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService
  ) {}

  async summary() {
    const [users, staff, parents, invitations, auditLogs, classrooms, children] = await Promise.all([
      this.prisma.user.findMany({ orderBy: { name: "asc" } }),
      this.prisma.staff.findMany({ include: { user: true, classrooms: true }, orderBy: { user: { name: "asc" } } }),
      this.prisma.parent.findMany({ include: { user: true, children: true }, orderBy: { user: { name: "asc" } } }),
      this.prisma.invitation.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
      this.prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
      this.prisma.classroom.findMany({ orderBy: { name: "asc" } }),
      this.prisma.child.findMany({ orderBy: { name: "asc" } })
    ]);

    const staffAccounts = staff.map((item) => ({
      id: item.user.id,
      name: item.user.name,
      email: item.user.email,
      phone: "Not captured",
      role: item.roleTitle,
      assignedClassroom: item.classrooms[0]?.name ?? "Unassigned",
      status: this.accountStatus(item.user),
      lastLogin: item.user.lastLoginAt,
      invitedAt: item.user.invitedAt,
      verifiedAt: item.user.verifiedAt
    }));

    const parentAccounts = parents.map((item) => ({
      id: item.user.id,
      name: item.user.name,
      email: item.user.email,
      phone: item.phone,
      role: "PARENT",
      relationshipToChild: "Guardian",
      linkedChild: item.children[0]?.name ?? "Not linked",
      pickupPermission: Boolean(item.children[0]),
      emergencyContactStatus: item.children.length ? "on_file" : "pending",
      status: this.accountStatus(item.user),
      lastLogin: item.user.lastLoginAt,
      invitedAt: item.user.invitedAt,
      verifiedAt: item.user.verifiedAt
    }));

    const verificationQueue = users
      .filter((user) => this.accountStatus(user) === "pending_verification" || this.accountStatus(user) === "invited")
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        accountType: user.role.toLowerCase().includes("parent") ? "parent" : "staff",
        checks: this.verificationChecks(user, staffAccounts, parentAccounts)
      }));

    return {
      email: this.email.getStatus(),
      staffAccounts,
      parentAccounts,
      invitations,
      verificationQueue,
      auditLogs,
      classrooms,
      children
    };
  }

  async createStaffAccount(input: CreateStaffAccountDto) {
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

  async createParentAccount(input: CreateParentAccountDto) {
    const user = await this.prisma.user.create({
      data: {
        name: input.fullName,
        email: input.email.toLowerCase(),
        role: "parent",
        accountStatus: "pending_verification"
      }
    });

    const parent = await this.prisma.parent.create({
      data: {
        userId: user.id,
        phone: input.phone
      },
      include: { user: true }
    });

    if (input.linkedChildId) {
      await this.prisma.child.update({
        where: { id: input.linkedChildId },
        data: { parentId: parent.id }
      });

      if (input.pickupPermission) {
        await this.prisma.authorizedPickup.create({
          data: {
            childId: input.linkedChildId,
            name: input.fullName,
            relationship: input.relationshipToChild,
            phone: input.phone
          }
        });
      }
    }

    await this.log("Admin", "created_parent_account", user.email, `${user.name} was linked to the parent portal`);
    const invitation = await this.sendInvitation({ userId: user.id });
    return { user, parent, invitation };
  }

  async sendInvitation(input: SendInvitationDto) {
    const user = input.userId
      ? await this.prisma.user.findUnique({ where: { id: input.userId } })
      : input.email
        ? await this.prisma.user.findUnique({ where: { email: input.email.toLowerCase() } })
        : null;

    if (!user && !input.email) {
      throw new BadRequestException("Provide a userId or email to invite");
    }

    const email = user?.email ?? input.email!.toLowerCase();
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

    const updated = await this.prisma.user.update({
      where: { id },
      data: { accountStatus: user.passwordHash ? "active" : "pending_verification", suspendedAt: null }
    });

    await this.log("Admin", "restored_account", updated.email, `${updated.name} was restored`);
    return updated;
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
}
