import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CommentRepository } from '../../../../models/posts/comment.repository';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const postId = event.queryStringParameters?.postId;

        if (!postId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required parameter: postId' }),
            };
        }

        const comments = await CommentRepository.listByPostId(postId);

        return {
            statusCode: 200,
            body: JSON.stringify(comments),
        };
    } catch (error) {
        console.error('Error listing comments:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: String(error) }),
        };
    }
};
