import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './services/order.service';
import { RevenueByDayDto } from './dto/query.dto';
import { CreateOrderDto, OrderResponseDto, RevenueByDayResponseDto, RevenueByUserResponseDto } from './dto/body.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    return await this.orderService.findAll();
  }

  @Get('/userorders/:id')
  async findAllUserOrders(@Param('id') id: string): Promise<OrderResponseDto[]> {
    return await this.orderService.findAllUserOrders(id);
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
