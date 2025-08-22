import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { fetcher } from './fetcher';
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

export type Album = {
  __typename?: 'Album';
  id: Scalars['ID']['output'];
  images: Array<Image>;
  name: Scalars['String']['output'];
  releaseDate?: Maybe<Scalars['String']['output']>;
  totalTracks?: Maybe<Scalars['Int']['output']>;
};

export type AlbumConnection = {
  __typename?: 'AlbumConnection';
  edges: Array<AlbumEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type AlbumEdge = {
  __typename?: 'AlbumEdge';
  cursor: Scalars['String']['output'];
  node: Album;
};

export type Artist = {
  __typename?: 'Artist';
  albums: AlbumConnection;
  genres: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images: Array<Image>;
  name: Scalars['String']['output'];
  popularity?: Maybe<Scalars['Int']['output']>;
};


export type ArtistAlbumsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ArtistConnection = {
  __typename?: 'ArtistConnection';
  edges: Array<ArtistEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type ArtistEdge = {
  __typename?: 'ArtistEdge';
  cursor: Scalars['String']['output'];
  node: Artist;
};

export type Image = {
  __typename?: 'Image';
  height?: Maybe<Scalars['Int']['output']>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPlaylist: Playlist;
};


export type MutationCreatePlaylistArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  public?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Playlist = {
  __typename?: 'Playlist';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images: Array<Image>;
  name: Scalars['String']['output'];
  owner: User;
  public?: Maybe<Scalars['Boolean']['output']>;
  tracks: TrackConnection;
};


export type PlaylistTracksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PlaylistConnection = {
  __typename?: 'PlaylistConnection';
  edges: Array<PlaylistEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type PlaylistEdge = {
  __typename?: 'PlaylistEdge';
  cursor: Scalars['String']['output'];
  node: Playlist;
};

export type Query = {
  __typename?: 'Query';
  artistAlbums: AlbumConnection;
  artistById?: Maybe<Artist>;
  me: User;
  myPlaylists: PlaylistConnection;
  myTopArtists: ArtistConnection;
  playlistById?: Maybe<Playlist>;
};


export type QueryArtistAlbumsArgs = {
  artistId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryArtistByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyPlaylistsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyTopArtistsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPlaylistByIdArgs = {
  id: Scalars['ID']['input'];
};

export type Track = {
  __typename?: 'Track';
  album: Album;
  artists: Array<Artist>;
  durationMs: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  previewUrl?: Maybe<Scalars['String']['output']>;
};

export type TrackConnection = {
  __typename?: 'TrackConnection';
  edges: Array<TrackEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type TrackEdge = {
  __typename?: 'TrackEdge';
  cursor: Scalars['String']['output'];
  node: Track;
};

export type User = {
  __typename?: 'User';
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  images: Array<Image>;
};

export type CreatePlaylistMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  public?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreatePlaylistMutation = { __typename?: 'Mutation', createPlaylist: { __typename?: 'Playlist', id: string, name: string, description?: string | null, public?: boolean | null, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }>, owner: { __typename?: 'User', id: string, displayName: string, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }> }, tracks: { __typename?: 'TrackConnection', totalCount?: number | null, edges: Array<{ __typename?: 'TrackEdge', cursor: string, node: { __typename?: 'Track', id: string, name: string, durationMs: number, previewUrl?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, displayName: string, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }> } };

export type MyTopArtistsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyTopArtistsQuery = { __typename?: 'Query', myTopArtists: { __typename?: 'ArtistConnection', totalCount?: number | null, edges: Array<{ __typename?: 'ArtistEdge', cursor: string, node: { __typename?: 'Artist', id: string, name: string, genres: Array<string>, popularity?: number | null, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type ArtistByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ArtistByIdQuery = { __typename?: 'Query', artistById?: { __typename?: 'Artist', id: string, name: string, genres: Array<string>, popularity?: number | null, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }>, albums: { __typename?: 'AlbumConnection', totalCount?: number | null, edges: Array<{ __typename?: 'AlbumEdge', cursor: string, node: { __typename?: 'Album', id: string, name: string, releaseDate?: string | null, totalTracks?: number | null, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } | null };

export type ArtistAlbumsQueryVariables = Exact<{
  artistId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ArtistAlbumsQuery = { __typename?: 'Query', artistAlbums: { __typename?: 'AlbumConnection', totalCount?: number | null, edges: Array<{ __typename?: 'AlbumEdge', cursor: string, node: { __typename?: 'Album', id: string, name: string, releaseDate?: string | null, totalTracks?: number | null, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type MyPlaylistsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyPlaylistsQuery = { __typename?: 'Query', myPlaylists: { __typename?: 'PlaylistConnection', totalCount?: number | null, edges: Array<{ __typename?: 'PlaylistEdge', cursor: string, node: { __typename?: 'Playlist', id: string, name: string, description?: string | null, public?: boolean | null, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }>, owner: { __typename?: 'User', id: string, displayName: string } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type PlaylistByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PlaylistByIdQuery = { __typename?: 'Query', playlistById?: { __typename?: 'Playlist', id: string, name: string, description?: string | null, public?: boolean | null, images: Array<{ __typename?: 'Image', url: string, height?: number | null, width?: number | null }>, owner: { __typename?: 'User', id: string, displayName: string }, tracks: { __typename?: 'TrackConnection', totalCount?: number | null, edges: Array<{ __typename?: 'TrackEdge', cursor: string, node: { __typename?: 'Track', id: string, name: string, durationMs: number, previewUrl?: string | null } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } } | null };



export const CreatePlaylistDocument = `
    mutation CreatePlaylist($name: String!, $description: String, $public: Boolean) {
  createPlaylist(name: $name, description: $description, public: $public) {
    id
    name
    description
    public
    images {
      url
      height
      width
    }
    owner {
      id
      displayName
      images {
        url
        height
        width
      }
    }
    tracks(limit: 10, offset: 0) {
      edges {
        cursor
        node {
          id
          name
          durationMs
          previewUrl
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
}
    `;

export const useCreatePlaylistMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePlaylistMutation, TError, CreatePlaylistMutationVariables, TContext>) => {
    
    return useMutation<CreatePlaylistMutation, TError, CreatePlaylistMutationVariables, TContext>(
      {
    mutationKey: ['CreatePlaylist'],
    mutationFn: (variables?: CreatePlaylistMutationVariables) => fetcher<CreatePlaylistMutation, CreatePlaylistMutationVariables>(CreatePlaylistDocument, variables)(),
    ...options
  }
    )};

export const MeDocument = `
    query Me {
  me {
    id
    displayName
    images {
      url
      height
      width
    }
  }
}
    `;

export const useMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      variables?: MeQueryVariables,
      options?: Omit<UseQueryOptions<MeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Me'] : ['Me', variables],
    queryFn: fetcher<MeQuery, MeQueryVariables>(MeDocument, variables),
    ...options
  }
    )};

export const MyTopArtistsDocument = `
    query MyTopArtists($limit: Int, $offset: Int) {
  myTopArtists(limit: $limit, offset: $offset) {
    edges {
      cursor
      node {
        id
        name
        genres
        popularity
        images {
          url
          height
          width
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
    `;

export const useMyTopArtistsQuery = <
      TData = MyTopArtistsQuery,
      TError = unknown
    >(
      variables?: MyTopArtistsQueryVariables,
      options?: Omit<UseQueryOptions<MyTopArtistsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MyTopArtistsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MyTopArtistsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['MyTopArtists'] : ['MyTopArtists', variables],
    queryFn: fetcher<MyTopArtistsQuery, MyTopArtistsQueryVariables>(MyTopArtistsDocument, variables),
    ...options
  }
    )};

export const ArtistByIdDocument = `
    query ArtistById($id: ID!) {
  artistById(id: $id) {
    id
    name
    genres
    popularity
    images {
      url
      height
      width
    }
    albums(limit: 10, offset: 0) {
      edges {
        cursor
        node {
          id
          name
          releaseDate
          totalTracks
          images {
            url
            height
            width
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
}
    `;

export const useArtistByIdQuery = <
      TData = ArtistByIdQuery,
      TError = unknown
    >(
      variables: ArtistByIdQueryVariables,
      options?: Omit<UseQueryOptions<ArtistByIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ArtistByIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ArtistByIdQuery, TError, TData>(
      {
    queryKey: ['ArtistById', variables],
    queryFn: fetcher<ArtistByIdQuery, ArtistByIdQueryVariables>(ArtistByIdDocument, variables),
    ...options
  }
    )};

export const ArtistAlbumsDocument = `
    query ArtistAlbums($artistId: ID!, $limit: Int, $offset: Int) {
  artistAlbums(artistId: $artistId, limit: $limit, offset: $offset) {
    edges {
      cursor
      node {
        id
        name
        releaseDate
        totalTracks
        images {
          url
          height
          width
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
    `;

export const useArtistAlbumsQuery = <
      TData = ArtistAlbumsQuery,
      TError = unknown
    >(
      variables: ArtistAlbumsQueryVariables,
      options?: Omit<UseQueryOptions<ArtistAlbumsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ArtistAlbumsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ArtistAlbumsQuery, TError, TData>(
      {
    queryKey: ['ArtistAlbums', variables],
    queryFn: fetcher<ArtistAlbumsQuery, ArtistAlbumsQueryVariables>(ArtistAlbumsDocument, variables),
    ...options
  }
    )};

export const MyPlaylistsDocument = `
    query MyPlaylists($limit: Int, $offset: Int) {
  myPlaylists(limit: $limit, offset: $offset) {
    edges {
      cursor
      node {
        id
        name
        description
        public
        images {
          url
          height
          width
        }
        owner {
          id
          displayName
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
    `;

export const useMyPlaylistsQuery = <
      TData = MyPlaylistsQuery,
      TError = unknown
    >(
      variables?: MyPlaylistsQueryVariables,
      options?: Omit<UseQueryOptions<MyPlaylistsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MyPlaylistsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MyPlaylistsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['MyPlaylists'] : ['MyPlaylists', variables],
    queryFn: fetcher<MyPlaylistsQuery, MyPlaylistsQueryVariables>(MyPlaylistsDocument, variables),
    ...options
  }
    )};

export const PlaylistByIdDocument = `
    query PlaylistById($id: ID!) {
  playlistById(id: $id) {
    id
    name
    description
    public
    images {
      url
      height
      width
    }
    owner {
      id
      displayName
    }
    tracks(limit: 10, offset: 0) {
      edges {
        cursor
        node {
          id
          name
          durationMs
          previewUrl
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
}
    `;

export const usePlaylistByIdQuery = <
      TData = PlaylistByIdQuery,
      TError = unknown
    >(
      variables: PlaylistByIdQueryVariables,
      options?: Omit<UseQueryOptions<PlaylistByIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<PlaylistByIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<PlaylistByIdQuery, TError, TData>(
      {
    queryKey: ['PlaylistById', variables],
    queryFn: fetcher<PlaylistByIdQuery, PlaylistByIdQueryVariables>(PlaylistByIdDocument, variables),
    ...options
  }
    )};
