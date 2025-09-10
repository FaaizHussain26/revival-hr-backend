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
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";
import { CreateCandidateDto } from "../dto/create-shortlisted-candidates.dto";
import { ShortlistedCandidatesService } from "../services/shortlisted-candidates.service";

@Controller("shortlisted-candidates")
@ApiBearerAuth()
@ApiTags("Shortlisted Candidates")
export class ShortlistedCandidatesController {
  constructor(
    private readonly candidatesService: ShortlistedCandidatesService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get("/")
  @UseGuards(JwtAuthGuard)
  findAllCandidates(@Query() query: PaginationQueryDto) {
    return this.candidatesService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get("candidate-with-jobs/")
  @UseGuards(JwtAuthGuard)
  findCandidatesWithJobs() {
    return this.candidatesService.findCandidatesWithJobs();
  }

  @HttpCode(HttpStatus.OK)
  @Get("stats/")
  @UseGuards(JwtAuthGuard)
  countCandidates() {
    return this.candidatesService.countCandidates();
  }

  @HttpCode(HttpStatus.OK)
  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  getById(@Param("id") id: string) {
    return this.candidatesService.findById(id);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post("/")
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: CreateCandidateDto) {
    return this.candidatesService.create(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  delete(@Param("id") id: string) {
    return this.candidatesService.delete(id);
  }
  @HttpCode(HttpStatus.OK)
  @Put("restore/:id")
  @UseGuards(JwtAuthGuard)
  restore(@Param("id") id: string) {
    return this.candidatesService.restore(id);
  }

  @Delete("permanent-delete/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async permanentDelete(@Param("id") id: string) {
    return await this.candidatesService.permanentDelete(id);
  }
}
