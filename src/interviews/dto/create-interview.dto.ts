import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  Min,
  MaxLength,
  IsArray,
} from "class-validator";

enum InterviewType {
  PHONE_SCREEN = "phone_screen",
  TECHNICAL = "technical",
  BEHAVIORAL = "behavioral",
  FINAL = "final",
}

enum InterviewStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
}

export class CreateInterviewDto {
  @ApiProperty({
    description: "Name of the candidate being interviewed",
    example: "John Doe",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  candidate: string;

  @ApiProperty({
    description: "Scheduled date and time for the interview (ISO format)",
    example: "2025-09-01T14:00:00Z",
    required: true,
  })
  @IsNotEmpty()
  scheduledAt: Date;

  // @ApiProperty({
  //   description: "Subject line of the interview invitation email",
  //   example: "Interview Invitation – Software Engineer Role at Acme Corp",
  //   required: true,
  // })
  // @IsNotEmpty()
  // @IsString()
  // subject: string;

  @ApiProperty({
    description: "Duration of the interview in minutes",
    example: 60,
    required: false,
    default: 60,
  })
  @IsNumber()
  @Min(15)
  duration: number;

  @ApiProperty({
    description: "Type of interview",
    example: "technical",
    enum: InterviewType,
    required: true,
  })
  @IsEnum(InterviewType)
  @IsNotEmpty()
  type: InterviewType;

  @ApiProperty({
    description: "Interviewer conducting the interview",
    example: ["jane.interviewer@example.com"],
    required: true,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  interviewer: string[];

  @ApiProperty({
    description: "Location of the interview (if applicable)",
    example: "Zoom, Google Meet, or Office Room A",
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: "Current status of the interview",
    example: "scheduled",
    enum: InterviewStatus,
    default: "scheduled",
    required: false,
  })
  @IsEnum(InterviewStatus)
  status: InterviewStatus;

  @ApiProperty({
    description: "Additional notes about the interview",
    example: "Candidate has experience with microservices.",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
