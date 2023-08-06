import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserToCreate } from 'libs/database/schemas/user.schema';
import { CRUDAbstractService } from 'libs/database/services/crud-abstract.service';
import { Model } from 'mongoose';

@Injectable()
export class UserService extends CRUDAbstractService<UserDocument, UserToCreate> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
