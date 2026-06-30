import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const statuses = new Set(["new", "reviewing", "tour-booked", "waitlisted", "approved", "rejected", "enrolled"]);

type AdmissionInput = {
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  childName?: string;
  childDateOfBirth?: string;
  programme?: string;
  preferredStart?: string;
  notes?: string;
};

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService) {}

  create(input: unknown) {
    const body = input as AdmissionInput;
    if (!body.parentName || !body.parentEmail || !body.parentPhone || !body.childName || !body.programme) {
      throw new BadRequestException("Parent name, email, phone, child name, and programme are required");
    }

    return this.prisma.admissionApplication.create({
      data: {
        parentName: body.parentName.trim(),
        parentEmail: body.parentEmail.trim().toLowerCase(),
        parentPhone: body.parentPhone.trim(),
        childName: body.childName.trim(),
        childDateOfBirth: body.childDateOfBirth ? new Date(body.childDateOfBirth) : null,
        programme: body.programme.trim(),
        preferredStart: body.preferredStart ? new Date(body.preferredStart) : null,
        notes: body.notes?.trim() || null
      }
    });
  }

  list(status?: string) {
    return this.prisma.admissionApplication.findMany({
      where: status && statuses.has(status) ? { status } : undefined,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }]
    });
  }

  updateStatus(id: string, input: { status?: string; adminNote?: string }) {
    if (!input.status || !statuses.has(input.status)) {
      throw new BadRequestException("A valid admission status is required");
    }

    return this.prisma.admissionApplication.update({
      where: { id },
      data: {
        status: input.status,
        adminNote: input.adminNote?.trim() || undefined
      }
    });
  }

  async enrol(id: string, input: { classroomId?: string; preferredStart?: string }) {
    const application = await this.prisma.admissionApplication.findUnique({ where: { id } });
    if (!application) throw new NotFoundException("Admission application not found");
    if (application.convertedChildId) {
      return this.prisma.child.findUnique({ where: { id: application.convertedChildId } });
    }

    const email = application.parentEmail.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email }, include: { parent: true } });
    const parent = existingUser?.parent
      ? existingUser.parent
      : await this.prisma.parent.create({
          data: {
            phone: application.parentPhone,
            user: existingUser
              ? { connect: { id: existingUser.id } }
              : {
                  create: {
                    name: application.parentName,
                    email,
                    role: "parent",
                    accountStatus: "invited",
                    invitedAt: new Date()
                  }
                }
          }
        });

    const child = await this.prisma.child.create({
      data: {
        name: application.childName,
        dateOfBirth: application.childDateOfBirth,
        parentId: parent.id,
        classroomId: input.classroomId || null
      }
    });

    await this.prisma.admissionApplication.update({
      where: { id },
      data: {
        status: "enrolled",
        preferredStart: input.preferredStart ? new Date(input.preferredStart) : application.preferredStart,
        convertedChildId: child.id
      }
    });

    await this.prisma.auditLog.create({
      data: {
        actor: "Admin",
        event: "Admin enrolled admission application",
        target: application.childName,
        detail: `${application.parentName} was linked as parent for ${application.childName}.`
      }
    });

    return child;
  }

  async delete(id: string) {
    await this.prisma.admissionApplication.delete({ where: { id } });
    return { ok: true };
  }

  async clear() {
    const result = await this.prisma.admissionApplication.deleteMany();
    return { ok: true, deleted: result.count };
  }
}
