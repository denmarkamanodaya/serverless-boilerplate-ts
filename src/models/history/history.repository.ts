import { dynamoDBService } from '../../models/dynamodb';
import { HistoryFactory } from './history.factory';
import { HistoryEntity } from './history.types';

export class HistoryRepository {
    static async create(action: string, description: string, relatedId?: string, user?: any) {
        const entity = HistoryFactory.create(action, description, relatedId, user);
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

    static async listByCaseId(caseId: string, limit = 50) {
        // Query PK="HISTORY" and Filter by relatedId
        // Note: For high volume, a GSI on relatedId would be better.
        // But for this scale, filtering is acceptable since we query a specific partition.
        // Actually, since all history is in PK=HISTORY, filtering might be slow if history grows huge.
        // But given current constraints, filtering is the quickest path.
        const result = await dynamoDBService.query('PK = :pk', {
            ':pk': 'HISTORY',
            ':caseId': caseId,
        }, {
            ScanIndexForward: true, // Ascending order (oldest to newest for journey)
            FilterExpression: 'relatedId = :caseId',
            Limit: limit,
        });

        return (result.Items || []) as HistoryEntity[];
    }
}
