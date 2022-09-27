import { middyfy } from '@libs/lambda';
import { importFileParserService } from 'src/services/import-file-parser';

const importFileParser = async (event) => {
  const { object: s3Object } = event.Records[0].s3;
  await importFileParserService(s3Object);
  return {
    statusCode: 202,
  };
};

export const main = middyfy(importFileParser);
