import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Connection, Model } from 'mongoose';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderTransactionException } from './exceptions/order-transaction-exception';
import { ProductService } from 'src/product/product.service';


@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectConnection() private readonly connection: Connection,
    private readonly productSrv: ProductService,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const order = await this.orderModel.create(createOrderDto);
      order.toObject();

      /* eslint-disable */
      for (const orderItem of order.orderItems) {
        await this.productSrv.reduceStock(
          orderItem.product.toString(),
          orderItem.quantity
        );
      }

      return order;
    } catch (error) {
      await session.abortTransaction();
      throw new OrderTransactionException(error);
    } finally {
      await session.endSession();
    }
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
