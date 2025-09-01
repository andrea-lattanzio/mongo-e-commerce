import { plainToInstance, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsMongoId, Min, ValidateNested } from "class-validator";
import { ProductResponseDto } from "src/product/dto/body.dto";
import { UserResponseDto } from "src/user/dto/body.dto";


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
  product: ProductResponseDto;
  quantity: number;
}

export class OrderResponseDto {
  _id: string;
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  @Type(() => OrderItemsResponseDto)
  orderItems: OrderItemsResponseDto[]
  totalPrice: number;

  static fromDocument(order: any): OrderResponseDto {
    return plainToInstance(OrderResponseDto, order);
  }

  static fromDocuments(orders: any[]): OrderResponseDto[] {
    return orders.map((doc) => this.fromDocument(doc));
  }
}