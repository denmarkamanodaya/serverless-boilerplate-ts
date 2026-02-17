import { ClientFactory } from '../models/client/client.factory';
import { ClientRepository } from '../models/client/client.repository';

export class ClientService {
  static async createClient(data: {
    clientId: string;
    clientName: string;
    businessName: string;
    businessAddress: string;
    taxId: string;
    metadata?: string;
  }) {
    const entity = ClientFactory.create(data);

    await ClientRepository.save(entity);

    return entity;
  }
}
