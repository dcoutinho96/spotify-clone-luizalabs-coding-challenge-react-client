import { useHelloQuery } from "~/gql";
import { Text, Container, } from "~/shared";

export function DashboardPage(){
    const { data } = useHelloQuery();
    console.log(data);
    return (
        <Container className="min-h-screen grid place-items-center px-4">
            <Text as="h1" className="text-sm font-medium leading-6">
                PROTECTED
            </Text>
        </Container>
    );
}
