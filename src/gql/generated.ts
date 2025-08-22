import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetcher } from '~/gql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String']['output'];
};

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };



export const HelloDocument = `
    query Hello {
  hello
}
    `;

export const useHelloQuery = <
      TData = HelloQuery,
      TError = unknown
    >(
      variables?: HelloQueryVariables,
      options?: Omit<UseQueryOptions<HelloQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<HelloQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<HelloQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Hello'] : ['Hello', variables],
    queryFn: fetcher<HelloQuery, HelloQueryVariables>(HelloDocument, variables),
    ...options
  }
    )};
