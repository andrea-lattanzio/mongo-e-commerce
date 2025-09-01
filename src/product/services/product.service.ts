import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FindFilterQuery } from '../interfaces/find-filter.interface';
import { Product, ProductDocument, ProductModel } from '../schemas/product.schema';
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from '../dto/body.dto';
import { FindByCategoryDto, FindByNameQueryDto, FindFilterDto } from '../dto/query.dto';


@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: ProductModel) { }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productModel.create(createProductDto);
    const productObject = product.toObject();

    return new ProductResponseDto(productObject);
  }

  async findAll(findFilterDto: FindFilterDto): Promise<ProductResponseDto[]> {
    const { name, minPrice, maxPrice, stock, categories } = findFilterDto;
    const query: FindFilterQuery = {};

    if (name) query.$text = { $search: name };
    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query.price = { $gte: minPrice };
    } else if (maxPrice) {
      query.price = { $lte: maxPrice };
    }
    if (stock) query.stock = stock;
    if (categories) query.categories = { $in: categories };

    const products = await this.productModel.find(query).lean();

    return ProductResponseDto.fromArray(products);
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productModel.findById(id).orFail().lean();

    return new ProductResponseDto(product);
  }

  async findByName(
    findByNameQueryDto: FindByNameQueryDto,
  ): Promise<ProductResponseDto[]> {
    const { name } = findByNameQueryDto;
    const products = await this.productModel.findByName(name);

    return ProductResponseDto.fromArray(products);
  }

  async findByCategory(
    findByCategoryDto: FindByCategoryDto,
  ): Promise<ProductResponseDto[]> {
    const { category } = findByCategoryDto;
    const products = await this.productModel.findByCategory(category);

    return ProductResponseDto.fromArray(products);
  }

  async findByIds(
    ids: string[],
  ): Promise<ProductDocument[]> {
    const products = await this.productModel.find({ _id: { $in: ids } }).lean();

    return products;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productModel
      .findOneAndUpdate({ _id: id }, { $set: updateProductDto }, { new: true })
      .orFail()
      .lean();

    return new ProductResponseDto(product);
  }

  async remove(id: string): Promise<ProductResponseDto> {
    const product = await this.productModel
      .findByIdAndDelete({ _id: id })
      .orFail()
      .lean();

    return new ProductResponseDto(product);
  }

  async reduceStock(productId: string, orderQuantity: number): Promise<void> {
    const product = await this.productModel.findById(productId).orFail();
    if (!product) return;

    product.stock = product.stock - orderQuantity;
    await product.save();
  }
}
