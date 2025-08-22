import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Types } from "mongoose";
import { successResponse } from "src/common/response/response";
import { User } from "src/users/entities/user.schema";
import { UserRepository } from "src/users/repositories/user.repository";
import { LoginDto } from "../dto/login.dto";
import { RegistrationDto } from "../dto/registration.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { UpdatePasswordDto } from "../dto/update-password.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async registration(payload: RegistrationDto) {
    try {
      const { firstName, lastName, email, password } = payload;
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) throw new ConflictException("Email already in use");
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      if (!user) {
        throw new BadRequestException("User registration failed");
      }
      const extractUser = await this.userRepository.findById(user.id);
      return successResponse("User registered successfully", extractUser);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong during registration."
      );
    }
  }

  async login(payload: LoginDto) {
    try {
      const { email, password } = payload;
      const existingUser = await this.userRepository.findByEmail(email);
      if (
        !existingUser ||
        !(await bcrypt.compare(password, existingUser.password))
      ) {
        throw new UnauthorizedException("Invalid credentials");
      }
      if (!existingUser.isActive) {
        throw new UnauthorizedException("Your account is not active");
      }
      const token = await this.jwtService.sign(
        {
          sub: existingUser._id,
          data: existingUser,
        },
        {
          secret: this.configService.get<string>("JWT_SECRET"),
          expiresIn: this.configService.get<string>("JWT_EXPIRY"),
        }
      );
      return successResponse("Login successful", {
        accessToken: token,
        user: existingUser,
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Something went wrong during login."
      );
    }
  }
  async forgotPassword(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException("User not found with this email.");
      }
      if (!user.isActive) {
        throw new UnauthorizedException("Your account is not active");
      }
      const jwtSecret = this.configService.get<string>("JWT_SECRET");
      const jwtExpiresIn = "15m";
      const token = await this.jwtService.signAsync(
        { email },
        { secret: jwtSecret, expiresIn: jwtExpiresIn }
      );
      const frontendBaseUrl = this.configService.get<string>("FRONTEND_URL");
      const resetLink = `${frontendBaseUrl}/reset-password?token=${token}`;
      const emailSend = await this.eventEmitter.emitAsync("forgot.password", {
        email,
        link: resetLink,
      });
      if (!emailSend) {
        throw new BadRequestException("Email not send.");
      }
      return successResponse("Email sent successfully");
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while processing the forgot password request."
      );
    }
  }

  async verifyForgotPasswordToken(token: string) {
    try {
      const jwtSecret = this.configService.get<string>("JWT_SECRET");
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      if (!decoded || !decoded.email) {
        throw new BadRequestException("Invalid or expired token.");
      }
      return successResponse("verified sucessfully", { email: decoded.email });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "something went wrong while verifying the token."
      );
    }
  }

  async resetPassword(payload: ResetPasswordDto) {
    try {
      const { token, newPassword } = payload;
      const jwtSecret = this.configService.get<string>("JWT_SECRET");
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      const user = await this.userRepository.findByEmail(decoded.email);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      const passworReset = await this.userRepository.updateProfile(
        user.id,
        user
      );
      if (!passworReset) {
        throw new BadRequestException("Password reset failed");
      }
      return successResponse("Password updated successfully.");
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while resetting the password."
      );
    }
  }

  async updateProfile(user: User, payload: UpdateProfileDto) {
    try {
      const existingUser = await this.userRepository.findById(
        user._id as string
      );
      if (!existingUser) {
        throw new NotFoundException("User not found");
      }
      const updatedUser = await this.userRepository.updateProfile(
        user._id as string,
        payload
      );
      if (!updatedUser) {
        throw new BadRequestException("Profile update failed");
      }
      const token = await this.jwtService.sign(
        {
          sub: updatedUser._id,
          data: updatedUser,
        },
        {
          secret: this.configService.get<string>("JWT_SECRET"),
          expiresIn: this.configService.get<string>("JWT_EXPIRY"),
        }
      );
      if (!token) {
        throw new BadRequestException("Token generation failed");
      }
      return successResponse("Profile updated successfully", {
        token: token,
        user: updatedUser,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while updating the profile."
      );
    }
  }

  async updatePassword(id: string, payload: UpdatePasswordDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException("Invalid ID format");
      }
      const { currentPassword, newPassword } = payload;
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const comparePassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!comparePassword) {
        throw new BadRequestException("Current password is incorrect");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      const passwordUpdated = await this.userRepository.updateProfile(id, user);
      if (!passwordUpdated) {
        throw new BadRequestException("Password update failed");
      }
      return successResponse("Password updated successfully");
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Something went wrong while updating the password."
      );
    }
  }
}
