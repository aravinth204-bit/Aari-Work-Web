import { NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  getLocalEnquiries,
  saveLocalEnquiry,
  updateLocalEnquiry,
} from "@/lib/local-storage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "client-default";

  const rateCheck = checkRateLimit(clientIp, 5, 10 * 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        error: `Too many enquiries. Please wait ${Math.ceil(
          rateCheck.resetInSec / 60
        )} minutes or contact us directly on WhatsApp.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    if (body.website_url_check) {
      console.warn("Spam bot trapped via honeypot field:", clientIp);
      return NextResponse.json({ ok: true, id: 0 });
    }

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

    const payload = {
      name,
      mobile,
      workType,
      functionDate: body.functionDate ? String(body.functionDate).slice(0, 40) : null,
      budget: body.budget ? String(body.budget).slice(0, 60) : null,
      city: body.city ? String(body.city).slice(0, 120) : null,
      message: body.message ? String(body.message).slice(0, 2000) : null,
    };

    try {
      const [row] = await db.insert(enquiries).values(payload).returning();
      return NextResponse.json({ ok: true, id: row.id });
    } catch {
      const saved = saveLocalEnquiry(payload);
      return NextResponse.json({ ok: true, id: saved.id });
    }
  } catch (error) {
    console.error("enquiry submission error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try contacting via WhatsApp." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const rows = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(100);
    return NextResponse.json({ count: rows.length, enquiries: rows });
  } catch {
    const localRows = getLocalEnquiries();
    return NextResponse.json({
      count: localRows.length,
      enquiries: localRows,
    });
  }
}

// Update status or internal atelier notes
export async function PATCH(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = Number(body.id);
    const status = body.status !== undefined ? String(body.status).trim() : undefined;
    const adminNotes = body.adminNotes !== undefined ? String(body.adminNotes).trim() : undefined;

    if (!id) {
      return NextResponse.json({ error: "Missing record id." }, { status: 400 });
    }

    const updates: { status?: string; adminNotes?: string } = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    try {
      const [updated] = await db
        .update(enquiries)
        .set(updates)
        .where(eq(enquiries.id, id))
        .returning();
      return NextResponse.json({ ok: true, enquiry: updated });
    } catch {
      updateLocalEnquiry(id, updates);
      return NextResponse.json({ ok: true, id, ...updates });
    }
  } catch (error) {
    console.error("enquiry update error", error);
    return NextResponse.json({ error: "Could not update status." }, { status: 500 });
  }
}
