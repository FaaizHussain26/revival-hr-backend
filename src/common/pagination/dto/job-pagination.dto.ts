import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "./pagination-query.dto";

export class JobPaginationDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "Filter by user active status",
    example: "true",
    required: false,
  })
  isActive?: boolean;
}
