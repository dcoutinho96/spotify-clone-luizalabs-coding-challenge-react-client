import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    'node_modules/@dcoutinho96/spotify-clone-luizalabs-coding-challenge-graphql-schema/dist/schema/**/*.graphql',
  ],
  documents: [
    'node_modules/@dcoutinho96/spotify-clone-luizalabs-coding-challenge-graphql-schema/dist/operations/**/*.graphql',
  ],
  ignoreNoDocuments: true,
  generates: {
    'src/gql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        fetcher: {
          func: '~/gql#fetcher',
          isReactHook: false,
        },
        reactQueryVersion: 5,
        legacyMode: false,
      },
    },
  },
};

export default config;
