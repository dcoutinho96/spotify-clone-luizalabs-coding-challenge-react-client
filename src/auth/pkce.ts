export const generateRandomString = (length = 64) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(array, x => chars[x % chars.length]).join("");
};

const sha256 = async (plain: string) => {
  const data = new TextEncoder().encode(plain);
  return await crypto.subtle.digest("SHA-256", data);
};

const base64url = (arrayBuffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

export const createCodeVerifierAndChallenge = async () => {
  const verifier = generateRandomString(64);
  const digest = await sha256(verifier);
  const challenge = base64url(digest);
  return { verifier, challenge };
};