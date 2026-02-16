import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PostRepository } from '../../../models/posts/post.repository';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const { content, createdBy } = body;

        if (!content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Content is required.' }),
            };
        }

        // Extract tags (e.g. @344A)
        const tagRegex = /@(\w+)/g;
        const tags: string[] = [];
        let match;
        while ((match = tagRegex.exec(content)) !== null) {
            tags.push(match[1]);
        }

        const newPost = await PostRepository.create({
            content,
            createdBy: createdBy || { firstName: 'Anonymous' },
            tags
        });

        return {
            statusCode: 201,
            body: JSON.stringify(newPost),
        };

    } catch (error) {
        console.error('Error creating post:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: String(error) }),
        };
    }
};
