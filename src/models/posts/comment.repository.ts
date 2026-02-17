import { dynamoDBService } from '../../models/dynamodb';
import { CommentEntity, CommentCreator } from './comment.types';

export class CommentRepository {
    /**
     * Create a new comment for a post
     */
    static async create(comment: SimpleComment) {
        const timestamp = new Date().toISOString();
        const entity: CommentEntity = {
            PK: `POST#${comment.postId}`,
            SK: `COMMENT#${timestamp}`,
            type: 'COMMENT',
            postId: comment.postId,
            content: comment.content,
            createdBy: comment.createdBy,
            createdAt: timestamp,
        };
        await dynamoDBService.put(entity);
        return entity;
    }

    /**
     * List all comments for a specific post
     */
    static async listByPostId(postId: string) {
        const result = await dynamoDBService.query(
            'PK = :pk AND begins_with(SK, :sk)',
            {
                ':pk': `POST#${postId}`,
                ':sk': 'COMMENT#'
            },
            {
                ScanIndexForward: true, // Oldest first (chronological)
            }
        );

        return (result.Items || []) as CommentEntity[];
    }
}

interface SimpleComment {
    postId: string;
    content: string;
    createdBy: CommentCreator | string;
}
