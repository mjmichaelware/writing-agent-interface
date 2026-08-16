import { isAuthorized } from "@/lib/auth";

// GET — returns 200 if the session cookie is valid, 401 otherwise.
// Used by AuthorGateway to validate a localStorage-restored session without re-entering the PIN.
export async function GET(request: Request) {
  if (isAuthorized(request)) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { "Content-Type": "application/json" } });
}
