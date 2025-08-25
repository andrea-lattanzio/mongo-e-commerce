import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { ProductDocument } from 'src/product/schemas/product.schema';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: ObjectId;

  // product can only be selected once
  // @Prop({ type: [Types.ObjectId], ref: 'Product' })
  // products: ObjectId[];

  @Prop({
    type: [{ product: Types.ObjectId, quantity: { type: Number, min: 1 } }],
  })
  products: { product: ObjectId; quantity: number }[];

  @Prop()
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

/* eslint-disable */
OrderSchema.pre('save', async function (next) {
  if (this.isModified('products')) {
    const productModel = this.model('Product');
    const products: ProductDocument[] = await productModel.find({
      _id: { $in: this.products },
    });

    // total price for single selection of products
    // const totalPrice = products.reduce(
    //   (sum, product) => sum + product.price,
    //   0,
    // );

    const productPriceMap = new Map();
    products.forEach((product) => {
      productPriceMap.set(product._id.toString(), product.price);
    });

    const total = this.products.reduce((sum, orderItem) => {
      const price = productPriceMap.get(orderItem.product.toString());
      if (price) {
        return sum + price * orderItem.quantity;
      }
      return sum;
    }, 0);

    this.totalPrice = total;
  }

  next();
});
