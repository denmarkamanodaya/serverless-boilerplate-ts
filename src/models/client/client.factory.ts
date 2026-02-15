import { Keys } from '../keys';
import { ClientInput, ClientEntity } from './client.types';

export class ClientFactory {
  static create(input: ClientInput): ClientEntity {
    return {
      ...Keys.client(input.clientId),
      type: 'CLIENT',
      clientName: input.clientName,
      businessName: input.businessName,
      businessAddress: input.businessAddress,
      taxId: input.taxId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }
}
