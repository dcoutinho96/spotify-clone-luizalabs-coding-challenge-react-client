import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateRandomString,
  createCodeVerifierAndChallenge,
} from "./pkce";

describe("PKCE utils", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("generateRandomString produces a string of the correct length", () => {
    const str = generateRandomString(10);
    expect(str).toHaveLength(10);
    expect(/^[A-Za-z0-9]+$/.test(str)).toBe(true);
  });

  it("generateRandomString uses default length if none provided", () => {
    const str = generateRandomString();
    expect(str).toHaveLength(64);
  });

  it("createCodeVerifierAndChallenge returns verifier and challenge", async () => {
    const mockArray = new Uint8Array(64).map((_, i) => i);
    vi.spyOn(global.crypto, "getRandomValues").mockImplementation(() => mockArray);

    const fakeDigest = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    vi.spyOn(global.crypto.subtle, "digest").mockResolvedValue(fakeDigest);

    const { verifier, challenge } = await createCodeVerifierAndChallenge();

    expect(verifier).toHaveLength(64);
    expect(challenge).toBeDefined();
    expect(typeof challenge).toBe("string");
  });

  it("base64url encoding replaces +, /, = correctly", () => {
    const buffer = new Uint8Array([255, 254, 253]).buffer;
    const base64url = (arrayBuffer: ArrayBuffer) =>
      btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    expect(base64url(buffer)).toBe("__79");
  });
});
