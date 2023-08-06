export type ServiceName =
  | 'user'
  | 'auth'
  | 'product'
  | 'order';

export type AppConfigValue = {
  port: number,
  service: {
    [key in ServiceName]: {
      hostname: string;
      port: number;
    };
  },
  mongodb: {
    host: string;
    database: string;
    port: string;
  },
  jwt: {
    secretKey: string,
  }
}

export default (): AppConfigValue => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  service: {
    user: {
      hostname: process.env.USER_SERVICE_HOST ?? '0.0.0.0',
      port: Number(process.env.USER_SERVICE_PORT ?? 3001),
    },
    auth: {
      hostname: process.env.AUTH_SERVICE_HOST ?? '0.0.0.0',
      port: Number(process.env.AUTH_SERVICE_PORT ?? 3002),
    },
    product: {
      hostname: process.env.PRODUCT_SERVICE_HOST ?? '0.0.0.0',
      port: Number(process.env.PRODUCT_SERVICE_PORT ?? 3003),
    },
    order: {
      hostname: process.env.ORDER_SERVICE_HOST ?? '0.0.0.0',
      port: Number(process.env.ORDER_SERVICE_PORT ?? 3004),
    },
  },
  mongodb: {
    // should use env
    host: process.env.MONGO_DB_HOST ?? '127.0.0.1',
    database: process.env.MONGO_DB_DATABASE ?? 'e-commerce',
    port: process.env.MONGO_DB_PORT ?? '27017',
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY ?? 'b2Oa%qKZ,GW]S+d',
  }
});