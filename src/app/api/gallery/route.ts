import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { galleryImages } from "@/db/schema";
import { gallery } from "@/lib/site";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getLocalGallery,
  saveLocalGalleryItem,
  deleteLocalGalleryItem,
} from "@/lib/local-storage";
import { deleteCloudinaryImage, getCloudinaryConfig } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

function allowedImageHosts(): Set<string> {
  const fromEnv = (process.env.GALLERY_IMAGE_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  const cloudinaryHost = process.env.CLOUDINARY_CLOUD_NAME?.trim()
    ? ["res.cloudinary.com"]
    : [];

  return new Set(["images.unsplash.com", ...cloudinaryHost, ...fromEnv]);
}

function normalizeImageUrl(raw: string): string | null {
  const value = raw.trim();

  if (value.length === 0 || value.length > 2048) return null;

  if (value.startsWith("/")) {
    const isLocal =
      (value.startsWith("/images/") || value.startsWith("/uploads/")) &&
      !value.includes("..") &&
      !value.includes("//");
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
    if (isDbConfigured) {
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
    }
  } catch (err) {
    console.error("Gallery GET DB fallback:", err);
  }

  const localItems = getLocalGallery();
  return NextResponse.json({ items: [...localItems, ...gallery] });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { title, category, imageUrl, description } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image are required" }, { status: 400 });
    }

    const safeImageUrl = normalizeImageUrl(String(imageUrl));

    if (!safeImageUrl) {
      return NextResponse.json(
        {
          error:
            "Image must be an uploaded file, a /images/ path, or an allowed https host.",
        },
        { status: 400 },
      );
    }

    try {
      if (isDbConfigured) {
        const [row] = await db
          .insert(galleryImages)
          .values({
            title: String(title).slice(0, 200),
            category: String(category || "Bridal").slice(0, 80),
            imageUrl: safeImageUrl,
            description: description ? String(description).slice(0, 1000) : null,
          })
          .returning();

        return NextResponse.json({
          ok: true,
          item: {
            id: `db-${row.id}`,
            title: row.title,
            cat: row.category,
            src: row.imageUrl,
            desc: row.description || "",
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB insert failed, falling back to local gallery storage:", dbErr);
    }

    const saved = saveLocalGalleryItem({
      src: safeImageUrl,
      cat: String(category || "Bridal").slice(0, 80),
      title: String(title).slice(0, 200),
      desc: description ? String(description).slice(0, 1000) : "",
    });

    return NextResponse.json({ ok: true, item: saved });
  } catch (err) {
    console.error("Gallery POST error", err);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing image id" }, { status: 400 });
    }

    if (id.startsWith("db-") && isDbConfigured) {
      const dbId = Number(id.replace("db-", ""));
      if (!Number.isSafeInteger(dbId) || dbId <= 0) {
        return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
      }

      const [image] = await db
        .select({ imageUrl: galleryImages.imageUrl })
        .from(galleryImages)
        .where(eq(galleryImages.id, dbId))
        .limit(1);
      if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }

      const cloudDeleteError = await deleteStoredCloudinaryImage(image.imageUrl);
      if (cloudDeleteError) return cloudDeleteError;
      await db.delete(galleryImages).where(eq(galleryImages.id, dbId));
      return NextResponse.json({ ok: true });
    }

    const localImage = getLocalGallery().find((item) => item.id === id);
    if (!localImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const cloudDeleteError = await deleteStoredCloudinaryImage(localImage.src);
    if (cloudDeleteError) return cloudDeleteError;
    if (!deleteLocalGalleryItem(id)) {
      return NextResponse.json({ error: "Failed to remove image from gallery" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Gallery DELETE error", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

async function deleteStoredCloudinaryImage(
  imageUrl: string,
): Promise<NextResponse | null> {
  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return null;
  }

  if (url.hostname !== "res.cloudinary.com") return null;

  try {
    const config = getCloudinaryConfig();
    if (!config) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. The gallery item was kept." },
        { status: 503 },
      );
    }

    await deleteCloudinaryImage(imageUrl, config);
    return null;
  } catch (error) {
    console.error("Cloudinary image deletion error:", error);
    return NextResponse.json(
      {
        error:
          "Could not delete the cloud image. The gallery item was kept. Check Cloudinary configuration and try again.",
      },
      { status: 502 },
    );
  }
}
