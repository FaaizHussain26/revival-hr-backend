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
import { UserPaginationDto } from "src/common/pagination/dto/user-pagination.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserService } from "../services/user.service";

@Controller("users")
@ApiBearerAuth()
@ApiTags("Users")
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @Get("/")
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: UserPaginationDto) {
    return await this.userservice.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get("stats/")
  @UseGuards(JwtAuthGuard)
  async getUserStats() {
    return await this.userservice.getUserStats();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findById(@Param("id") id: string) {
    return await this.userservice.findById(id);
  }

  @Post("/")
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: CreateUserDto) {
    return await this.userservice.create(payload);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() payload: UpdateUserDto) {
    return await this.userservice.update(id, payload);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    return await this.userservice.delete(id);
  }

  @Put("restore/:id")
  @UseGuards(JwtAuthGuard)
  async restore(@Param("id") id: string) {
    return await this.userservice.restore(id);
  }

  @Delete("permanent-delete/:id")
  @UseGuards(JwtAuthGuard)
  async permanentDelete(@Param("id") id: string) {
    return await this.userservice.permanentDelete(id);
  }
}
