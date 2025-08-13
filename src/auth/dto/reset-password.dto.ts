import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset token for password reset',
    example: '',
    required: false,
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'abc123@',
    required: false,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  confirmPassword: string;
}
