import { BaseEntity } from '../base.entity';

export interface ClientInput {
  clientId: string;
  clientName: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
}

export interface ClientEntity extends BaseEntity {
  type: 'CLIENT';
  clientName: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
  status: 'ACTIVE' | 'INACTIVE';
}
