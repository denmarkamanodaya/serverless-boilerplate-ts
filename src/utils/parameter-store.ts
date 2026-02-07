import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export const GetParameters = async () => {
  const client = new SSMClient({ region: process.env.AWS_REGION });
  const command = new GetParameterCommand({ Name: process.env.SSM_PARAMETER_NAME, WithDecryption: true });
  const response = await client.send(command);

  return response?.Parameter?.Value;
};
