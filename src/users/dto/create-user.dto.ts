import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";
import { RegistrationDto } from "src/auth/dto/registration.dto";

export class CreateUserDto extends RegistrationDto {
  @ApiProperty({
    description: "Phone Number",
    example: "+92333333333",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: "Address",
    example: "united state",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: "Is Active",
    example: "true",
    required: true,
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: "Role of the user",
    example: "user",
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(["admin", "user"])
  role?: "admin" | "user";
}
