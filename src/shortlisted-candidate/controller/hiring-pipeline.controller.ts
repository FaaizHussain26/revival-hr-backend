import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdateCandidateStatusDto } from "../dto/update-candidate-status.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { HiringPipelineService } from "../services/hiring-pipeline.service";

@Controller("hiring-pipeline")
@ApiBearerAuth()
@ApiTags("Hiring Pipeline")
export class HiringPipelineController {
  constructor(private readonly hiringPipelineService: HiringPipelineService) {}
  @HttpCode(HttpStatus.OK)
  @Get("candidate-with-status/")
  @UseGuards(JwtAuthGuard)
  findCandidatesWithStatus() {
    return this.hiringPipelineService.findCandidatesWithStatus();
  }

  @HttpCode(HttpStatus.OK)
  @Put("update-candidate-status/:id")
  @UseGuards(JwtAuthGuard)
  updateCandidateStatus(
    @Param("id") id: string,
    @Body() status: UpdateCandidateStatusDto
  ) {
    return this.hiringPipelineService.updateCandidateStatus(id, status);
  }
}
