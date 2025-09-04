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
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CreateInterviewDto } from "../dto/create-interview.dto";
import { InterviewService } from "../services/interview.service";
import { UpdateInterviewDto } from "../dto/update-interview.dto";
import { PaginationQueryDto } from "src/common/pagination/dto/pagination-query.dto";

@Controller("interviews")
@ApiBearerAuth()
@ApiTags("interviews")
export class InterviewController {
  constructor(private readonly InterviewService: InterviewService) {}

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: CreateInterviewDto) {
    return this.InterviewService.create(payload);
  }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  findAllUpComingInterview(@Query() query: PaginationQueryDto) {
    return this.InterviewService.findAllPaginatedAndFiltered(query);
  }
  @Get("all/")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.InterviewService.findAll();
  }

  @Get("today")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  todayInterview() {
    return this.InterviewService.todayInterview();
  }

  @Put("/:id")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() payload: UpdateInterviewDto) {
    return this.InterviewService.update(id, payload);
  }
}
