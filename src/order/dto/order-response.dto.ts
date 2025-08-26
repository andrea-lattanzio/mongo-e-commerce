import { ProductResponseDto } from "src/product/dto/product-response.dto";
import { UserResponseDto } from "src/user/dto/user-response.dto";
import { plainToInstance, Type } from "class-transformer";

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