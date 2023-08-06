import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserToCreate } from 'libs/database/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type ValidateUserResult = {
  success: true;
  user: UserDocument;
} | {
  success: false;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getDuplicateUser(username: string, email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      $or: [
        { username },
        { email },
      ],
    }).select('+username');
    return user;
  }

  async registerNewUser(body: UserToCreate): Promise<UserDocument> {
    return this.userModel.create(body);
  }

  async validateUser(username: string, password: string): Promise<ValidateUserResult> {
    const user = await this.userModel.findOne({ username }).select('+password');
    if (!user) {
      return { success: false };
    }
    const isHashMatch = await bcrypt.compare(password, user.password);
    return isHashMatch ? { success: true, user } : { success: false };
  }

  generateAccessToken(user: UserDocument): string {
    const payload = {
      user_id: user._id,
    };
    return this.jwtService.sign(payload, { privateKey: this.configService.get<string>('jwt.secretKey') });
  }
}
