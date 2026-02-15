import { BaseEntity } from '../base.entity';

export interface HistoryEntity extends BaseEntity {
    type: 'HISTORY';
    action: string;      // e.g., "CASE_CREATED", "STATUS_UPDATE", "CLIENT_CREATED"
    description: string; // Human readable description
    relatedId?: string;  // ID of the case/client involved
    user?: {
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    createdAt: string;   // ISO string
}
