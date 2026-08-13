import { NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const mobile = String(body.mobile ?? "").trim();
    const workType = String(body.workType ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!/^[0-9+\s-]{10,15}$/.test(mobile)) {
      return NextResponse.json({ error: "Please enter a valid mobile number." }, { status: 400 });
    }
    if (!workType) {
      return NextResponse.json({ error: "Please select a work type." }, { status: 400 });
    }

    const [row] = await db
      .insert(enquiries)
      .values({
        name,
        mobile,
        workType,
        functionDate: body.functionDate ? String(body.functionDate).slice(0, 40) : null,
        budget: body.budget ? String(body.budget).slice(0, 60) : null,
        city: body.city ? String(body.city).slice(0, 120) : null,
        message: body.message ? String(body.message).slice(0, 2000) : null,
      })
      .returning();

    return NextResponse.json({ ok: true, id: row.id });
  } catch (error) {
    console.error("enquiry error", error);
    return NextResponse.json({ error: "Something went wrong. Please try WhatsApp." }, { status: 500 });
  }
}

export async function GET() {
  const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(50);
  return NextResponse.json({ count: rows.length, enquiries: rows });
}
