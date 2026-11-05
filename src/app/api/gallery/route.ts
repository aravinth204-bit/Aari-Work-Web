import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { galleryImages } from "@/db/schema";
import { gallery } from "@/lib/site";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getLocalGallery,
  saveLocalGalleryItem,
  updateLocalGalleryItem,
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
  if (isDbConfigured) {
    try {
      const dbRows = await db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
      const formattedDbItems = dbRows.map((r) => ({
        id: `db-${r.id}`,
        src: r.imageUrl,
        cat: r.category,
        title: r.title,
        desc: r.description || "",
        price: r.price || "",
        tags: r.tags || "",
      }));
      return NextResponse.json({ items: [...formattedDbItems, ...gallery] });
    } catch (err) {
      console.warn("Gallery GET database offline, falling back to local storage:", err);
      // Fallback to local storage gracefully so app never breaks
    }
  }

  const localItems = getLocalGallery();
  return NextResponse.json({ items: [...localItems, ...gallery] });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { title, category, imageUrl, description, price, tags } = body;

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

    // Try saving to Database if configured
    if (isDbConfigured) {
      try {
        const [row] = await db
          .insert(galleryImages)
          .values({
            title: String(title).slice(0, 200),
            category: String(category || "Bridal").slice(0, 80),
            imageUrl: safeImageUrl,
            description: description ? String(description).slice(0, 1000) : null,
            price: price ? String(price).slice(0, 60) : null,
            tags: tags ? String(tags).slice(0, 255) : null,
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
            price: row.price || "",
            tags: row.tags || "",
          },
        });
      } catch (dbErr) {
        console.warn("DB insert failed, saving to local gallery storage instead:", dbErr);
        // Fallback to local storage below so client never gets an error
      }
    }

    // Local file fallback
    const saved = saveLocalGalleryItem({
      src: safeImageUrl,
      cat: String(category || "Bridal").slice(0, 80),
      title: String(title).slice(0, 200),
      desc: description ? String(description).slice(0, 1000) : "",
      price: price ? String(price).slice(0, 60) : "",
      tags: tags ? String(tags).slice(0, 255) : "",
    });

    return NextResponse.json({ ok: true, item: saved });
  } catch (err) {
    console.error("Gallery POST error", err);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}

// PATCH - Update existing gallery image title, category, description, price, tags
export async function PATCH(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { id, title, category, description, price, tags } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing image id" }, { status: 400 });
    }

    if (id.startsWith("db-") && isDbConfigured) {
      try {
        const dbId = Number(id.replace("db-", ""));
        if (Number.isSafeInteger(dbId) && dbId > 0) {
          const updates: Record<string, any> = {};
          if (title !== undefined) updates.title = String(title).slice(0, 200);
          if (category !== undefined) updates.category = String(category).slice(0, 80);
          if (description !== undefined) updates.description = String(description).slice(0, 1000);
          if (price !== undefined) updates.price = String(price).slice(0, 60);
          if (tags !== undefined) updates.tags = String(tags).slice(0, 255);

          const [updatedRow] = await db
            .update(galleryImages)
            .set(updates)
            .where(eq(galleryImages.id, dbId))
            .returning();

          if (updatedRow) {
            return NextResponse.json({
              ok: true,
              item: {
                id: `db-${updatedRow.id}`,
                title: updatedRow.title,
                cat: updatedRow.category,
                src: updatedRow.imageUrl,
                desc: updatedRow.description || "",
                price: updatedRow.price || "",
                tags: updatedRow.tags || "",
              },
            });
          }
        }
      } catch (err) {
        console.warn("DB update failed, attempting local fallback:", err);
      }
    }

    // Local storage fallback
    const ok = updateLocalGalleryItem(id, {
      ...(title !== undefined && { title: String(title).slice(0, 200) }),
      ...(category !== undefined && { cat: String(category).slice(0, 80) }),
      ...(description !== undefined && { desc: String(description).slice(0, 1000) }),
      ...(price !== undefined && { price: String(price).slice(0, 60) }),
      ...(tags !== undefined && { tags: String(tags).slice(0, 255) }),
    });

    if (!ok) {
      return NextResponse.json({ error: "Gallery item not found or could not be updated" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Gallery PATCH error", err);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
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
      try {
        const dbId = Number(id.replace("db-", ""));
        if (Number.isSafeInteger(dbId) && dbId > 0) {
          const [image] = await db
            .select({ imageUrl: galleryImages.imageUrl })
            .from(galleryImages)
            .where(eq(galleryImages.id, dbId))
            .limit(1);

          if (image) {
            await deleteStoredCloudinaryImage(image.imageUrl);
            await db.delete(galleryImages).where(eq(galleryImages.id, dbId));
            return NextResponse.json({ ok: true });
          }
        }
      } catch (err) {
        console.warn("DB delete failed, trying local delete:", err);
      }
    }

    const localImage = getLocalGallery().find((item) => item.id === id);
    if (localImage) {
      await deleteStoredCloudinaryImage(localImage.src);
      deleteLocalGalleryItem(id);
      return NextResponse.json({ ok: true });
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
    if (!config) return null;
    await deleteCloudinaryImage(imageUrl, config);
    return null;
  } catch (error) {
    console.error("Cloudinary image deletion error:", error);
    return null;
  }
}
