import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getCloudinaryConfig, signCloudinaryParams } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const config = getCloudinaryConfig();
    if (!config) {
      return NextResponse.json(
        {
          error:
            "Image storage is not configured. Set the Cloudinary environment variables on the server.",
        },
        { status: 503 },
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = "aari-gallery";
    const signature = signCloudinaryParams(
      { folder, timestamp },
      config.apiSecret,
    );

    return NextResponse.json({
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      timestamp,
      folder,
      signature,
    });
  } catch (error) {
    console.error("Cloudinary signing configuration error:", error);
    return NextResponse.json(
      { error: "Cloudinary configuration is incomplete." },
      { status: 503 },
    );
  }
}
