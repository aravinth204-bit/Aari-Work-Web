import { NextResponse } from "next/server";
import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { gallery } from "@/lib/site";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbRows = await db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
    if (dbRows && dbRows.length > 0) {
      const formattedDbItems = dbRows.map((r) => ({
        id: `db-${r.id}`,
        src: r.imageUrl,
        cat: r.category,
        title: r.title,
        desc: r.description || "",
      }));
      return NextResponse.json({ items: [...formattedDbItems, ...gallery] });
    }
  } catch (err) {
    // Fallback gracefully if database table is empty or offline
  }

  return NextResponse.json({ items: gallery });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, imageUrl, description } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 });
    }

    const [row] = await db
      .insert(galleryImages)
      .values({
        title: String(title).slice(0, 200),
        category: String(category || "Bridal").slice(0, 80),
        imageUrl: String(imageUrl),
        description: description ? String(description).slice(0, 1000) : null,
      })
      .returning();

    return NextResponse.json({ ok: true, item: row });
  } catch (err) {
    console.error("Gallery POST error", err);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
