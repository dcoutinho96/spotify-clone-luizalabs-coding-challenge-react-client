import { http, HttpResponse } from "msw";


export const handlers = [
  http.post("http://test-api/graphql", async ({ request }) => {
    const { query } = (await request.json()) as { query?: string };
    if (query?.includes("hello")) {
      return HttpResponse.json({ data: { hello: "Hello from mock" } });
    }
    return HttpResponse.json({ data: {} });
  }),
];