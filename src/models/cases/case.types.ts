import { BaseEntity } from '../base.entity';

export interface CaseInput {
    caseId: string;
    status: string;
    data: any; // Flexible data payload
}

export interface CaseEntity extends BaseEntity {
    type: 'CASE';
    caseId: string;
    status: string;
    data: any;
}
