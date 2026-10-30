import fs from "fs";
import path from "path";

export interface StoredEnquiry {
  id: number;
  name: string;
  mobile: string;
  workType: string;
  functionDate: string | null;
  budget: string | null;
  city: string | null;
  message: string | null;
  adminNotes?: string | null;
  status: string;
  createdAt: string;
}

export interface StoredGalleryItem {
  id: string;
  src: string;
  cat: string;
  title: string;
  desc?: string;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), ".data");
const storageFile = path.join(dataDir, "enquiries.json");
const galleryFile = path.join(dataDir, "gallery.json");

function ensureStorage(): StoredEnquiry[] {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(storageFile)) {
      const initial: StoredEnquiry[] = [
        {
          id: 1,
          name: "பிரியா (Priya M)",
          mobile: "+91 98765 43210",
          workType: "Bridal Aari Blouse",
          functionDate: "2026-11-25",
          budget: "₹3,000 – ₹6,000",
          city: "Gobichettipalayam",
          message: "Peacock motif with antique gold beads and kundan stones on elbow sleeves.",
          adminNotes: "Advance ₹2,000 paid. Blouse fabric received. Needs emerald green kundan stones.",
          status: "in_progress",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 2,
          name: "திவ்யா (Divya Ramesh)",
          mobile: "+91 94432 12345",
          workType: "Maggam Work Saree",
          functionDate: "2026-12-10",
          budget: "₹6,000+",
          city: "Erode",
          message: "Full bridal blouse and saree border matching work. Need trial 10 days before.",
          adminNotes: "Measurements taken on WhatsApp video call. Saree courier expected on Monday.",
          status: "contacted",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ];
      fs.writeFileSync(storageFile, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const data = fs.readFileSync(storageFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Local storage read error:", err);
    return [];
  }
}

export function getLocalEnquiries(): StoredEnquiry[] {
  return ensureStorage();
}

export function saveLocalEnquiry(enquiry: Omit<StoredEnquiry, "id" | "status" | "createdAt">): StoredEnquiry {
  const all = ensureStorage();
  const nextId = all.length > 0 ? Math.max(...all.map((e) => e.id)) + 1 : 1;
  const newRecord: StoredEnquiry = {
    ...enquiry,
    id: nextId,
    status: "new",
    adminNotes: null,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newRecord);
  try {
    fs.writeFileSync(storageFile, JSON.stringify(all, null, 2), "utf8");
  } catch (err) {
    console.error("Local storage write error:", err);
  }
  return newRecord;
}

export function updateLocalEnquiry(
  id: number,
  updates: { status?: string; adminNotes?: string }
): boolean {
  const all = ensureStorage();
  const target = all.find((e) => e.id === id);
  if (!target) return false;

  if (updates.status !== undefined) target.status = updates.status;
  if (updates.adminNotes !== undefined) target.adminNotes = updates.adminNotes;

  try {
    fs.writeFileSync(storageFile, JSON.stringify(all, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Local storage update error:", err);
    return false;
  }
}

// --- Local Gallery Storage ---
export function getLocalGallery(): StoredGalleryItem[] {
  try {
    if (!fs.existsSync(galleryFile)) {
      return [];
    }
    const data = fs.readFileSync(galleryFile, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLocalGalleryItem(item: {
  src: string;
  cat: string;
  title: string;
  desc?: string;
}): StoredGalleryItem {
  const all = getLocalGallery();
  const newItem: StoredGalleryItem = {
    ...item,
    id: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newItem);
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(galleryFile, JSON.stringify(all, null, 2), "utf8");
  } catch (err) {
    console.error("Gallery save error:", err);
  }
  return newItem;
}

export function deleteLocalGalleryItem(id: string): boolean {
  const all = getLocalGallery();
  const filtered = all.filter((item) => item.id !== id);
  try {
    fs.writeFileSync(galleryFile, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Gallery delete error:", err);
    return false;
  }
}
