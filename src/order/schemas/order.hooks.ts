import { ProductDocument } from "src/product/schemas/product.schema";
import { ProductService } from "src/product/services/product.service";
import { OrderDocument } from "./order.schema";

export function getTotalPrice(productSrv: ProductService) {
  return async function (this: OrderDocument, next: () => void) {
    if (this.isModified('orderItems')) {
      const productIds = this.orderItems.map((orderItem) => orderItem.product.toString());
      const products: ProductDocument[] = await productSrv.findByIds(productIds);

      const productPriceMap = new Map<string, number>();
      products.forEach((product) => {
        productPriceMap.set(product._id.toString(), product.price);
      });

      let total = 0;
      this.orderItems.forEach((orderItem) => {
        const price = productPriceMap.get(orderItem.product.toString());
        if (!price) return;
        total += orderItem.quantity * price;
      });

      this.totalPrice = total;
    }

    next();
  }
}