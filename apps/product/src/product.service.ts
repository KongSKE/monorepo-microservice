import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument, ProductToCreate } from 'libs/database/schemas/product.schema';
import { CRUDAbstractService } from 'libs/database/services/crud-abstract.service';
import { Model } from 'mongoose';

@Injectable()
export class ProductService extends CRUDAbstractService<ProductDocument, ProductToCreate> {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {
    super(productModel);
  }
}
