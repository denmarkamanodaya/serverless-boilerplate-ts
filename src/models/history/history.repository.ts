import { dynamoDBService } from '../../models/dynamodb';
import { HistoryFactory } from './history.factory';
import { HistoryEntity } from './history.types';

export class HistoryRepository {
    static async create(action: string, description: string, relatedId?: string) {
        const entity = HistoryFactory.create(action, description, relatedId);
        await dynamoDBService.put(entity);
        return entity;
    }

    static async list(limit = 50) {
        // Query PK="HISTORY" and sort by SK (Timestamp) descending to get newest first
        const result = await dynamoDBService.query('PK = :pk', {
            ':pk': 'HISTORY',
        }, {
            ScanIndexForward: false, // Descending order
            Limit: limit,
        });

        return (result.Items || []) as HistoryEntity[];
    }
}
