"use client";

import { useState } from "react";
import { site, workTypes } from "@/lib/site";

const budgets = ["Below ₹1,500", "₹1,500 – ₹3,000", "₹3,000 – ₹6,000", "₹6,000+", "Not decided"];

export default function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    workType: "",
    functionDate: "",
    budget: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      set("message", form.message ? `${form.message} [File: ${file.name}]` : `[File: ${file.name}]`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      set("message", form.message ? `${form.message} [File: ${file.name}]` : `[File: ${file.name}]`);
    }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network problem. Please try WhatsApp.");
      setStatus("error");
    }
  }

  if (status === "done") {
    const text = encodeURIComponent(
      `Hi ${site.name}, I just submitted an enquiry.\nName: ${form.name}\nWork: ${form.workType}`,
    );
    return (
      <div className="rounded-3xl bg-[#FFFFFF] p-8 text-center ring-1 ring-[#D8C19A] shadow-lg">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="font-serif-display text-2xl text-[#3A2025] mb-2">Nandri {form.name}!</h3>
        <p className="text-sm text-[#3A2025]/80 mb-6">
          Ungal enquiry received. 24 hours-kul namma call / WhatsApp panniduvom.
        </p>
        <a
          href={`https://wa.me/${site.whatsapp}?text=${text}`}
          target="_blank"
          className="inline-block rounded-full bg-[#25D366] px-6 py-3 text-white text-sm font-medium hover:bg-[#20ba59] transition"
        >
          Send on WhatsApp too
        </a>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-[#D8C19A] bg-[#FFFFFF] text-[#3A2025] placeholder:text-[#3A2025]/40 px-4 py-3 text-sm outline-none focus:border-[#6B2638] focus:ring-2 focus:ring-[#B08A57]/25 transition";

  return (
    <form onSubmit={submit} className="rounded-3xl bg-[#FFFFFF] p-6 md:p-8 ring-1 ring-[#D8C19A] shadow-lg space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[#3A2025]/80">Your Name *</label>
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Mithanya" required />
        </div>
        <div>
          <label className="text-xs font-medium text-[#3A2025]/80">Mobile / WhatsApp *</label>
          <input className={input} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="98765 43210" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[#3A2025]/80">Work Type *</label>
          <select className={input} value={form.workType} onChange={(e) => set("workType", e.target.value)} required>
            <option value="">Select work</option>
            {workTypes.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#3A2025]/80">Function Date</label>
          <input type="date" className={input} value={form.functionDate} onChange={(e) => set("functionDate", e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[#3A2025]/80">Budget</label>
          <select className={input} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
            <option value="">Select budget</option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#3A2025]/80">City / Area</label>
          <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Coimbatore" />
        </div>
      </div>

      {/* Reference Design Upload Area with Drag & Drop Visual Interaction */}
      <div>
        <label className="text-xs font-medium text-[#3A2025]/80">Reference Design / Photo Upload</label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative mt-1 rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-[#B08A57] bg-[#F1E7DC]/60 ring-2 ring-[#B08A57]/20"
              : "border-[#D8C19A] bg-[#FFFFFF] hover:border-[#B08A57]"
          }`}
        >
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
            <span
              className={`text-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isDragging ? "scale-110" : "scale-100"
              } motion-reduce:!scale-100`}
            >
              📤
            </span>
            <span className="text-xs font-medium text-[#3A2025]">
              {fileName ? `Selected: ${fileName}` : "Upload Reference Design (PNG, JPG, WEBP)"}
            </span>
            <span className="text-[10px] text-[#3A2025]/60">Drag & drop your reference photo or click to browse</span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-[#3A2025]/80">Design details / Reference</label>
        <textarea
          rows={3}
          className={input}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Instagram link, colour, stone work venum..."
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        disabled={status === "loading"}
        className="cta-shimmer w-full rounded-full bg-[#6B2638] px-6 py-3.5 text-white font-medium hover:bg-[#541D2B] disabled:opacity-60 transition"
      >
        <span>{status === "loading" ? "Sending..." : "Send Enquiry"}</span>
      </button>
      <p className="text-center text-[11px] text-[#3A2025]/60">
        Ungal details safe-a irukum. Namma mattum contact panuvom.
      </p>
    </form>
  );
}
