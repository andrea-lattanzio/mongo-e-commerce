import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductModel } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: ProductModel) { }

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productModel.create(createProductDto);
    const productObject = product.toObject();

    return ProductResponseDto.fromDocument(productObject);
  }

  async findAll() {
    const products = await this.productModel.find().lean();

    return ProductResponseDto.fromDocuments(products);
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean();

    return ProductResponseDto.fromDocument(product!);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel
      .findOneAndUpdate({ _id: id }, { $set: updateProductDto }, { new: true })
      .lean();

    return ProductResponseDto.fromDocument(product!);
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete({ _id: id }).lean();

    return ProductResponseDto.fromDocument(product!);
  }
}
