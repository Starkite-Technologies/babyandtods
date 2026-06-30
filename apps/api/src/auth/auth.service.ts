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

  async login(email: string, password: string, rememberMe = false) {
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

    const expiresIn = rememberMe ? "7d" : "8h";
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 8;
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn });

    return {
      token,
      maxAge,
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

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    const authToken = jwt.sign(payload, this.jwtSecret, { expiresIn: "8h" });

    return {
      ok: true,
      status: user.accountStatus,
      token: authToken,
      maxAge: 60 * 60 * 8,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    };
  }

  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.email !== payload.email) return null;
      if (user.accountStatus === "suspended" || user.accountStatus === "archived") return null;
      return {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    } catch {
      return null;
    }
  }
}
