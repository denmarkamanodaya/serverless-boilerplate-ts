import { dynamoDBService } from '../../models/dynamodb';
import { NotificationEntity } from './notification.types';

export class NotificationRepository {
    // Save a notification (useful for testing/seeding)
    static async save(notification: SimpleNotification) {
        const timestamp = new Date().toISOString();
        const entity: NotificationEntity = {
            PK: `NOTIF#${notification.userId}`,
            SK: `TIME#${timestamp}`,
            type: 'NOTIFICATION',
            createdAt: timestamp,
            ...notification,
            timestamp
        };
        await dynamoDBService.put(entity);
        return entity;
    }

    // List notifications for a user
    static async list(userId: string) {
        // Query by PK = NOTIF#{userId}
        const result = await dynamoDBService.query('PK = :pk', {
            ':pk': `NOTIF#${userId}`
        }, {
            ScanIndexForward: false // Newest first
        });

        return (result.Items || []) as NotificationEntity[];
    }
}

interface SimpleNotification {
    userId: string;
    title: string;
    message: string;
    read: boolean;
}
