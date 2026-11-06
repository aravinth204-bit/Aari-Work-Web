export interface BlouseMeasurements {
  frontNeck?: string;
  backNeck?: string;
  bust?: string;
  waist?: string;
  shoulder?: string;
  armHole?: string;
  sleeveLength?: string;
  sleeveRound?: string;
  blouseLength?: string;
}

export function parseMeasurements(raw?: string | null): { structured: BlouseMeasurements; rawNotes: string } {
  if (!raw || !raw.trim()) {
    return { structured: {}, rawNotes: "" };
  }

  // If already JSON string
  if (raw.trim().startsWith("{") && raw.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        return {
          structured: {
            frontNeck: parsed.frontNeck || "",
            backNeck: parsed.backNeck || "",
            bust: parsed.bust || "",
            waist: parsed.waist || "",
            shoulder: parsed.shoulder || "",
            armHole: parsed.armHole || "",
            sleeveLength: parsed.sleeveLength || "",
            sleeveRound: parsed.sleeveRound || "",
            blouseLength: parsed.blouseLength || "",
          },
          rawNotes: parsed.rawNotes || "",
        };
      }
    } catch {
      // fallback to regex extraction
    }
  }

  // Fallback extraction from free text (e.g. "Bust: 36, Waist: 30, Length: 14.5")
  const structured: BlouseMeasurements = {};
  const extract = (pattern: RegExp) => {
    const m = raw.match(pattern);
    return m ? m[1].trim() : undefined;
  };

  structured.bust = extract(/(?:bust|chest)\s*[:=-]\s*([0-9.]+)/i);
  structured.waist = extract(/waist\s*[:=-]\s*([0-9.]+)/i);
  structured.frontNeck = extract(/front\s*neck\s*[:=-]\s*([0-9.]+)/i);
  structured.backNeck = extract(/back\s*neck\s*[:=-]\s*([0-9.]+)/i);
  structured.sleeveLength = extract(/sleeve\s*length\s*[:=-]\s*([0-9.]+)/i);
  structured.sleeveRound = extract(/sleeve\s*round\s*[:=-]\s*([0-9.]+)/i);
  structured.shoulder = extract(/shoulder\s*[:=-]\s*([0-9.]+)/i);
  structured.blouseLength = extract(/(?:blouse\s*)?length\s*[:=-]\s*([0-9.]+)/i);

  return {
    structured,
    rawNotes: raw,
  };
}

export function formatMeasurementsToText(structured: BlouseMeasurements, notes?: string): string {
  const parts: string[] = [];
  if (structured.bust) parts.push(`Bust: ${structured.bust}"`);
  if (structured.waist) parts.push(`Waist: ${structured.waist}"`);
  if (structured.blouseLength) parts.push(`Length: ${structured.blouseLength}"`);
  if (structured.frontNeck) parts.push(`Front Neck: ${structured.frontNeck}"`);
  if (structured.backNeck) parts.push(`Back Neck: ${structured.backNeck}"`);
  if (structured.shoulder) parts.push(`Shoulder: ${structured.shoulder}"`);
  if (structured.armHole) parts.push(`Arm Hole: ${structured.armHole}"`);
  if (structured.sleeveLength) parts.push(`Sleeve Length: ${structured.sleeveLength}"`);
  if (structured.sleeveRound) parts.push(`Sleeve Round: ${structured.sleeveRound}"`);

  let res = parts.join(" • ");
  if (notes && notes.trim()) {
    res = res ? `${res}\nNotes: ${notes.trim()}` : notes.trim();
  }
  return res;
}

