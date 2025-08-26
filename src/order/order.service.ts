import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { OrderResponseDto } from './dto/order-response.dto';


@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderModel.create(createOrderDto);
    order.toObject();

    return order;
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderModel.find()
      .populate('user')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product'
        }
      }).lean();

    return OrderResponseDto.fromDocuments(orders);
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderModel.findById(id)
      .populate('user')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product'
        }
      }).lean();

    return OrderResponseDto.fromDocument(order!);
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id).lean();

    return OrderResponseDto.fromDocument(order!);
  }
}
