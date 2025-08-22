import { useMeQuery } from "~/gql/generated";
import { Text, Container, LoadingSpinner } from "~/shared";

export function DashboardPage() {
  const { data, isLoading } = useMeQuery();

  if (isLoading) {
    return (
        <LoadingSpinner />
    );
  }

  return (
    <Container className="min-h-screen grid place-items-center px-4">
      <Text as="h1" className="text-sm font-medium leading-6">
        Hello, {data?.me.displayName ?? "Unknown User"}
      </Text>
    </Container>
  );
}
