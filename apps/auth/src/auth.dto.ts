import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class PostUserLoginDto {
  @ApiProperty({
    type: String,

  })
  username: string;
  @ApiProperty({
    type: String,
  })
  password: string;
}

export const postUserLoginValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export class PostUserRegisterDto {
  @ApiProperty({
    type: String,
  })
  first_name: string;
  @ApiProperty({
    type: String,
  })
  last_name: string;
  @ApiProperty({
    type: String,
    minLength: 6,
  })
  username: string;
  @ApiProperty({
    type: String,
  })
  password: string;
  @ApiProperty({
    type: String,
  })
  email: string;
  @ApiProperty({
    type: String,
    minLength: 9,
    maxLength: 10,
    example: '08XXXXXXXX'
  })
  mobile_number: string;
  @ApiProperty({
    type: String,
  })
  address: string;
}

export const postUserRegisterValidation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  username: Joi.string().min(6).required(),
  password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
  email: Joi.string().email().required(),
  mobile_number: Joi.string().regex(/^[0-9]{9,10}$/).required(),
  address: Joi.string().required(),
})
