import { IsString, IsNotEmpty, IsNumber, Min, IsArray, ArrayNotEmpty } from "class-validator";
import { ProductDocument } from "../schemas/product.schema";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";


export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  categories: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }


export class ProductResponseDto {
  @Type(() => String)
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];

  constructor(partial: Partial<ProductDocument>) {
    Object.assign(this, partial);
  }

  static fromArray(productDocuments: ProductDocument[]): ProductResponseDto[] {
    return productDocuments.map((productDoc) => new ProductResponseDto(productDoc));
  }
}