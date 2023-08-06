import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, OrderToCreate } from 'libs/database/schemas/order.schema';
import { CRUDAbstractService } from 'libs/database/services/crud-abstract.service';
import { Model } from 'mongoose';

@Injectable()
export class OrderService extends CRUDAbstractService<OrderDocument, OrderToCreate> {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {
    super(orderModel);
  }
}
