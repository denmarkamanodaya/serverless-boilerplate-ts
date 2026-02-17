import { BaseEntity } from '../base.entity';

export interface CommentCreator {
    email?: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    metadata?: string;
}

export interface CommentEntity extends BaseEntity {
    type: 'COMMENT';
    postId: string;
    content: string;
    createdBy: CommentCreator | string;
}
