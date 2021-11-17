# AWS-Basic

## Comandos para iniciar o projeto
* cdk init -l typescript
* npm install @aws-cdk/aws-lambda-nodejs @aws-cdk/aws-dynamodb @aws-cdk/aws-apigateway
* npm install --save-dev @aws-sdk/client-dynamodb @types/aws-lambda @aws-cdk/assertions

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
