import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateMediaFileDto } from "./dto/create-media-files.dto";
import { UpdateMediaFileDto } from "./dto/update-media-files.dto";
import { MediaFilesService } from "./media-files.service";

@Controller("media-files")
export class MediaFilesController {
  constructor(private readonly service: MediaFilesService) {}

  @Post()
  create(@Body() dto: CreateMediaFileDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateMediaFileDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
