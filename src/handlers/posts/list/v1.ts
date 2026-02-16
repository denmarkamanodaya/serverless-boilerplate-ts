import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PostRepository } from '../../../models/posts/post.repository';

export const handler: APIGatewayProxyHandlerV2 = async () => {
    try {
        const posts = await PostRepository.list();
        return {
            statusCode: 200,
            body: JSON.stringify(posts),
        };
    } catch (error) {
        console.error('Error listing posts:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: String(error) }),
        };
    }
};
