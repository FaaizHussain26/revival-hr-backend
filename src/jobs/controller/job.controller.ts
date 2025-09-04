import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorator/role.decorator";
import { Role } from "src/common/enum/role.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { JobPaginationDto } from "src/common/pagination/dto/job-pagination.dto";
import { CreateJobDto } from "../dto/create-job.dto";
import { UpdateJobDto } from "../dto/update-job.dto";
import { JobService } from "../services/job.service";

@Controller("jobs")
@ApiBearerAuth()
@ApiTags("job")
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("/")
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateJobDto) {
    return await this.jobService.create(payload);
  }
  @HttpCode(HttpStatus.OK)
  @Get("/")
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: JobPaginationDto) {
    return await this.jobService.findAll(query);
  }
  @HttpCode(HttpStatus.OK)
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findById(@Param("id") id: string) {
    return await this.jobService.findById(id);
  }
  @HttpCode(HttpStatus.OK)
  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() payload: UpdateJobDto) {
    return await this.jobService.update(id, payload);
  }
  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  async delete(@Param("id") id: string) {
    return await this.jobService.delete(id);
  }

  @HttpCode(HttpStatus.OK)
  @Put("restore/:id")
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  async restore(@Param("id") id: string) {
    return await this.jobService.restore(id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("permanent-delete/:id")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  async permanentDelete(@Param("id") id: string) {
    return await this.jobService.permanentDelete(id);
  }
}
