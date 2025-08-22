import * as Auth from "./index";

describe("buildRedirectURL", () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("builds URL without port", () => {
    Object.defineProperty(window, "location", {
      value: { protocol: "http:", hostname: "localhost", port: "" } as Location,
      writable: true,
    });
    expect(Auth.buildRedirectURL()).toBe("http://localhost/login");
  });

  it("builds URL with port", () => {
    Object.defineProperty(window, "location", {
      value: { protocol: "https:", hostname: "127.0.0.1", port: "5173" } as Location,
      writable: true,
    });
    expect(Auth.buildRedirectURL()).toBe("https://127.0.0.1:5173/login");
  });
});
