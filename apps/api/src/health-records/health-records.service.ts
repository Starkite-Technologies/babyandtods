import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHealthRecordDto } from "./dto/create-health-records.dto";
import { UpdateHealthRecordDto } from "./dto/update-health-records.dto";

@Injectable()
export class HealthRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateHealthRecordDto) {
    return this.prisma.healthRecord.create({ data: dto as any });
  }

  findAll() {
    return this.prisma.healthRecord.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const record = await this.prisma.healthRecord.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException("HealthRecords record not found");
    }
    return record;
  }

  async update(id: string, dto: UpdateHealthRecordDto) {
    await this.findOne(id);
    return this.prisma.healthRecord.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.healthRecord.delete({ where: { id } });
    return { id, deleted: true };
  }
}
