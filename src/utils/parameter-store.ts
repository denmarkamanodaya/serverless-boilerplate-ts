import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const client = new SSMClient({ region: process.env.AWS_REGION });

export const GetParameters = async () => {
  const command = new GetParameterCommand({ Name: process.env.SSM_PARAMETER_NAME, WithDecryption: true });
  const response = await client.send(command);

  return response.Parameter?.Value;
};
