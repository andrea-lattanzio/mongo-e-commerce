import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindFilterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  categories: string[];
}
