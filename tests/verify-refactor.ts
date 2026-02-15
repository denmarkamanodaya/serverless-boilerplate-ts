import { ClientFactory } from '../src/models/client/client.factory';
import { ClientRepository } from '../src/models/client/client.repository';
import { dynamoDBService } from '../src/models/dynamodb';

const verify = async () => {
    const clientId = `test-${Date.now()}`;
    const input = {
        clientId,
        clientName: 'Test Client',
        businessName: 'Test Business',
        businessAddress: '123 Test St',
        taxId: '123-456',
    };

    console.log('Creating client...');
    const client = ClientFactory.create(input);
    console.log('Client created:', client);

    console.log('Saving client...');
    try {
        await ClientRepository.save(client);
        console.log('Client saved.');
    } catch (e) {
        console.error('Error saving client:', e);
        // It might fail if table doesn't exist, which is expected if not running local DynamoDB or if table not created.
        // But we assume the environment is set up as per previous context or we might need to mock.
        // However, the goal is to verify the CODE refactor.
    }

    console.log('Fetching client...');
    try {
        const fetched = await ClientRepository.get(clientId);
        console.log('Fetched client:', fetched);

        if (fetched && fetched.PK === client.PK && fetched.clientName === client.clientName) {
            console.log('Verification SUCCESS!');
        } else {
            console.error('Verification FAILED: Fetched client does not match.');
        }
    } catch (e) {
        console.error('Error fetching client:', e);
    }

    // List verification
    console.log('Listing clients...');
    try {
        const clients = await ClientRepository.list();
        console.log('Clients found:', clients.length);
        if (clients.length > 0) {
            console.log('List Verification SUCCESS!');
        } else {
            console.log('List Verification WARNING: No clients found (or scan failed silently).');
        }
    } catch (e) {
        console.error('Error listing clients:', e);
    }
};

verify();
