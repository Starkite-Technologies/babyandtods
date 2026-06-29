import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private get jwtSecret(): string {
    return process.env.JWT_SECRET ?? "dev-secret-change-in-production";
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.accountStatus === "suspended" || user.accountStatus === "archived") {
      throw new UnauthorizedException("Account access is restricted");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        accountStatus: user.verifiedAt ? "active" : user.accountStatus
      }
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: "7d" });

    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    };
  }

  async acceptInvitation(token: string, password: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!invitation || !invitation.user) {
      throw new BadRequestException("Invalid invitation");
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException("Invitation has expired");
    }

    if (invitation.status === "accepted" || invitation.status === "active") {
      throw new BadRequestException("Invitation has already been accepted");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.update({
      where: { id: invitation.user.id },
      data: {
        passwordHash,
        accountStatus: invitation.user.verifiedAt ? "active" : "pending_verification"
      }
    });

    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        status: user.verifiedAt ? "active" : "accepted",
        acceptedAt: new Date()
      }
    });

    await this.prisma.auditLog.create({
      data: {
        actor: user.email,
        event: "accepted_invitation",
        target: user.email,
        detail: `${user.name} accepted the portal invitation`
      }
    });

    return { ok: true, status: user.accountStatus };
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch {
      return null;
    }
  }
}
