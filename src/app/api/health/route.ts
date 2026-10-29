import { db, isDbConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDbConfigured) {
    return Response.json({ ok: false, reason: "DATABASE_URL is not set" }, { status: 503 });
  }

  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, reason: "Database unreachable" }, { status: 500 });
  }
}
