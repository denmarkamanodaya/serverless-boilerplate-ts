import { dynamoDBService } from '../dynamodb';
import { UserEntity } from './user.types';

export class UserRepository {
    static async save(user: UserEntity): Promise<void> {
        await dynamoDBService.put(user);
    }

    static async findByEmail(email: string): Promise<UserEntity | undefined> {
        const result = await dynamoDBService.get({
            PK: `USER#${email}`,
            SK: 'META',
        });

        return result.Item as UserEntity | undefined;
    }

    static async list(): Promise<UserEntity[]> {
        const result = await dynamoDBService.scan(
            '#type = :type AND (attribute_not_exists(#status) OR #status <> :archived)',
            { ':type': 'USER', ':archived': 'ARCHIVED' },
            { '#type': 'type', '#status': 'status' }
        );

        return (result.Items || []) as UserEntity[];
    }
}
