import { useHelloQuery } from './gql/generated';

export default function App() {
  const endpoint = import.meta.env.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL!;
  console.log('endpoint:', endpoint);

  const { data, isLoading, error } = useHelloQuery({
    endpoint,
    fetchParams: {
      headers: {
        'content-type': 'application/json',
        'apollo-require-preflight': 'true',
      },
    },
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Oops: {(error as Error).message}</p>;

  return (
    <main className='bg-brand' style={{ padding: 24 }}>
      <p className='p-10'><strong>Message:</strong> {data?.hello}</p>
    </main>
  );
}
