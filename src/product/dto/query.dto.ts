import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsInt, IsArray, ArrayNotEmpty } from "class-validator";
import { Transform } from 'class-transformer';

export class FindByCategoryDto {
  @IsString()
  @IsNotEmpty()
  category: string;
}

export class FindByNameQueryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

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