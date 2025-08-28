import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order } from "../schemas/order.schema";
import { Model } from "mongoose";
import { RevenueByDayResponseDto } from "../dto/aggregations/revenue-by-day.dto";
import { RevenueByUserResponseDto } from "../dto/aggregations/revenue-by-user.dto";
import { plainToInstance } from "class-transformer";

/**
 * REMINDER: Aggregations return plain javascript objects, not documents
 */
@Injectable()
export class OrderAggregationService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) { }

  /**
   * Total revenue oer day in a specified date range
   * 
   * $match to get orders inside the date range
   * $group to group by date and sum the totalPrice of the grouped documents
   * $project 
   * $sort to have dates ordered (old orders first, new orders last)
   * 
   * @param startDateString
   * @param endDateString
   * @returns The aggregated results.
   */
  async revenueByDayAggregation(startDateString: string, endDateString: string): Promise<RevenueByDayResponseDto[]> {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);


    return await this.orderModel.aggregate<RevenueByDayResponseDto>([
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
  }

  /**
   * Total revenue from each user
   * 
   * $group to group by user and sum the totalPrice for the grouped documents
   * $addFields to transform _id back to a valid ObjectId (necessary for lookup stage)
   * $lookup joins the user collection to get user full document
   * $unwind to transform the joined user array into a user object
   * $project removes unnecessary fields
   * 
   * @returns The aggregated results.
   */
  async revenueByUser(): Promise<RevenueByUserResponseDto[]> {

    const rawResults = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$user',
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
      {
        $addFields: {
          userId: { $toObjectId: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          userId: 0,
        },
      },
    ]);

    return plainToInstance(RevenueByUserResponseDto, rawResults);
  }
}