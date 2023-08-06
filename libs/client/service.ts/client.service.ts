import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Request } from 'express';
import { AppConfigValue, ServiceName } from 'libs/config/app.config';

@Injectable()
export class ClientService {
  auth: (req?: Request) => AxiosInstance;
  user: (req?: Request) => AxiosInstance;
  product: (req?: Request) => AxiosInstance;
  order: (req?: Request) => AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const service = this.configService.get('service') as AppConfigValue['service'];
    Object.keys(service).forEach((_name) => {
      const name = _name as ServiceName;
      this[name] = (req?: Request) => {
        const instance = axios.create({
          timeout: 1000 * 60,
          baseURL: `http://${service[name].hostname}:${service[name].port}`,
          // headers: req.headers,
        });
        return instance;
      }
    });
  }
}
