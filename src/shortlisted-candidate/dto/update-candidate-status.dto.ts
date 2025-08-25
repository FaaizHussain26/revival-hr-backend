import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class UpdateCandidateStatusDto {
  @ApiProperty({
    description: "Current status of the applicant",
    enum: [
      "applied",
      "phone_screen",
      "interview",
      "final_interview",
      "offer",
      "hired",
      "rejected",
    ],
    example: "applied",
  })
  @IsEnum([
    "applied",
    "phone_screen",
    "interview",
    "final_interview",
    "offer",
    "hired",
    "rejected",
  ])
  status:
    | "applied"
    | "phone_screen"
    | "interview"
    | "final_interview"
    | "offer"
    | "hired"
    | "rejected";
}