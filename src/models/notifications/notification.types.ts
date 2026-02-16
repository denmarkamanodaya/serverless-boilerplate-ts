import { BaseEntity } from '../base.entity';

export interface NotificationEntity extends BaseEntity {
    type: 'NOTIFICATION';
    userId: string;
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
}
