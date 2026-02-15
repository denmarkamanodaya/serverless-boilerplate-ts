import { dynamoDBService } from '../dynamodb';
import { ClientEntity } from './client.types';

export class ClientRepository {
  static async save(client: ClientEntity) {
    await dynamoDBService.put(client, 'attribute_not_exists(PK)');
  }

  static async get(clientId: string) {
    const result = await dynamoDBService.query('PK = :pk AND SK = :sk', {
      ':pk': `CLIENT#${clientId}`,
      ':sk': 'META',
    });

    return result.Items?.[0] as ClientEntity | undefined;
  }

  static async list() {
    const result = await dynamoDBService.scan('begins_with(PK, :pk) AND SK = :sk', {
      ':pk': 'CLIENT#',
      ':sk': 'META',
    });

    return (result.Items || []) as ClientEntity[];
  }
}
