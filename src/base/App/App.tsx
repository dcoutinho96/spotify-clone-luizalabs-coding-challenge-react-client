import { BrowserRouter } from "react-router";
import { Layout } from "../Layout";
import { AuthProvider } from "~/shared";
import { ErrorBoundary } from "../ErrorBoundary";

export function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
