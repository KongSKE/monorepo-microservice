import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
})
export class Product {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  is_active: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;
export type ProductToCreate = Product;
