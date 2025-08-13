import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Current Password',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'New Password',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  confirmPassword: string;
}
