import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMediaFileDto } from "./dto/create-media-files.dto";
import { UpdateMediaFileDto } from "./dto/update-media-files.dto";

@Injectable()
export class MediaFilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMediaFileDto) {
    return this.prisma.mediaFile.create({ data: dto as any });
  }

  findAll() {
    return this.prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const record = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException("MediaFiles record not found");
    }
    return record;
  }

  async update(id: string, dto: UpdateMediaFileDto) {
    await this.findOne(id);
    return this.prisma.mediaFile.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.mediaFile.delete({ where: { id } });
    return { id, deleted: true };
  }
}
