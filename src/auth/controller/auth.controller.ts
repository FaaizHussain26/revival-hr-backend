import {
  Body,
  Controller,
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
import { AuthService } from "../services/auth.service";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { LoginDto } from "../dto/login.dto";
import { RegistrationDto } from "../dto/registration.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AuthUser } from "src/common/decorator/auth.decorator";
import { User } from "src/users/entities/user.schema";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { UpdatePasswordDto } from "../dto/update-password.dto";

@Controller("auth")
@ApiBearerAuth()
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(@Body() payload: RegistrationDto) {
    return await this.authService.registration(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post("forgot-password")
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return await this.authService.forgotPassword(payload.email);
  }

  @HttpCode(HttpStatus.OK)
  @Get("verify-reset-token")
  async verifyResetToken(@Query("token") token: string) {
    return await this.authService.verifyForgotPasswordToken(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.authService.resetPassword(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Put("update-profile")
  @UseGuards(JwtAuthGuard)
  async updateprofile(
    @AuthUser() user: User,
    @Body() payload: UpdateProfileDto
  ) {
    return await this.authService.updateProfile(user, payload);
  }

  @HttpCode(HttpStatus.OK)
  @Put("update-password")
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @AuthUser() user: User,
    @Body() payload: UpdatePasswordDto
  ) {
    return await this.authService.updatePassword(user, payload);
  }
}
