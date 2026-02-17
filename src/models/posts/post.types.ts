import { BaseEntity } from '../base.entity';

export interface PostCreator {
    email?: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    metadata?: string;
}

export interface PostEntity extends BaseEntity {
    type: 'POST';
    content: string;
    createdBy: PostCreator | string; // Support both for backward compatibility
    tags: string[]; // Extracted tags like ['344A']
    reactionCounter: number;
    commentCount?: number; // Number of comments
}
