import { Exclude, plainToInstance } from "class-transformer";
import { ProductDocument } from "../schemas/product.schema";


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