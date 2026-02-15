import { v4 } from 'uuid';
import { HistoryEntity } from './history.types';

export class HistoryFactory {
    static create(action: string, description: string, relatedId?: string, user?: any): HistoryEntity {
        const timestamp = new Date().toISOString();
        const id = v4();

        return {
            PK: 'HISTORY',
            SK: `TIMESTAMP#${timestamp}#${id}`,
            type: 'HISTORY',
            action,
            description,
            relatedId,
            user,
            createdAt: timestamp,
        };
    }
}
