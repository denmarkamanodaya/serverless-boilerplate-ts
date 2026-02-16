import { dynamoDBService } from '../../models/dynamodb';
import { CaseEntity } from './case.types';

export class CaseRepository {
    static async save(caseEntity: CaseEntity) {
        await dynamoDBService.put(caseEntity);
    }

    static async get(caseId: string) {
        const result = await dynamoDBService.query('PK = :pk AND SK = :sk', {
            ':pk': `CASE#${caseId}`,
            ':sk': 'META',
        });

        return result.Items?.[0] as CaseEntity | undefined;
    }

    static async list(status?: string) {
        if (status) {
            const result = await dynamoDBService.scan('begins_with(PK, :pk) AND #status = :status', {
                ':pk': 'CASE#',
                ':status': status,
            }, {
                '#status': 'status',
            });
            return (result.Items || []) as CaseEntity[];
        }

        const result = await dynamoDBService.scan('begins_with(PK, :pk)', {
            ':pk': 'CASE#',
        });
        return (result.Items || []) as CaseEntity[];
    }

    static async updateStatus(caseId: string, status: string) {
        await dynamoDBService.update({
            PK: `CASE#${caseId}`,
            SK: 'META',
        }, 'set #status = :status', {
            '#status': 'status',
        }, {
            ':status': status,
        });
    }
    static async delete(caseId: string) {
        await dynamoDBService.delete({
            PK: `CASE#${caseId}`,
            SK: 'META',
        });
    }
}
