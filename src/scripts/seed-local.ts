import { CaseFactory } from '../models/cases/case.factory';
import { CaseRepository } from '../models/cases/case.repository';
import { HistoryRepository } from '../models/history/history.repository';
import { v4 } from 'uuid';
import axios from 'axios';

async function seed() {
    console.log('Starting seeder...');

    try {
        const productsRes = await axios.get('https://dummyjson.com/products?limit=100');
        const productsData = productsRes.data;
        const allProducts = productsData.products;

        const generatedCases = [];

        for (let i = 0; i < 100; i++) {
            // Random Date (within +/- 3 months)
            const date = new Date();
            date.setMonth(date.getMonth() + Math.floor(Math.random() * 6) - 3);
            date.setDate(Math.floor(Math.random() * 28) + 1);
            const dateString = date.toISOString().split('T')[0];

            // Random Status
            const statuses = ['quotation', 'pending', 'confirmed', 'production', 'quality_check', 'approved', 'invoicing', 'delivery', 'completed'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            // Random Products (1-5 items)
            const numProducts = Math.floor(Math.random() * 5) + 1;
            const caseProducts = [];
            let grandTotal = 0;

            for (let j = 0; j < numProducts; j++) {
                const p = allProducts[Math.floor(Math.random() * allProducts.length)];
                const quantity = Math.floor(Math.random() * 5) + 1;
                const total = p.price * quantity;
                grandTotal += total;

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

            const caseId = v4();
            const createdBy = {
                email: 'seeder@firetron.ph',
                firstName: 'Seeder',
                lastName: 'Bot',
                avatarUrl: ''
            };

            const caseEntity = CaseFactory.create({
                caseId,
                status: randomStatus,
                data: {
                    clientDetails: {
                        clientName: `Test Client ${i + 1}`,
                        businessName: `Business ${i + 1} Inc.`,
                        taxId: `TAX-${Math.floor(Math.random() * 10000)}`,
                        businessAddress: `123 Random St, City ${i + 1}`
                    },
                    orderDetails: {
                        leadTime: dateString,
                        terms: '30'
                    },
                    products: caseProducts,
                    grandTotal: parseFloat(grandTotal.toFixed(2))
                },
                createdBy
            });

            await CaseRepository.save(caseEntity);
            await HistoryRepository.create('CASE_CREATED', `Seeded Case #${caseId.slice(-4).toUpperCase()}`, caseId, createdBy);

            generatedCases.push(caseId);
            if ((i + 1) % 10 === 0) console.log(`Generated ${i + 1} cases...`);
        }

        console.log(`Successfully generated ${generatedCases.length} cases.`);
    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

seed();
