/**
 * Generates a current ISO 8601 formatted timestamp
 * @returns {string} The current time in ISO 8601 format (e.g., "2023-01-01T00:00:00.000Z")
 */
export function nowIsoTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Generates a version 4 UUID (Universally Unique Identifier)
 * Uses the Web Crypto API when available, falls back to a pseudo-random implementation
 * @returns {string} A v4 UUID (e.g., '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (e.g., older React Native, Bun < 1.0.0)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
