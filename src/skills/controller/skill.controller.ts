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
import {
  ApiBearerAuth,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CreateSkillDto } from "../dto/create-skill.dto";
import { SkillService } from "../services/skill.service";

@Controller("skills")
@ApiBearerAuth()
@ApiTags("skills")
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get("/")
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search by skills (case-insensitive)",
  })
  @HttpCode(HttpStatus.OK)
  findAll(@Query("search") search?: string) {
    return this.skillService.findAll(search);
  }

  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  findById(@Param("id") id: string) {
    return this.skillService.findById(id);
  }

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: CreateSkillDto) {
    return this.skillService.create(payload);
  }

  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() payload: CreateSkillDto) {
    return this.skillService.update(id, payload);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  delete(@Param("id") id: string) {
    return this.skillService.delete(id);
  }
}
