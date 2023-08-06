import * as Joi from 'joi';
import { SelectedProductItem } from 'libs/database/schemas/order.schema';
import { Order, OrderDocument } from 'libs/database/schemas/order.schema';
import { Model } from 'mongoose';

export type PostOrderDto = (Omit<Order,
  | 'user_id'
  | 'payment_status'
  | 'selected_product'
  | 'total_price'
  | 'paid_date'
  | 'is_delivered'
  | 'delivery_date'>
  & {
    selected_product: (Omit<SelectedProductItem, 'product_data'>)[]
  });
// {
//   user_id: string | User;
//   payment_status: PaymentStatus;
//   selected_product: SelectedProductItem[]
//   total_price: number;
//   paid_date?: Date;
//   is_delivered: boolean;
//   delivery_date?: Date;
//   deliverly_address: string;
// }

export const postOrderValidation = Joi.object({
  selected_product: Joi.array().items(Joi.object({
    product_id: Joi.string().required(),
    amount: Joi.number().min(1).required(),
  })),
  deliverly_address: Joi.string().required(),
});
