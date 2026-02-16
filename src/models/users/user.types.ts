export enum UserRole {
    SUPERADMIN = 'superadmin',
    ADMIN = 'admin',
    MEMBER = 'member',
    GUEST = 'guest',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

export interface UserEntity {
    PK: string; // USER#<email>
    SK: string; // META
    firstName: string;
    lastName: string;
    emailAddress: string;
    passwordHash: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    avatarUrl?: string; // Optional
    metadata?: string; // JSON string for extra data
    type: 'USER';
}

export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    role: UserRole;
    avatarUrl?: string;
    status?: UserStatus;
    metadata?: string;
}
