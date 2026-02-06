import { AxiosResponseMessage } from '../../../src/common/response.interface';

describe('AxiosResponseMessage enum', () => {
  it('should contain SUCCESS with correct value', () => {
    expect(AxiosResponseMessage.SUCCESS).toBe('SUCCESS');
  });

  it('should not have unexpected values', () => {
    const values = Object.values(AxiosResponseMessage);
    expect(values).toEqual(['SUCCESS']);
  });
});
