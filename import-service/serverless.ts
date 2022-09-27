import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import { importProductsFile, importFileParser } from '@functions/index';

dotenv.config();

const s3BucketName = process.env.S3_BUCKET_UPLOADS;

const serverlessConfiguration: AWS = {
  service: 'imports',
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
        Action: 's3:ListBucket',
        Resource: [`arn:aws:s3:::${s3BucketName}`],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [`arn:aws:s3:::${s3BucketName}/*`],
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      S3_BUCKET_UPLOADS: process.env.S3_BUCKET_UPLOADS,
    },
  },
  // import the function via paths
  functions: { importFileParser, importProductsFile },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    s3BucketName,
  },
  resources: {
    Resources: {
      S3BucketUpload: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: s3BucketName,
          AccessControl: 'PublicRead',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['PUT', 'POST'],
                AllowedOrigins: ['*'],
              },
            ],
          },
        },
      },
      S3BucketUploadPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: {
            Ref: 'S3BucketUpload',
          },
          PolicyDocument: {
            Statement: [
              {
                Sid: 'AllowListBucket',
                Effect: 'Allow',
                Principal: {
                  AWS: '*',
                },
                Action: 's3:ListBucket',
                Resource: `arn:aws:s3:::${s3BucketName}`,
              },
              {
                Sid: 'AllowGetPutCopyDeleteObject',
                Effect: 'Allow',
                Principal: {
                  AWS: '*',
                },
                Action: [
                  's3:GetObject',
                  's3:GetObjectAcl',
                  's3:PutObject',
                  's3:PutObjectAcl',
                  's3:DeleteObject',
                ],
                Resource: `arn:aws:s3:::${s3BucketName}/*`,
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
