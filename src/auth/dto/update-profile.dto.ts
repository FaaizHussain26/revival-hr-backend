import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { RegistrationDto } from "./registration.dto";

class UpdateUserWithoutPasswordDto extends OmitType(RegistrationDto, [
  "password",
] as const) {}

export class UpdateProfileDto extends PartialType(
  UpdateUserWithoutPasswordDto
) {
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
  @IsBoolean()
  isActive?: boolean;
}
