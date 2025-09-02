import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsMongoId, Min, ValidateNested } from "class-validator";
import { PopulatedDoc } from "mongoose";
import { ProductResponseDto } from "src/product/dto/body.dto";
import { UserResponseDto } from "src/user/dto/body.dto";
import { OrderDocument } from "../schemas/order.schema";


export class RevenueByDayResponseDto {
  date: string;
  totalRevenue: number;
}

export class RevenueByUserResponseDto {
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  totalRevenue: number;
}

class CreateOrderItemsDto {
  @IsMongoId()
  product: string;
  @IsInt()
  @Min(1)
  quantity: string;
}

export class CreateOrderDto {
  @IsMongoId()
  user: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemsDto)
  orderItems: CreateOrderItemsDto[];
}

export class OrderItemsResponseDto {
  @Type(() => String)
  _id: string;
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
  quantity: number;
}

export class OrderResponseDto {
  @Type(() => String)
  _id: string;
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  @Type(() => OrderItemsResponseDto)
  orderItems: OrderItemsResponseDto[]
  totalPrice: number;

  constructor(partial: Partial<PopulatedDoc<OrderDocument>> | Partial<OrderDocument>) {
    Object.assign(this, partial);
  }

  static fromArray(productDocuments: Partial<PopulatedDoc<OrderDocument>>[]): OrderResponseDto[] {
    return productDocuments.map((productDoc) => new OrderResponseDto(productDoc));
  }
}