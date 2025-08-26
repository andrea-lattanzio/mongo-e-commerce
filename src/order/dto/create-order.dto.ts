import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsMongoId,
  Min,
  ValidateNested,
} from 'class-validator';

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
