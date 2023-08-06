import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
})
export class User {
  @Prop({
    type: String,
    required: true,
  })
  first_name: string;

  @Prop({
    type: String,
    required: true,
  })
  last_name: string;

  @Prop({
    type: String,
    unique: true,
    select: false,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    select: false,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  mobile_number: string;

  @Prop({
    type: String,
    required: true,
  })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
export type UserToCreate = User;
