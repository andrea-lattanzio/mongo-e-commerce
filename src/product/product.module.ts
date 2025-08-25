import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), // registering the new collection
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [MongooseModule]
})
export class ProductModule { }
