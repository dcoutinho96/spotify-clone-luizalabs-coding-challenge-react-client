import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    'node_modules/@dcoutinho96/spotify-clone-luizalabs-coding-challenge-graphql-schema/dist/schema/base.graphql',
  ],
  documents: [
    'node_modules/@dcoutinho96/spotify-clone-luizalabs-coding-challenge-graphql-schema/dist/operations/**/*.graphql',
    'node_modules/@dcoutinho96/spotify-clone-luizalabs-coding-challenge-graphql-schema/dist/mutations/**/*.graphql',
  ],
  generates: {
    'src/gql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        fetcher: './fetcher#fetcher',
        reactQueryVersion: 5
      },
    },
  },
};

export default config;
