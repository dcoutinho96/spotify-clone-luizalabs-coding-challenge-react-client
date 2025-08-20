import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL || 'http://localhost:4000/',
  documents: [
    'node_modules/@dcoutinho96/spotify-clone-luizalabs-coding-challenge-graphql-schema/operations/**/*.graphql',
  ],
  generates: {
    'src/gql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-query'],
      config: {
        fetcher: 'fetch',           
        reactQueryVersion: 5,    
        legacyMode: false,           
        useTypeImports: true        
      },
    },
  },
};

export default config;
