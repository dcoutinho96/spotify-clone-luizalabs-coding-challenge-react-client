import "@testing-library/jest-dom";
import "whatwg-fetch";

import { server } from "./test-server";
import { afterAll, afterEach, beforeAll } from "vitest";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
