import { Keys } from '../keys';
import { CaseInput, CaseEntity } from './case.types';

export class CaseFactory {
    static create(input: CaseInput): CaseEntity {
        return {
            ...Keys.case(input.caseId),
            type: 'CASE',
            caseId: input.caseId,
            status: input.status,
            data: input.data,
            createdAt: new Date().toISOString(),
        };
    }
}
