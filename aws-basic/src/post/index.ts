import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';

let client: DynamoDBClient;
if (process.env.AWS_SAM_LOCAL) {
    client = new DynamoDBClient({ region: 'us-east-1' });
} else {
    const AWSXRay = require('aws-xray-sdk');
    client = AWSXRay.captureAWSv3Client(
        new DynamoDBClient({ region: 'us-east-1' })
    );
}

export const handler = 
    async (event:APIGatewayProxyEvent) 
        :Promise<APIGatewayProxyResult> => {
    
    if (event.body === undefined || event.body === null) {
        return {
            statusCode: 400,
            body: 'Error'
        }
    }
    let { obj } = JSON.parse(event.body);
    console.log(obj);
    let uuid = v4();
    console.log(uuid);

    const command = new PutItemCommand({
        TableName: process.env.tableName,
        Item: {
            id: {S: uuid},
            obj: obj
        }
    });
    await client.send(command);

    return {
        statusCode: 200,
        body: JSON.stringify({id: uuid})
    };
}