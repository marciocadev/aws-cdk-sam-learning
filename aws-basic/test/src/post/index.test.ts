import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../../src/post';
import * as uuid from 'uuid';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('uuid');
jest.mock('aws-xray-sdk', () => ({
    captureAWSv3Client: jest.fn().mockReturnValue(
        new DynamoDBClient({})
    )
}));

describe('Test Post Lambda', () => {
    const env = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = env;
        process.env.tableName = 'basic-db';
        process.env.AWS_SAM_LOCAL = 'true';
    });

    afterAll(() => {
        process.env = env;
    });

    test('Get Lambda success invocation', async() => {
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ obj: 'teste' })
        } as any;
        const uuidSpy = jest.spyOn(uuid, 'v4').mockReturnValue('123');
        
        const result = await handler(event);

        expect(uuidSpy).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({ statusCode: 200, body: JSON.stringify({id: '123'})});

        let client: DynamoDBClient = new DynamoDBClient({});

        expect(PutItemCommand).toHaveBeenCalledWith({
            TableName: process.env.tableName,
            Item: {
                id: {S: '123'},
                obj: 'teste'
            }
        });
        expect(client.send).toBeCalledTimes(1);
    });

    test('Lambda receive null object', async() => {
        const event: APIGatewayProxyEvent = {
            body: null
        } as any;
        
        const result = await handler(event);

        expect(result).toMatchObject({ statusCode: 400, body: 'Error'});
    });
});