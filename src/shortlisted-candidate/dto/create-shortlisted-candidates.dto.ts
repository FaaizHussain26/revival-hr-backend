import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  IsBoolean,
  IsOptional,
  IsDate,
  IsEnum,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { Types } from "mongoose";

export class CreateCandidateDto {
  @ApiProperty({
    description: "Name of the applicant",
    example: "John Doe",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  applicant_name: string;

  @ApiProperty({
    description: "Job the applicant matched to",
    example: "No",
    required: true,
  })
  @IsString()
  @IsOptional()
  job_matched?: string;

  @ApiProperty({
    description: "Summary of the match",
    example: "yes",
    required: true,
  })
  @IsString()
  @IsOptional()
  summary_match: string;

  @ApiProperty({
    description: "List of matched skills",
    example: ["Node.js", "TypeScript", "MongoDB"],
    required: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  matched_skills: string[];

  @ApiProperty({
    description: "Experience object of the applicant",
    example: { match: "No", years_found: 0 },
    required: true,
  })
  @IsObject()
  experience: object;

  @ApiProperty({
    description: "List of bonus skill matches",
    example: ["GraphQL", "Docker"],
    required: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  bonus_matches: string[];

  @ApiProperty({
    description: "Overall match score",
    example: 87.5,
    required: true,
  })
  @IsNumber()
  match_score: number;

  @ApiProperty({
    description: "List of job titles matched",
    example: ["Backend Developer", "Software Engineer"],
    required: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  jobs_matched: string[];

  @ApiProperty({
    description: "Summary of the applicant",
    required: true,
    example:
      "Motivated professional with a passion for using technology to create engaging digital experiences...",
  })
  @IsString()
  applicant_summary: string;

  @ApiProperty({
    description: "Email of the applicant",
    example: "abc@gmail.com",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  applicant_email: string;

  @ApiProperty({
    description: "Phone number of the applicant",
    example: "+92 333 3333333",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  applicant_phone: string;

  @ApiProperty({
    description: "Whether the applicant is duplicated",
    required: false,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isDuplicated?: boolean;

  @ApiProperty({
    description: "Resume URL",
    required: false,
    example: "https://example.com/resume.pdf",
  })
  @IsString()
  @IsOptional()
  resume_url?: string;

  @ApiProperty({
    description: "Date of application",
    required: true,
    example: "2025-08-24T10:30:00.000Z",
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  applied_date: Date;

  @ApiProperty({
    description: "ID of the job the applicant applied to",
    required: true,
    example: "64fbc395f12c4d1234567890",
  })
  @IsNotEmpty()
  @IsString()
  job: string;

  @ApiProperty({
    description: "List of applicant skills",
    required: true,
    example: ["JavaScript", "Express", "MongoDB"],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  applicant_skills: string[];
}
