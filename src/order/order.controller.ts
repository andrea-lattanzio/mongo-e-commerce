import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import {
  RevenueByDayDto,
  RevenueByDayResponseDto,
} from './dto/aggregations/revenue-by-day.dto';
import { RevenueByUserResponseDto } from './dto/aggregations/revenue-by-user.dto';
import { OrderService } from './services/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    return await this.orderService.findAll();
  }

  @Get('/revenuebyday')
  async revenueByDay(
    @Query() revenueByDayDto: RevenueByDayDto,
  ): Promise<RevenueByDayResponseDto[]> {
    return await this.orderService.revenueByDay(revenueByDayDto);
  }

  @Get('/revenuebyuser')
  async revenueByUser(): Promise<RevenueByUserResponseDto[]> {
    return await this.orderService.revenueByUser();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    return await this.orderService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<OrderResponseDto> {
    return await this.orderService.remove(id);
  }
}
