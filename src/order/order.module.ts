import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ProductModule } from 'src/product/product.module';
import { OrderService } from './services/order.service';
import { OrderAggregationService } from './services/order.aggregation.service';
import { Schema } from 'mongoose';
import { ProductService } from 'src/product/services/product.service';
import { getTotalPrice } from './schemas/order.hooks';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      imports: [ProductModule],
      inject: [ProductService],
      name: Order.name,
      useFactory: (productSrv: ProductService) => {
        const schema: Schema = OrderSchema;
        schema.pre('save', getTotalPrice(productSrv));

        return schema;
      }
    }
  ]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderAggregationService],
})
export class OrderModule { }
