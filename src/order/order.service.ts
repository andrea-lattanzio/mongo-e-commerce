import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Connection, Model } from 'mongoose';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderTransactionException } from './exceptions/order-transaction-exception';
import { ProductService } from 'src/product/product.service';
import {
  RevenueByDayDto,
  RevenueByDayResponseDto,
} from './dto/aggregations/revenue-by-day.dto';
import { RevenueByUserResponseDto } from './dto/aggregations/revenue-by-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserDocument } from 'src/user/schemas/user.schema';
import { ProductDocument } from 'src/product/schemas/product.schema';

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
      .populate('user')
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

  async revenueByDay(
    revenueByDayDto: RevenueByDayDto,
  ): Promise<RevenueByDayResponseDto[]> {
    const startDate = new Date(revenueByDayDto.startDate);
    const endDate = new Date(revenueByDayDto.endDate);

    const results = await this.orderModel.aggregate<RevenueByDayResponseDto>([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      { $project: { _id: 0, date: '$_id', totalRevenue: 1 } },
      { $sort: { date: 1 } },
    ]);

    return results;
  }

  async revenueByUser(): Promise<RevenueByUserResponseDto[]> {
    const rawResults = await this.orderModel.aggregate([
      /**
       * Group
       * groups by user and sums the totalPrice field from the grouped documents
       * this is the total revenue per user.
       * HOWEVER user needs to be populated.
       */
      {
        $group: {
          _id: '$user',
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      /**
       * AddField
       * The first stage has returned a plain object in which _id is just a string
       * therefore the unwind cannot be done directly onto it
       */
      {
        $addFields: {
          userId: { $toObjectId: '$_id' },
        },
      },
      /**
       * Lookup (Join)
       * Joins the users table comparing the added field and the _id field from the user documents
       * adds the user field which is an array of joined users (in this case i will always find one)
       */
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      /**
       * Unwind
       * Transforms the user array resulting from the join into single objects and attaches them to the result
       */
      {
        $unwind: '$user',
      },
      /**
       * Project (Select)
       * in this case i remove _id (the key of the grouped results) and user_id (the field i added)
       * this is done to match the dto result
       */
      {
        $project: {
          _id: 0,
          userId: 0,
        },
      },
    ]);

    const results = plainToInstance(RevenueByUserResponseDto, rawResults);

    return results;
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderModel
      .findById(id)
      .populate('user')
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
    const order = await this.orderModel.findByIdAndDelete(id).lean();

    return OrderResponseDto.fromDocument(order!);
  }
}
