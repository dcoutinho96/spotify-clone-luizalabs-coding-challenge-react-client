import "@testing-library/jest-dom";
import "whatwg-fetch";

import { server } from "./test-server";
import { afterAll, afterEach, beforeAll } from "vitest";

// Start/stop MSW around the test run
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
