import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './services/product.service';
import { CreateProductDto, UpdateProductDto } from './dto/body.dto';
import { FindByCategoryDto, FindByNameQueryDto, FindFilterDto } from './dto/query.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() findFilterDto: FindFilterDto) {
    return this.productService.findAll(findFilterDto);
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
