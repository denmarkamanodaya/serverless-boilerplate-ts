import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { CaseRepository } from '../../../models/cases/case.repository';

interface ProductStats {
    name: string;
    quantity: number;
    orders: number;
}

export const handler = Middleware(async (event) => {
    // 1. Fetch all cases with status 'completed'
    const cases = await CaseRepository.list('completed');

    const productMap: Record<string, ProductStats> = {};

    // 2. Aggregate product data
    cases.forEach((caseEntity) => {
        const products = caseEntity.data?.products;

        if (Array.isArray(products)) {
            products.forEach((product: any) => {
                const productName = product.name;

                if (productName) {
                    if (!productMap[productName]) {
                        productMap[productName] = {
                            name: productName,
                            quantity: 0,
                            orders: 0
                        };
                    }

                    // Parse quantity carefully
                    const qty = parseInt(product.quantity, 10) || 1;

                    productMap[productName].quantity += qty;
                    productMap[productName].orders += 1;
                }
            });
        }
    });

    // 3. Convert to array and sort
    // Sort by quantity descending
    const topProducts = Object.values(productMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10); // Limit to top 10

    return {
        statusCode: httpStatus.OK,
        body: JSON.stringify({
            message: ResponseMessage.SUCCESS,
            data: topProducts,
        }),
    };
});
