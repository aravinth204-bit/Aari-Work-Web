import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { galleryImages } from "@/db/schema";
import { gallery } from "@/lib/site";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function allowedImageHosts(): Set<string> {
  const fromEnv = (process.env.GALLERY_IMAGE_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return new Set(["images.unsplash.com", ...fromEnv]);
}

/**
 * The gallery API only accepts paths inside `/images/` (served by this site) or
 * https URLs on an allowlisted host. Anything else would fail inside
 * `next/image` or let visitors inject arbitrary remote images.
 */
function normalizeImageUrl(raw: string): string | null {
  const value = raw.trim();

  if (value.length === 0 || value.length > 2048) return null;

  if (value.startsWith("/")) {
    const isLocal = value.startsWith("/images/") && !value.includes("..") && !value.includes("//");
    return isLocal ? value : null;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (!allowedImageHosts().has(url.hostname.toLowerCase())) return null;

  return url.toString();
}

export async function GET() {
  try {
    if (!isDbConfigured) {
      return NextResponse.json({ items: gallery });
    }

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
    console.error("Gallery GET error", err);
  }

  return NextResponse.json({ items: gallery });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  if (!isDbConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { title, category, imageUrl, description } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 });
    }

    const safeImageUrl = normalizeImageUrl(String(imageUrl));

    if (!safeImageUrl) {
      return NextResponse.json(
        {
          error:
            "Image URL must be a /images/ path on this site or an https URL on an allowed host.",
        },
        { status: 400 },
      );
    }

    const [row] = await db
      .insert(galleryImages)
      .values({
        title: String(title).slice(0, 200),
        category: String(category || "Bridal").slice(0, 80),
        imageUrl: safeImageUrl,
        description: description ? String(description).slice(0, 1000) : null,
      })
      .returning();

    return NextResponse.json({ ok: true, item: row });
  } catch (err) {
    console.error("Gallery POST error", err);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
