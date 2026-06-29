import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateHealthRecordDto } from "./dto/create-health-records.dto";
import { UpdateHealthRecordDto } from "./dto/update-health-records.dto";
import { HealthRecordsService } from "./health-records.service";

@Controller("health-records")
export class HealthRecordsController {
  constructor(private readonly service: HealthRecordsService) {}

  @Post()
  create(@Body() dto: CreateHealthRecordDto) {
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
  update(@Param("id") id: string, @Body() dto: UpdateHealthRecordDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
