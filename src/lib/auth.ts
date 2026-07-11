// Shared server-side auth helper for protected API routes.
// Accepts either x-author-pin header (legacy) or nos-author-session cookie (new).
export function isAuthorized(request: Request): boolean {
  const expected = process.env.AUTHOR_PIN || "9187";
  const headerPin = request.headers.get("x-author-pin");
  if (headerPin && headerPin === expected) return true;
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").some(c => c.trim() === "nos-author-session=1");
}
