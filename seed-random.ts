import { v4 as uuidv4 } from 'uuid';
import { ClientFactory } from './src/models/client/client.factory';
import { ClientRepository } from './src/models/client/client.repository';
import { CaseFactory } from './src/models/cases/case.factory';
import { CaseRepository } from './src/models/cases/case.repository';
import { HistoryRepository } from './src/models/history/history.repository';

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const businesses = ['Global Solutions', 'Tech Innovators', 'Creative Co.', 'Dynamic Systems', 'Future Enterprises', 'Apex Industries', 'Summit Group', 'Insight Corp', 'Horizon Ventures', 'Pacific Trade'];
const cities = ['Manila', 'Quezon City', 'Davao City', 'Cebu City', 'Zamboanga City', 'Antipolo', 'Pasig', 'Cagayan de Oro', 'Parañaque', 'Dasmariñas'];
const provinces = ['Metro Manila', 'Cavite', 'Laguna', 'Batangas', 'Rizal', 'Bulacan', 'Pampanga', 'Pangasinan', 'Cebu', 'Davao del Sur'];
const statuses = ['quotation', 'pending', 'confirmed', 'production', 'quality_check', 'approved', 'invoicing', 'delivery', 'completed'];

async function seed() {
    console.log('🚀 Starting Seeding Process...');

    try {
        // 1. Fetch products for cases
        const productsRes = await fetch('https://dummyjson.com/products?limit=100');
        const productsData = await productsRes.json() as any;
        const allProducts = productsData.products;

        const generatedClients = [];
        const generatedCases = [];

        // 2. Generate 100 Clients
        console.log('👥 Generating 100 clients...');
        for (let i = 0; i < 100; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const clientName = `${firstName} ${lastName}`;
            const businessName = `${businesses[Math.floor(Math.random() * businesses.length)]} ${Math.floor(Math.random() * 999)}`;
            const city = cities[Math.floor(Math.random() * cities.length)];
            const province = provinces[Math.floor(Math.random() * provinces.length)];
            const zip = Math.floor(Math.random() * 9000) + 1000;
            const address1 = `${Math.floor(Math.random() * 999)} Random St.`;
            const taxId = `${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 999)}-000`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
            const mobile = `09${Math.floor(Math.random() * 999999999).toString().padStart(9, '0')}`;

            const clientId = uuidv4();
            const clientPayload = {
                clientId,
                clientName,
                businessName,
                taxId,
                businessAddress: `${address1}, ${city}, ${province} ${zip}`,
                metadata: JSON.stringify({
                    address_information: { address1, address2: '', city, province, zip: zip.toString() },
                    contact_information: { email, mobile }
                })
            };

            const clientEntity = ClientFactory.create(clientPayload);
            await ClientRepository.save(clientEntity);
            generatedClients.push(clientEntity);

            if ((i + 1) % 20 === 0) console.log(`Created ${i + 1} clients...`);
        }

        // 3. Generate 100 Cases
        console.log('💼 Generating 100 cases...');
        const createdBy = {
            email: 'seeder@firetron.ph',
            firstName: 'Seeder',
            lastName: 'Bot',
            avatarUrl: ''
        };

        for (let i = 0; i < 100; i++) {
            const client = generatedClients[Math.floor(Math.random() * generatedClients.length)];
            const meta = JSON.parse(client.metadata || '{}');

            // Random Date (within last 4 months)
            const date = new Date();
            date.setMonth(date.getMonth() - Math.floor(Math.random() * 4));
            date.setDate(Math.floor(Math.random() * 28) + 1);
            const dateString = date.toISOString().split('T')[0];

            const status = statuses[Math.floor(Math.random() * statuses.length)];

            // Random Products (1-4 items)
            const numProducts = Math.floor(Math.random() * 4) + 1;
            const caseProducts = [];
            let subtotal = 0;

            for (let j = 0; j < numProducts; j++) {
                const p = allProducts[Math.floor(Math.random() * allProducts.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                const total = p.price * quantity;
                subtotal += total;

                caseProducts.push({
                    productId: p.id,
                    name: p.title,
                    price: p.price,
                    quantity: quantity,
                    condition: 'Brand New',
                    total: total,
                    thumbnail: p.thumbnail
                });
            }

            const caseId = uuidv4();
            const caseEntity = CaseFactory.create({
                caseId,
                status,
                data: {
                    clientDetails: {
                        clientName: client.clientName,
                        businessName: client.businessName,
                        taxId: client.taxId,
                        email: meta.contact_information.email,
                        mobile: meta.contact_information.mobile,
                        address1: meta.address_information.address1,
                        address2: meta.address_information.address2,
                        city: meta.address_information.city,
                        province: meta.address_information.province,
                        zip: meta.address_information.zip
                    },
                    orderDetails: {
                        leadTime: dateString,
                        terms: '30'
                    },
                    products: caseProducts,
                    grandTotal: parseFloat(subtotal.toFixed(2))
                },
                createdBy
            });

            await CaseRepository.save(caseEntity);

            // 4. Log in History
            await HistoryRepository.create('CASE_CREATED', `Seeded Case #${caseId.slice(-4).toUpperCase()} for ${client.clientName}`, caseId, createdBy);

            generatedCases.push(caseId);
            if ((i + 1) % 20 === 0) console.log(`Created ${i + 1} cases...`);
        }

        console.log('\n✅ Seeding complete!');
        console.log(`- Clients: ${generatedClients.length}`);
        console.log(`- Cases: ${generatedCases.length}`);

    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
    }
}

seed();
