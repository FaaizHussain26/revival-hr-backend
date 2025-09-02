import {
  Body,
  Controller,
  Delete,
  Get,
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
import { Roles } from "src/common/decorator/role.decorator";
import { Role } from "src/common/enum/role.enum";

@Controller("users")
@ApiBearerAuth()
@ApiTags("Users")
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @Get("/")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  async findAll(@Query() query: UserPaginationDto) {
    return await this.userservice.findAll(query);
  }

  @Get(":id")
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  async findById(@Param("id") id: string) {
    return await this.userservice.findById(id);
  }

  @Post("/")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  async create(@Body() payload: CreateUserDto) {
    return await this.userservice.create(payload);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  async update(@Param("id") id: string, @Body() payload: UpdateUserDto) {
    return await this.userservice.update(id, payload);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  async delete(@Param("id") id: string) {
    return await this.userservice.delete(id);
  }

  @Put("restore/:id")
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard)
  async restore(@Param("id") id: string) {
    return await this.userservice.restore(id);
  }

  @Delete("permanent-delete/:id")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  async permanentDelete(@Param("id") id: string) {
    return await this.userservice.permanentDelete(id);
  }
}
