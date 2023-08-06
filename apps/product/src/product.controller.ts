import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { APIResponse } from 'libs/utils/api-response';
import { ProductDocument } from 'libs/database/schemas/product.schema';
import { BusinessLogicHttpException } from 'libs/core/BusinessLogicHttpException';
import { ErrorResponseMessage } from 'libs/constants/api.constant';
import { ClientService } from 'libs/client/service.ts/client.service';
import { JoiValidationPipe } from 'libs/pipe/joi-validation.pipe';
import { PostCreateProductDto, postCreateProductValidation } from './product.dto';

@Controller('api/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly client: ClientService,
  ) {}

  @Get()
  async getAllProduct(
    @Query('textToSearch') textToSearch: string,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
  ): Promise<APIResponse<{ products: ProductDocument[], skip: number, limit: number, total: number }>> {
    const regex = textToSearch ? textToSearch.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1') : undefined;
    const queries = {
      ...(regex ? { name: { $regex: regex, $options: 'i' } } : {}),
      
    }
    const [products, productsCount] = await Promise.all([
      this.productService.getMany({
        queries,
        skip,
        limit,
        sortQuery: { created_at: 1 },
      }),
      this.productService.getCount({ queries }),
    ])
    return { success: true, products, skip, limit, total: productsCount };
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<APIResponse<{ product: ProductDocument }>> {
    const product = await this.productService.getOne({ queries: { _id: id } });
    if (!product) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.PRODUCT_WAS_NOT_FOUND,
      });
    }
    return { success: true, product };
  }

  @Post()
  async createProduct(@Body(new JoiValidationPipe(postCreateProductValidation)) body: PostCreateProductDto): Promise<APIResponse<{ product: ProductDocument }>> {
    const product = await this.productService.createOne(body);
    if (!product) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: ErrorResponseMessage.CANNOT_CREATE_PRODUCT,
      });
    }
    return { success: true, product };
  }
}
