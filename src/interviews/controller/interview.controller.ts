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

@Controller("interviews")
@ApiBearerAuth()
@ApiTags("interviews")
export class InterviewController {
  constructor(private readonly InterviewService: InterviewService) {}

 
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateInterviewDto) {
    return this.InterviewService.create(payload);
  }

}
