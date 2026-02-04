import { APIGatewayProxyResult } from 'aws-lambda';

export interface ResponseInterface extends APIGatewayProxyResult {
    statusCode: number,
    code: string,
    data: string,
}