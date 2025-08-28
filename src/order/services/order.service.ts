import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
import { ProductDocument } from 'src/product/schemas/product.schema';
import { Order } from '../schemas/order.schema';
import { ProductService } from 'src/product/services/product.service';
import { RevenueByDayDto, RevenueByDayResponseDto } from '../dto/aggregations/revenue-by-day.dto';
import { RevenueByUserResponseDto } from '../dto/aggregations/revenue-by-user.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { OrderTransactionException } from '../exceptions/order-transaction-exception';
import { OrderAggregationService } from './order.aggregation.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectConnection() private readonly connection: Connection,
    private readonly productSrv: ProductService,
    private readonly orderAggregationSrv: OrderAggregationService,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const order = await this.orderModel.create(createOrderDto);
      order.toObject();

      for (const orderItem of order.orderItems) {
        await this.productSrv.reduceStock(
          orderItem.product.toString(),
          orderItem.quantity,
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
    const orders = await this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate<{ user: UserDocument }>('user')
      .populate<{
        user: UserDocument;
        orderItems: { product: ProductDocument }[];
      }>({
        path: 'orderItems',
        populate: { path: 'product' },
      })
      .lean();


    return OrderResponseDto.fromDocuments(orders);
  }

  async findAllUserOrders(userId: string): Promise<OrderResponseDto[]> {
    const userOrders = await this.orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate<{
        user: UserDocument;
        orderItems: { product: ProductDocument }[];
      }>({
        path: 'orderItems',
        populate: { path: 'product' },
      })
      .lean();

    return OrderResponseDto.fromDocuments(userOrders);
  }

  async revenueByDay(
    revenueByDayDto: RevenueByDayDto,
  ): Promise<RevenueByDayResponseDto[]> {
    const { startDate, endDate } = revenueByDayDto;

    const results = await this.orderAggregationSrv.revenueByDayAggregation(startDate, endDate);

    return results;
  }

  async revenueByUser(): Promise<RevenueByUserResponseDto[]> {
    const results = await this.orderAggregationSrv.revenueByUser();

    return results;
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderModel
      .findById(id)
      .orFail()
      .populate<{ user: UserDocument }>('user')
      .populate<{
        user: UserDocument;
        orderItems: { product: ProductDocument }[];
      }>({
        path: 'orderItems',
        populate: { path: 'product' },
      }).lean();

    return OrderResponseDto.fromDocument(order!);
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id).orFail().lean();

    return OrderResponseDto.fromDocument(order);
  }
}
