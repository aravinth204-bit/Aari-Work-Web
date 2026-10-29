import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * Guards admin-only API routes with a bearer token.
 *
 * Returns a response when the request must be rejected, or `null` when the
 * caller may continue. The token is read from `ADMIN_TOKEN`; when it is not
 * configured the endpoint is disabled instead of being left open.
 */
export function requireAdmin(request: Request): NextResponse | null {
  const expected = process.env.ADMIN_TOKEN?.trim();

  if (!expected) {
    return NextResponse.json(
      { error: "Admin access is not configured on this server." },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}
