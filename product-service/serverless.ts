import * as dotenv from 'dotenv';
import type { AWS } from '@serverless/typescript';
import {
  getProductList,
  getProductById,
  createProduct,
  catalogBatchProcess,
} from '@functions/index';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'products',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'CreateProductTopic',
        },
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME,
      STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME,
      SNS_CREATE_PRODUCT_SUBSCRIPTION_ENDPOINT:
        process.env.SNS_CREATE_PRODUCT_SUBSCRIPTION_ENDPOINT,
      SNS_CREATE_PRODUCT_TOPIC_ARN: {
        Ref: 'CreateProductTopic',
      },
    },
    httpApi: {
      cors: true,
    },
  },
  functions: {
    getProductList,
    getProductById,
    createProduct,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue',
        },
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'create-product-topic',
        },
      },
      CreateProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: `${process.env.SNS_CREATE_PRODUCT_SUBSCRIPTION_ENDPOINT}`,
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductTopic',
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
