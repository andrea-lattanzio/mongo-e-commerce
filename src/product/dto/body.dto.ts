import { IsString, IsNotEmpty, IsNumber, Min, IsArray, ArrayNotEmpty } from "class-validator";
import { ProductDocument } from "../schemas/product.schema";
import { plainToInstance } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";


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
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];

  static fromDocument(documentObject: ProductDocument): ProductResponseDto {
    return plainToInstance(ProductResponseDto, documentObject);
  }

  static fromDocuments(documents: ProductDocument[]): ProductResponseDto[] {
    return documents.map((doc) => this.fromDocument(doc));
  }
}