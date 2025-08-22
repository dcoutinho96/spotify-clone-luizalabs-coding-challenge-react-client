import { BrowserRouter } from "react-router";
import { Layout } from "../Layout";
import { AuthProvider } from "~/shared";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout/>
      </AuthProvider>
    </BrowserRouter>
  );
}
