import { BaseEntity } from '../base.entity';

export interface CaseCreator {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    metadata?: string;
}

export interface CaseInput {
    caseId: string;
    status: string;
    data: any; // Flexible data payload
    createdBy?: CaseCreator;
}

export interface CaseEntity extends BaseEntity {
    type: 'CASE';
    caseId: string;
    status: string;
    data: any;
    createdBy?: CaseCreator;
}
