import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSkillDto {
  @ApiProperty({
    description: "Add new skills",
    example: "node.js",
    required: true,
  })
  @IsString()
  name: string;
}
