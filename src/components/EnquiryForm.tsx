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

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

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
      <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-[#eadfcd] shadow-lg">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="font-serif-display text-2xl text-[#6b1226] mb-2">Nandri {form.name}!</h3>
        <p className="text-sm text-neutral-600 mb-6">
          Ungal enquiry received. 24 hours-kul namma call / WhatsApp panniduvom.
        </p>
        <a
          href={`https://wa.me/${site.whatsapp}?text=${text}`}
          target="_blank"
          className="inline-block rounded-full bg-[#25D366] px-6 py-3 text-white text-sm font-medium"
        >
          Send on WhatsApp too
        </a>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-[#e3d3bb] bg-white text-neutral-900 placeholder:text-neutral-400 px-4 py-3 text-sm outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25";

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-6 md:p-8 ring-1 ring-[#eadfcd] shadow-lg space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-neutral-600">Your Name *</label>
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Mithanya" required />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-600">Mobile / WhatsApp *</label>
          <input className={input} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="98765 43210" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-neutral-600">Work Type *</label>
          <select className={input} value={form.workType} onChange={(e) => set("workType", e.target.value)} required>
            <option value="">Select work</option>
            {workTypes.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-600">Function Date</label>
          <input type="date" className={input} value={form.functionDate} onChange={(e) => set("functionDate", e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-neutral-600">Budget</label>
          <select className={input} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
            <option value="">Select budget</option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-600">City / Area</label>
          <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Coimbatore" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-600">Design details / Reference</label>
        <textarea
          rows={3}
          className={input}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Instagram link, colour, stone work venum..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        disabled={status === "loading"}
        className="w-full rounded-full bg-[#6b1226] px-6 py-3.5 text-white font-medium hover:bg-[#540e1e] disabled:opacity-60 transition"
      >
        {status === "loading" ? "Sending..." : "Send Enquiry"}
      </button>
      <p className="text-center text-[11px] text-neutral-500">
        Ungal details safe-a irukum. Namma mattum contact panuvom.
      </p>
    </form>
  );
}
