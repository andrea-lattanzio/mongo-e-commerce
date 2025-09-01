import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { ProductDocument } from 'src/product/schemas/product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
  })
  orderItems: { product: ObjectId; quantity: number }[];

  @Prop()
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ user: 1 }); // improves user order list 

// This hook is now defined in order.module.ts
// OrderSchema.pre('save', async function (next) {
//   if (this.isModified('orderItems')) {
//     const productModel = this.model('Product');
//     const productIds = this.orderItems.map((orderItem) => orderItem.product);
//     const products: ProductDocument[] = await productModel.find({
//       _id: { $in: productIds },
//     });

//     const productPriceMap = new Map<string, number>();
//     products.forEach((product) => {
//       productPriceMap.set(product._id.toString(), product.price);
//     });

//     let total = 0;
//     this.orderItems.forEach((orderItem) => {
//       const price = productPriceMap.get(orderItem.product.toString());
//       if (price) total += price * orderItem.quantity;
//     });

//     this.totalPrice = total;
//   }

//   next();
// });
