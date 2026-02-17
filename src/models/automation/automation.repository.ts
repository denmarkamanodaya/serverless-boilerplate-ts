import { dynamoDBService } from '../../models/dynamodb';

export class AutomationRepository {

    static async updateByType(type: string, key: string, value: any) {
        // Query items by type using GSI1 if available, or Scan with Filter
        // Assuming Scan for broad compatibility as per initial implementation
        const scanResult = await dynamoDBService.scan(
            '#type = :type',
            { ':type': type },
            { '#type': 'type' }
        );

        const items = scanResult.Items || [];
        let updatedCount = 0;

        for (const item of items) {
            try {
                if (item.PK && item.SK) {
                    await dynamoDBService.update(
                        { PK: item.PK, SK: item.SK },
                        'set #key = :value',
                        { '#key': key },
                        { ':value': value }
                    );
                    updatedCount++;
                }
            } catch (error) {
                console.error(`Failed to update item ${item.PK}`, error);
            }
        }

        return { updatedCount, totalFound: items.length };
    }

    static async archiveByAge(type: string, ageInDays: number) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() + ageInDays);

        const scanResult = await dynamoDBService.scan(
            '#type = :type AND #createdAt < :cutoffDate',
            {
                ':type': type,
                ':cutoffDate': cutoffDate.toISOString()
            },
            {
                '#type': 'type',
                '#createdAt': 'createdAt'
            }
        );

        const items = scanResult.Items || [];
        let archivedCount = 0;

        for (const item of items) {
            try {
                if (item.PK && item.SK) {
                    await dynamoDBService.update(
                        { PK: item.PK, SK: item.SK },
                        'set #status = :status',
                        { '#status': 'status' },
                        { ':status': 'ARCHIVED' }
                    );
                    archivedCount++;
                }
            } catch (error) {
                console.error(`Failed to archive item ${item.PK}`, error);
            }
        }

        return {
            archivedCount,
            totalFound: items.length,
            cutoffDate: cutoffDate.toISOString()
        };
    }
}
