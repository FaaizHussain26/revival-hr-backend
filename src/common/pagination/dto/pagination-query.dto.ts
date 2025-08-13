import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  IsString,
  Min
} from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @ApiProperty({
    description: 'The number of records to fetch per page.',
    example: 10,
    required: false,
  })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({
    description: 'The page number to retrieve.',
    example: 1,
    required: false,
  })
  page?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The field by which to sort the results.',
    example: 'createdAt',
    required: false,
  })
  sortBy?: string;

  @IsOptional()
  @ApiProperty({
    description: 'The sort order, either ascending or descending.',
    enum: ['asc', 'desc'],
    example: 'desc',
    required: false,
  })
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @ApiProperty({
    description: 'A JSON string to filter the results.',
    example: '{"name": "John"}',
    required: false,
  })
  filter?: string ;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'String',
    example: 'John',
    required: false,
  })
  search?: string;

  // @IsOptional()
  // @Transform(({ value }) =>
  //   value === 'true' ? true : value === 'false' ? false : undefined,
  // )
  // @IsBoolean()
  // @ApiProperty({
  //   description: 'Select for isActive and isDeleted',
  //   type: 'boolean',
  //   required: false,
  // })
  // isDelete?: boolean;
}
