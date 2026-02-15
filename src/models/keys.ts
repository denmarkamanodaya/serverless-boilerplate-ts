import { BaseKey } from './base.entity';

export const Keys = {
  client(clientId: string): BaseKey {
    return {
      PK: `CLIENT#${clientId}`,
      SK: 'META',
    };
  },

  application(clientId: string, appId: string): BaseKey {
    return {
      PK: `CLIENT#${clientId}`,
      SK: `APP#${appId}`,
    };
  },

  product(productId: string): BaseKey {
    return {
      PK: `PRODUCT#${productId}`,
      SK: 'META',
    };
  },

  user(userId: string): BaseKey {
    return {
      PK: `USER#${userId}`,
      SK: 'META',
    };
  },

  case(caseId: string): BaseKey {
    return {
      PK: `CASE#${caseId}`,
      SK: 'META',
    };
  },
};
