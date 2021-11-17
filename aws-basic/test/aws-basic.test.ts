import { Capture, Match, Matcher, MatchResult, Template } from '@aws-cdk/assertions';
import { App } from '@aws-cdk/core';
import { AwsBasicStack } from '../lib/aws-basic-stack';

test('Snapshot', () => {
  // GIVEN
  const app = new App();
  // WHEN
  const stack = new AwsBasicStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

describe('Lambda Nodejs tests', () => {
  let app:any;
  let stack:any;
  let template:Template;

  beforeAll(() => {
    process.env = {
      tableName: 'basic-db',
      AWS_SAM_LOCAL: 'true'
    };
    // GIVEN
    app = new App();
    // WHEN
    stack = new AwsBasicStack(app, 'MyTestStack');
    // THEN
    template = Template.fromStack(stack);
  });

  test('Lambda Exists', () => {
    template.findResources('AWS::Lambda::Function');
  });

  test('DynamoDB Policy Permition', () => {

    template.findResources('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
            Action: ["dynamodb:BatchWriteItem", "dynamodb:PutItem",
              "dynamodb:UpdateItem", "dynamodb:DeleteItem"],
            Effect: 'Allow'
          }
        ]
      }
    });

    // template.hasResourceProperties('AWS::IAM::Policy', {
    //   PolicyDocument: {
    //     Statement: Match.arrayWith([{
    //       Action: ["dynamodb:BatchWriteItem",
    //       "dynamodb:PutItem",
    //       "dynamodb:UpdateItem",
    //       "dynamodb:DeleteItem",]
    //     }])
    //   }
    // })
  });
  
});
