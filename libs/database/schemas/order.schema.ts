import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Product } from './product.schema';

export enum PaymentStatus {
  canceled = 'canceled',
  pending = 'pending',
  paid = 'paid',
  expired = 'expired',
  refunded = 'refunded',
}

export type SelectedProductItem = {
  product_id: Product | string,
  product_data: Product,
  amount: number,
}

export const SelectedProductItemSchema = {
  product_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: Product.name,
  },
  product_data: {
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    is_active: { type: Boolean },
  },
  amount: {
    type: Number
  },
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
})
export class Order {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
  })
  user_id: string | User;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.pending,
    required: true,
  })
  payment_status: PaymentStatus;

  @Prop({
    type: [SelectedProductItemSchema],
    required: true,
  })
  selected_product: SelectedProductItem[]

  @Prop({
    type: Number,
  })
  total_price: number;

  @Prop({
    type: Date,
  })
  paid_date?: Date;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  is_delivered: boolean;

  @Prop({
    type: Date,
  })
  delivery_date?: Date;

  @Prop({
    type: String,
    required: true,
  })
  deliverly_address: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = Order & Document;
export type OrderToCreate = Order;
