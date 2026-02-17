import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CommentRepository } from '../../../../models/posts/comment.repository';
import { PostRepository } from '../../../../models/posts/post.repository';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { postId, content, createdBy } = body;

        if (!postId || !content || !createdBy) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: postId, content, createdBy' }),
            };
        }

        // Create the comment
        const comment = await CommentRepository.create({
            postId,
            content,
            createdBy
        });

        return {
            statusCode: 201,
            body: JSON.stringify(comment),
        };
    } catch (error) {
        console.error('Error creating comment:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: String(error) }),
        };
    }
};
