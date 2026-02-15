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
}
