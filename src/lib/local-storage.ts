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
  orderAmount?: number;
  advanceAmount?: number;
  deliveryDate?: string | null;
  orderSource?: string;
  measurements?: string | null;
  createdAt: string;
}

export interface StoredGalleryItem {
  id: string;
  src: string;
  cat: string;
  title: string;
  desc?: string;
  price?: string;
  tags?: string;
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
          deliveryDate: "2026-11-20",
          budget: "₹3,000 – ₹6,000",
          orderAmount: 5500,
          advanceAmount: 2000,
          city: "Gobichettipalayam",
          orderSource: "Website Form",
          measurements: "Front neck: 6.5\", Back neck: 8.5\", Sleeve length: 10.5\", Sleeve round: 11\", Chest: 36\", Waist: 30\"",
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
          deliveryDate: "2026-12-05",
          budget: "₹6,000+",
          orderAmount: 8500,
          advanceAmount: 3000,
          city: "Erode",
          orderSource: "WhatsApp",
          measurements: "Front neck: 7\", Back deep pot neck: 9.5\", Full sleeve zardosi",
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

export function saveLocalEnquiry(
  enquiry: Omit<StoredEnquiry, "id" | "status" | "createdAt">
): StoredEnquiry {
  const all = ensureStorage();
  const nextId = all.length > 0 ? Math.max(...all.map((e) => e.id)) + 1 : 1;
  const newRecord: StoredEnquiry = {
    ...enquiry,
    id: nextId,
    status: "new",
    adminNotes: null,
    orderAmount: enquiry.orderAmount || 0,
    advanceAmount: enquiry.advanceAmount || 0,
    deliveryDate: enquiry.deliveryDate || null,
    orderSource: enquiry.orderSource || "Website Form",
    measurements: enquiry.measurements || null,
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
  updates: Partial<StoredEnquiry>
): boolean {
  const all = ensureStorage();
  const target = all.find((e) => e.id === id);
  if (!target) return false;

  Object.assign(target, updates);

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
  price?: string;
  tags?: string;
}): StoredGalleryItem {
  const all = getLocalGallery();
  const newItem: StoredGalleryItem = {
    ...item,
    id: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newItem);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(galleryFile, JSON.stringify(all, null, 2), "utf8");
  return newItem;
}

export function updateLocalGalleryItem(
  id: string,
  updates: Partial<StoredGalleryItem>
): boolean {
  const all = getLocalGallery();
  const target = all.find((item) => item.id === id);
  if (!target) return false;

  Object.assign(target, updates);

  try {
    fs.writeFileSync(galleryFile, JSON.stringify(all, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Gallery update error:", err);
    return false;
  }
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
