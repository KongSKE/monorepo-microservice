import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser, UserAuthGuard } from 'libs/auth/guards/user.guard';
import { APIResponse } from 'libs/utils/api-response';
import { UserDocument } from 'libs/database/schemas/user.schema';
import { BusinessLogicHttpException } from 'libs/core/BusinessLogicHttpException';
import { ErrorResponseMessage } from 'libs/constants/api.constant';

export type GetMyUserResponse = {
  user: UserDocument,
}

@UseGuards(UserAuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Req() req: RequestWithUser): Promise<APIResponse<GetMyUserResponse>> {
    const user = await this.userService.getOne({ queries: { _id: req.user._id } });
    if (!user) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.USER_WAS_NOT_FOUND,
      });
    }
    return { success: true, user };
  }
}
