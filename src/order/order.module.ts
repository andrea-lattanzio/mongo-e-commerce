import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ProductModule } from 'src/product/product.module';
import { OrderService } from './services/order.service';
import { OrderAggregationService } from './services/order.aggregation.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderAggregationService],
})
export class OrderModule { }
