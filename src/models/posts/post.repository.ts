import { dynamoDBService } from '../../models/dynamodb';
import { PostEntity, PostCreator } from './post.types';

export class PostRepository {
    static async create(post: SimplePost) {
        const timestamp = new Date().toISOString();
        const entity: PostEntity = {
            PK: 'POST#ALL', // Single partition for global feed (simple design)
            SK: `TIME#${timestamp}`,
            type: 'POST',
            createdAt: timestamp,
            reactionCounter: 0,
            ...post
        };
        await dynamoDBService.put(entity);
        return entity;
    }

    static async list() {
        // Query global posts
        const result = await dynamoDBService.query('PK = :pk', {
            ':pk': 'POST#ALL',
            ':archived': 'ARCHIVED',
        }, {
            ScanIndexForward: false, // Newest first
            Limit: 50, // Increased limit to see recent posts better
            FilterExpression: 'attribute_not_exists(#status) OR #status <> :archived',
            ExpressionAttributeNames: { '#status': 'status' },
        });

        return (result.Items || []) as PostEntity[];
    }
}

interface SimplePost {
    content: string;
    createdBy: PostCreator | string;
    tags: string[];
}
