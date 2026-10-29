"use client";

import { useState } from "react";
import { site, workTypes } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

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
      trackEvent("enquiry_submitted", {
        work_type: form.workType,
        budget: form.budget || "not_set",
      });
    } catch {
      setError("Network problem. Please try WhatsApp.");
      setStatus("error");
    }
  }

  if (status === "done") {
    const text = encodeURIComponent(
      `Hi ${site.name}, I just submitted an enquiry.\nName: ${form.name}\nWork: ${form.workType}\nHere is my reference photo:`,
    );
    return (
      <div className="rounded-3xl bg-[#FFFFFF] p-8 text-center ring-1 ring-[#D8C19A] shadow-lg" role="status">
        <svg className="mx-auto mb-3 h-12 w-12 text-[#0F7A6C]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="24" cy="24" r="19" strokeDasharray="2.5 4" />
          <path d="m15 24 6 6 12-12" />
        </svg>
        <h3 className="font-serif-display text-2xl text-[#3A2025] mb-2">Nandri {form.name}!</h3>
        <p className="text-sm text-[#3A2025]/80 mb-6">
          Ungal enquiry received. 24 hours-kul namma call / WhatsApp panniduvom.
        </p>
        <a
          href={`https://wa.me/${site.whatsapp}?text=${text}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full bg-whatsapp px-6 py-3 text-white text-sm font-medium hover:bg-whatsapp-hover transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2"
        >
          Send photo &amp; details on WhatsApp
        </a>
        <p className="mt-3 text-xs text-[#3A2025]/70">
          Reference photo irundha intha button-la anuppidunga.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-[#D8C19A] bg-[#FFFFFF] text-[#3A2025] placeholder:text-[#3A2025]/40 px-4 py-3 text-sm outline-none focus:border-[#6B2638] focus:ring-2 focus:ring-[#B08A57]/25 transition";

  return (
    <form onSubmit={submit} className="rounded-3xl bg-[#FFFFFF] p-6 md:p-8 ring-1 ring-[#D8C19A] shadow-lg space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="enquiry-name" className="text-xs font-medium text-[#3A2025]/80">Your Name *</label>
          <input id="enquiry-name" name="name" autoComplete="name" className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Mithanya" required />
        </div>
        <div>
          <label htmlFor="enquiry-mobile" className="text-xs font-medium text-[#3A2025]/80">Mobile / WhatsApp *</label>
          <input id="enquiry-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel" className={input} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="98765 43210" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="enquiry-work" className="text-xs font-medium text-[#3A2025]/80">Work Type *</label>
          <select id="enquiry-work" name="workType" className={input} value={form.workType} onChange={(e) => set("workType", e.target.value)} required>
            <option value="">Select work</option>
            {workTypes.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="enquiry-date" className="text-xs font-medium text-[#3A2025]/80">Function Date</label>
          <input id="enquiry-date" name="functionDate" type="date" className={input} value={form.functionDate} onChange={(e) => set("functionDate", e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="enquiry-budget" className="text-xs font-medium text-[#3A2025]/80">Budget</label>
          <select id="enquiry-budget" name="budget" className={input} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
            <option value="">Select budget</option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="enquiry-city" className="text-xs font-medium text-[#3A2025]/80">City / Area</label>
          <input id="enquiry-city" name="city" autoComplete="address-level2" className={input} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Coimbatore" />
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-[#D8C19A] bg-[#F8F3EC] p-4 text-center">
        <p className="text-xs font-medium text-[#3A2025]">Reference design photo irukka?</p>
        <p className="mt-1 text-[11px] text-[#3A2025]/70">
          Form submit pannina aprum, success screen-la WhatsApp photo upload link varum. Reference
          photo-vai WhatsApp-la anuppidunga.
        </p>
      </div>

      <div>
        <label htmlFor="enquiry-message" className="text-xs font-medium text-[#3A2025]/80">Design details / Reference</label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={3}
          className={input}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Instagram link, colour, stone work venum..."
        />
      </div>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className="cta-shimmer w-full rounded-full bg-[#6B2638] px-6 py-3.5 text-white font-medium hover:bg-[#541D2B] disabled:opacity-60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2"
      >
        <span>{status === "loading" ? "Sending..." : "Send my enquiry"}</span>
      </button>
      <p className="text-center text-[11px] text-[#3A2025]/70">
        Ungal details safe-a irukum. Namma mattum contact panuvom.
      </p>
    </form>
  );
}
