import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ErrorResponseMessage } from 'libs/constants/api.constant';
import { BusinessLogicHttpException } from 'libs/core/BusinessLogicHttpException';
import { JoiValidationPipe } from 'libs/pipe/joi-validation.pipe';
import { PostUserLoginDto, PostUserRegisterDto, postUserLoginValidation, postUserRegisterValidation } from './auth.dto';
import { APIResponse } from 'libs/utils/api-response';
import * as bcrypt from 'bcrypt';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async signIn(@Body(new JoiValidationPipe(postUserLoginValidation)) body: PostUserLoginDto): Promise<APIResponse<{ access_token: string }>> {
    const validationResult = await this.authService.validateUser(body.username, body.password);
    if (validationResult.success) {
      const accessToken = this.authService.generateAccessToken(validationResult.user);
      return { success: true, access_token: accessToken }
    }
    throw new BusinessLogicHttpException({
      error_code: HttpStatus.UNAUTHORIZED,
      error_message: ErrorResponseMessage.UNAUTHORIZED,
    });
  }

  @Post('register')
  async register(@Body(new JoiValidationPipe(postUserRegisterValidation)) body: PostUserRegisterDto): Promise<APIResponse> {
    const duplicatedUser = await this.authService.getDuplicateUser(body.username, body.email);
    if (duplicatedUser) {
      if (duplicatedUser.username === body.username) {
        throw new BusinessLogicHttpException({
          error_code: HttpStatus.CONFLICT,
          error_message: ErrorResponseMessage.USERNAME_IS_ALREADY_EXISTED,
        })
      }
      if (duplicatedUser.email === body.email) {
        throw new BusinessLogicHttpException({
          error_code: HttpStatus.CONFLICT,
          error_message: ErrorResponseMessage.EMAIL_IS_ALREADY_EXISTED,
        })
      }
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(body.password, salt);
    body.password = hashedPassword;
    const user = await this.authService.registerNewUser(body);
    if (!user) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: ErrorResponseMessage.CANNOT_CREATE_USER,
      })
    }
    return { success: true };
  }
}
