import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';

export class AwsBasicStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'BasicTable', {
      tableName: 'basic-db',
      partitionKey: {
        name: id,
        type: AttributeType.STRING
      }
    });

    const postLmb = new NodejsFunction(this, 'PostLambda', {
      functionName: 'basic-post',
      entry: path.join(__dirname, '/../src/post/index.ts')
    });
    
    table.grantWriteData(postLmb);

    const rest = new RestApi(this, 'BasicRest', {
      restApiName: 'basic-gateway'
    });
    const resource = rest.root.addResource('basic')
    resource.addMethod("post", new LambdaIntegration(postLmb));
  }
}
