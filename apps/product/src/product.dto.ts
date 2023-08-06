import * as Joi from 'joi';
import { Product } from 'libs/database/schemas/product.schema';

export type PostCreateProductDto = Product;

export const postCreateProductValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(1).required(),
  is_active: Joi.boolean().required(),
});
