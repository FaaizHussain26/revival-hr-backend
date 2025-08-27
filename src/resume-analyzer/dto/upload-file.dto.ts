import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'PDF file to upload',
  })
  @IsOptional()
  file?: any;

  @ApiProperty({
    type: 'string',
    description: 'Job ID',
    example: '',
  })
  @IsString()
  job_id: string;
}
