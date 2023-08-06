import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { RequestWithUser, UserAuthGuard } from 'libs/auth/guards/user.guard';
import { APIResponse, ErrorResponse } from 'libs/utils/api-response';
import { OrderDocument, OrderToCreate, PaymentStatus, SelectedProductItem } from 'libs/database/schemas/order.schema';
import { BusinessLogicHttpException } from 'libs/core/BusinessLogicHttpException';
import { ErrorResponseMessage } from 'libs/constants/api.constant';
import { PostOrderDto, postOrderValidation } from './order.dto';
import { JoiValidationPipe } from 'libs/pipe/joi-validation.pipe';
import { ClientService } from 'libs/client/service.ts/client.service';
import { GetMyUserResponse } from 'apps/user/src/user.controller';
import { ProductDocument } from 'libs/database/schemas/product.schema';
import { AxiosError } from 'axios';

@UseGuards(UserAuthGuard)
@Controller('api/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly client: ClientService,
  ) { }

  @Get('me')
  async getAllMyOrder(
    @Req() req: RequestWithUser,
    @Query('skip', new DefaultValuePipe(0), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) skip: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number,
  ): Promise<APIResponse<{
    orders: OrderDocument[],
    skip: number,
    limit: number,
    total: number,
  }>> {
    const queries = {
      user_id: req.user._id,
    };
    const [orders, ordersCount] = await Promise.all([
      this.orderService.getMany({
        queries,
        skip,
        limit,
        sortQuery: { _id: -1 },
      }),
      this.orderService.getCount({ queries }),
    ]);
    return { success: true, orders, skip, limit, total: ordersCount };
  }

  @Get(':id')
  async getMyOrderById(
    @Req() req: RequestWithUser,
    @Param('id') id: string
  ): Promise<APIResponse<{ order: OrderDocument }>> {
    const order = await this.orderService.getOne({
      queries: {
        _id: id,
        user_id: req.user._id,
      },
    })
    if (!order) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.ORDER_WAS_NOT_FOUND,
      });
    }
    return { success: true, order };
  }

  @Post()
  async postOrder(
    @Req() req: RequestWithUser,
    @Body(new JoiValidationPipe(postOrderValidation)) body: PostOrderDto,
  ): Promise<APIResponse<{ order: OrderDocument }>> {
    let response;
    try {
      response = await this.client.user().get<APIResponse<GetMyUserResponse>>(`/api/user/me`, {
        headers: { Authorization: req.headers['authorization'] }
      });
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>
        throw new BusinessLogicHttpException({
          error_code: err.response.data.error_code,
          error_message: err.response.data.error_message,
        });
    };

    if (!response.data.success) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: ErrorResponseMessage.SOMETHING_WENT_WRONG,
      })
    }
    const { user } = response.data;
    const { selected_product, deliverly_address } = body;
    const mySelectedProduct = await Promise.all(selected_product.map(async (item): Promise<SelectedProductItem> => {
      try {
        const resp = await this.client.product().get<APIResponse<{ product: ProductDocument }>>(`api/product/${item.product_id.toString()}`);
        if (!resp.data.success) {
          throw new BusinessLogicHttpException({
            error_code: HttpStatus.INTERNAL_SERVER_ERROR,
            error_message: ErrorResponseMessage.PRODUCT_WAS_NOT_FOUND,
          })
        }
        const { product } = resp.data;
        return {
          product_id: product._id,
          amount: item.amount,
          product_data: {
            description: product.description,
            is_active: product.is_active,
            name: product.name,
            price: product.price,
          },
        };
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        throw new BusinessLogicHttpException({
          error_code: err.response.data.error_code,
          error_message: err.response.data.error_message,
        });
      }
    }));
    const totalPrice = mySelectedProduct.reduce((accumulator, currentValue) => {
      return accumulator + (currentValue.amount * currentValue.product_data.price);
    }, 0);
    const dataToCreate: OrderToCreate = {
      user_id: req.user._id,
      is_delivered: false,
      payment_status: PaymentStatus.pending,
      selected_product: mySelectedProduct,
      deliverly_address,
      total_price: totalPrice,
    };
    const order = await this.orderService.createOne(dataToCreate);
    if (!order) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: ErrorResponseMessage.CANNOT_CREATE_ORDER,
      });
    }
    return { success: true, order };
  }

  @Patch('cancel/:id')
  async cancelOrderById(@Param('id') id: string): Promise<APIResponse<{ order: OrderDocument }>> {
    const order = await this.orderService.getOneAndUpdate({
      queries: { _id: id },
      update: { $set: { payment_status: PaymentStatus.canceled } },
    });
    if (!order) {
      throw new BusinessLogicHttpException({
        error_code: HttpStatus.NOT_FOUND,
        error_message: ErrorResponseMessage.ORDER_WAS_NOT_FOUND,
      });
    }
    return { success: true, order };
  }
}
