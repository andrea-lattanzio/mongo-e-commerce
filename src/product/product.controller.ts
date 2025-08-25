import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindByNameQueryDto } from './dto/query/find-by-name.dto';
import { FindByCategoryDto } from './dto/query/find-by-category.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('/name')
  findByName(@Query() findByNameQueryDto: FindByNameQueryDto) {
    return this.productService.findByName(findByNameQueryDto);
  }

  @Get('/category')
  findByCategory(@Query() findByCategoryDto: FindByCategoryDto) {
    return this.productService.findByCategory(findByCategoryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('here');
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
