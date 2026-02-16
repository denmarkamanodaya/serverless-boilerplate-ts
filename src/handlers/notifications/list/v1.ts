import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { NotificationRepository } from '../../../models/notifications/notification.repository';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        // In a real app we'd get userId from authorizer context. 
        // For now, we'll accept it as a query param or default to a test user.
        const userId = event.queryStringParameters?.userId || 'test-user';

        // Optional: Seed some data if empty (for demo purposes)
        const notifications = await NotificationRepository.list(userId);

        if (notifications.length === 0) {
            await NotificationRepository.save({
                userId,
                title: 'Welcome to Notifications',
                message: 'This is your first notification.',
                read: false
            });
            await NotificationRepository.save({
                userId,
                title: 'System Update',
                message: 'The system has been updated successfully.',
                read: true
            });
            // Re-fetch
            const seeded = await NotificationRepository.list(userId);
            return {
                statusCode: 200,
                body: JSON.stringify(seeded),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(notifications),
        };

    } catch (error) {
        console.error('Error listing notifications:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: String(error) }),
        };
    }
};
