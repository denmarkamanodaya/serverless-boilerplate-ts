import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { CaseRepository } from '../../../models/cases/case.repository';
import { dynamoDBService } from '../../../models/dynamodb';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const ageInDays = body.age || (event.queryStringParameters?.age ? parseInt(event.queryStringParameters.age) : null);

        if (!ageInDays || isNaN(ageInDays)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Please provide a valid "age" in days as integer.' }),
            };
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - ageInDays);
        const cutoffISO = cutoffDate.toISOString();

        // 1. Scan for all cases
        // ideally we would query by GSI if available, but for now we scan filtered by createdAt
        // Note: BaseEntity has createdAt.
        // Cases are stored with PK=CASE#... SK=META
        // We can scan for items where PK begins with CASE# and createdAt < cutoffISO

        const scanResult = await dynamoDBService.scan(
            'begins_with(PK, :pk) AND createdAt < :cutoff',
            {
                ':pk': 'CASE#',
                ':cutoff': cutoffISO
            }
        );

        const itemsToDelete = scanResult.Items || [];

        console.log(`Found ${itemsToDelete.length} items to delete older than ${ageInDays} days (${cutoffISO})`);

        // 2. Delete items
        const deletePromises = itemsToDelete.map(async (item: any) => {
            if (item.caseId) {
                await CaseRepository.delete(item.caseId);
            }
        });

        await Promise.all(deletePromises);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Deletion successful',
                deletedCount: itemsToDelete.length,
                cutoffDate: cutoffISO
            }),
        };

    } catch (error) {
        console.error('Error deleting old data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: String(error) }),
        };
    }
};
