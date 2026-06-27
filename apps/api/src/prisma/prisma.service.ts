import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService {
  private client?: PrismaClient;

  get db() {
    this.client ??= new PrismaClient();
    return this.client;
  }
}
