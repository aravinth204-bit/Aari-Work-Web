import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are supported." },
        { status: 400 }
      );
    }

    // Max 10MB file limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size exceeds 10MB limit." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate safe clean filename with timestamp
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const fileName = `${cleanBaseName}_${Date.now()}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      ok: true,
      imageUrl: publicUrl,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}

