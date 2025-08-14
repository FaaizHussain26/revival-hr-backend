import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    example: 'Senior Software Engineer',
    description: 'Title of the job position',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Engineering',
    description: 'Department to which the job belongs',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    example: 'San Franciso,CA',
    description: 'Location of the job',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    enum: ['full-time', 'part-time', 'contract', 'intern'],
    example: 'full-time',
    description: 'Type of employment',
    required: true,
  })
  @IsEnum(['full-time', 'part-time', 'contract', 'intern'])
  employment_type: 'full-time' | 'part-time' | 'contract' | 'intern';

  @ApiProperty({
    enum: ['entry level', 'mid level', 'senior level', 'executive'],
    example: 'senior level',
    description: 'Experience level required for the job',
    required: true,
  })
  @IsEnum(['entry level', 'mid level', 'senior level', 'executive'])
  experience_level: 'entry level' | 'mid level' | 'senior level' | 'executive';

  @ApiPropertyOptional({
    example: '$80,000 - $120,000',
    description: 'Optional salary range or amount',
    required: false,
  })
  @IsString()
  @IsOptional()
  salary?: string;

  @ApiProperty({
    example: 'Provide a comprehensive description of the role...',
    description: 'Detailed description of the job responsibilities',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'List the essential qualifications and requirements...',
    description: 'Minimum qualifications and requirements for the job',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  requirements: string;

  @ApiPropertyOptional({
    example: ['JavaScript', 'Node.js', 'MongoDB'],
    description: 'List of skills required or preferred for the job',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({
    example: 'Describe the main duties and responsibilities...',
    description: 'List of responsibilities associated with the job',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  responsibilities: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the job is currently active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;


}
