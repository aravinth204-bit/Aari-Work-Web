import { createHash } from "node:crypto";

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  const configuredValues = [cloudName, apiKey, apiSecret];

  if (configuredValues.every((value) => !value)) return null;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary configuration is incomplete. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

export function signCloudinaryParams(
  params: Record<string, string>,
  apiSecret: string,
): string {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export function getCloudinaryPublicId(
  imageUrl: string,
  cloudName: string,
): string | null {
  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
    return null;
  }

  let segments: string[];
  try {
    segments = url.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment));
  } catch {
    return null;
  }
  if (
    segments[0] !== cloudName ||
    segments[1] !== "image" ||
    segments[2] !== "upload"
  ) {
    return null;
  }

  const assetSegments = segments.slice(3);
  if (assetSegments[0]?.match(/^v\d+$/)) assetSegments.shift();
  if (assetSegments.length === 0) return null;

  const lastSegment = assetSegments[assetSegments.length - 1];
  const extensionIndex = lastSegment.lastIndexOf(".");
  if (extensionIndex > 0) {
    assetSegments[assetSegments.length - 1] = lastSegment.slice(0, extensionIndex);
  }

  const publicId = assetSegments.join("/");
  return publicId || null;
}

export async function deleteCloudinaryImage(
  imageUrl: string,
  config: CloudinaryConfig,
): Promise<boolean> {
  const publicId = getCloudinaryPublicId(imageUrl, config.cloudName);
  if (!publicId) return false;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = {
    invalidate: "true",
    public_id: publicId,
    timestamp,
  };
  const signature = signCloudinaryParams(params, config.apiSecret);
  const formData = new URLSearchParams({
    ...params,
    api_key: config.apiKey,
    signature,
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/destroy`,
    { method: "POST", body: formData },
  );
  const result = (await response.json().catch(() => null)) as {
    result?: string;
    error?: { message?: string };
  } | null;

  if (
    !response.ok ||
    (result?.result !== "ok" && result?.result !== "not found")
  ) {
    throw new Error(
      result?.error?.message || "Cloudinary could not delete the image.",
    );
  }

  return true;
}
