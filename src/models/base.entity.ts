export interface BaseKey {
  PK: string;
  SK: string;
}

export interface BaseEntity extends BaseKey {
  type: string;
  createdAt: string;
}
