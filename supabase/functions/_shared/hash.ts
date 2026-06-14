export async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function assertSafeObjectPath(path: string) {
  if (!path || path.startsWith("/") || path.includes("..") || path.includes("//")) {
    throw new Error("Unsafe object path");
  }
}

export function assertAllowedBucket(bucket: string) {
  const allowed = new Set([
    "nos-raw-local-imports",
    "nos-drive-xml",
    "nos-drive-docx",
    "nos-manifests",
    "nos-derived",
    "nos-visual-assets",
  ]);

  if (!allowed.has(bucket)) {
    throw new Error(`Bucket not allowed: ${bucket}`);
  }
}
