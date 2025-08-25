import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export interface ProductModel extends Model<ProductDocument> {
  byName(): Promise<ProductDocument[] | ProductDocument | null>;
  byCategory(category: string): Promise<ProductDocument[] | ProductDocument | null>;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Product {
  @Prop()
  name: string;

  @Prop()
  description: string;

  // these properties have schema level validation rules, enforced by dto level class-validator rules
  @Prop({ min: 0.01 })
  price: number;

  @Prop({ min: 0 })
  stock: number;

  @Prop({ type: [String] })
  categories: string[];
}

export const ProductSchema = SchemaFactory.createForClass<Product>(Product);

// indexes
ProductSchema.index({ name: 'text' }); // avoids full text scan on name field
ProductSchema.index({ price: 1 }); // already sorts the data so that a sort query does not have to do it each time

// static methods
ProductSchema.statics.byName = function (name: string) {
  return this.find({ name: name });
};

ProductSchema.statics.byCategory = function (category: string) {
  return this.find({
    categories: { $in: [category] },
  });
};
