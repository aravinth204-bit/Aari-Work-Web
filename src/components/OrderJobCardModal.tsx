"use client";

import { useRef } from "react";
import Image from "next/image";
import { Printer, X, Download, Scissors, CheckSquare } from "lucide-react";
import { site } from "@/lib/site";
import type { EnquiryRecord } from "@/app/admin/page";

interface OrderJobCardModalProps {
  order: EnquiryRecord;
  onClose: () => void;
}

export default function OrderJobCardModal({ order, onClose }: OrderJobCardModalProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const balance = Math.max(0, (order.orderAmount || 0) - (order.advanceAmount || 0));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#FFFFFF] rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto p-4 sm:p-8 shadow-2xl ring-1 ring-[#D8C19A] border border-[#D8C19A]/40 flex flex-col justify-between print:ring-0 print:shadow-none print:border-none print:p-0 print:max-h-none print:w-full">
        {/* Top Action Bar (Hidden during actual print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D8C19A]/30 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F8F3EC] text-[#6B2638] ring-1 ring-[#D8C19A]/50">
              <Scissors className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#3A2025]">
                Artisan Job Card & Invoice
              </h3>
              <p className="text-[11px] text-[#7E5C30]">
                Print-ready stitching slip for master artisans & customer handover
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#6B2638] text-white text-xs font-semibold hover:bg-[#541D2B] transition-all shadow-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#7E5C30] hover:text-[#3A2025] hover:bg-[#F8F3EC] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PRINTABLE JOB CARD SLIP BODY                                  */}
        {/* ============================================================== */}
        <div ref={printAreaRef} className="printable-job-card space-y-5 text-[#3A2025]">
          {/* Slip Header */}
          <div className="flex items-start justify-between border-b-2 border-[#3A2025]/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-[#D8C19A] bg-[#F8F3EC] p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/images/Logo-256.png"
                  alt={site.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#3A2025]">
                  {site.name}
                </h1>
                <p className="text-xs text-[#6B2638] font-semibold tracking-wider uppercase">
                  Bridal Blouse & Aari Atelier
                </p>
                <p className="text-[11px] text-[#7E5C30]">
                  {site.address} • Ph: {site.phoneDisplay}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-[#6B2638] text-white font-mono text-xs font-bold shadow-xs">
                JOB #{order.id}
              </span>
              <p className="text-[11px] text-[#7E5C30] mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Customer & Event Details Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#F8F3EC] border border-[#D8C19A]/50 text-xs">
            <div>
              <span className="text-[10px] text-[#7E5C30] uppercase font-bold tracking-wider block">Bride / Customer</span>
              <span className="font-serif-display text-sm font-bold text-[#3A2025]">{order.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7E5C30] uppercase font-bold tracking-wider block">Mobile Contact</span>
              <span className="font-mono font-bold text-[#3A2025]">{order.mobile}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7E5C30] uppercase font-bold tracking-wider block">Muhurtham / Event</span>
              <span className="font-bold text-[#6B2638]">
                {order.functionDate || "Not Specified"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-red-700 uppercase font-bold tracking-wider block">Target Delivery</span>
              <span className="font-bold text-red-700 font-mono text-xs">
                {order.deliveryDate || "Urgent Delivery"}
              </span>
            </div>
          </div>

          {/* Work Description & Type */}
          <div className="border border-[#D8C19A]/40 rounded-2xl p-4 bg-white">
            <div className="flex items-center justify-between pb-2 border-b border-[#D8C19A]/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E5C30]">
                Design & Craft Specifications
              </h4>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#3A2025]/5 text-[#3A2025] border border-[#D8C19A]/40">
                {order.workType}
              </span>
            </div>

            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-[#7E5C30] block mb-1">Customer Request / Message:</span>
                <p className="bg-[#F8F3EC]/50 p-2.5 rounded-xl border border-[#D8C19A]/30 italic text-[#3A2025]/90">
                  {order.message || "Standard custom bridal neck & elbow sleeve embroidery work."}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#7E5C30] block mb-1">Artisan / Atelier Notes:</span>
                <p className="bg-[#F8F3EC]/50 p-2.5 rounded-xl border border-[#D8C19A]/30 text-[#3A2025]/90 font-mono text-[11px]">
                  {order.adminNotes || "Use premium zardosi & original kundan stones with double golden thread."}
                </p>
              </div>
            </div>
          </div>

          {/* Measurements Breakdown (If provided) */}
          <div className="border border-[#D8C19A]/40 rounded-2xl p-4 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E5C30] mb-2 flex items-center justify-between">
              <span>Blouse Measurements</span>
              <span className="text-[10px] font-normal text-[#7E5C30]/80">Unit: Inches (” / cm)</span>
            </h4>

            {order.measurements ? (
              <div className="p-2.5 bg-[#F8F3EC]/50 rounded-xl font-mono text-xs text-[#3A2025] leading-relaxed whitespace-pre-wrap">
                {order.measurements}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                {["Bust", "Waist", "Length", "Front Neck", "Back Neck", "Sleeve"].map((field) => (
                  <div key={field} className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-dashed border-[#D8C19A]">
                    <span className="text-[10px] text-[#7E5C30] block">{field}</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">______</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Production Stage Checkboxes (For Artisans & Quality Control) */}
          <div className="p-3.5 rounded-2xl border border-dashed border-[#D8C19A] bg-[#F8F3EC]/40">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7E5C30] block mb-2">
              Artisan Production Checkpoints
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 text-[#3A2025]">
                <input type="checkbox" className="rounded text-[#6B2638] focus:ring-[#B08A57]" />
                <span>1. Fabric Cut</span>
              </label>
              <label className="flex items-center gap-2 text-[#3A2025]">
                <input type="checkbox" className="rounded text-[#6B2638] focus:ring-[#B08A57]" />
                <span>2. Aari Done</span>
              </label>
              <label className="flex items-center gap-2 text-[#3A2025]">
                <input type="checkbox" className="rounded text-[#6B2638] focus:ring-[#B08A57]" />
                <span>3. Stitched</span>
              </label>
              <label className="flex items-center gap-2 text-[#3A2025]">
                <input type="checkbox" className="rounded text-[#6B2638] focus:ring-[#B08A57]" />
                <span>4. QC Checked</span>
              </label>
            </div>
          </div>

          {/* Payment Summary Footer */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#3A2025] text-white">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#D8C19A] uppercase tracking-wider block font-semibold">
                Accounts Settlement
              </span>
              <p className="text-xs text-white/80">
                Advance Paid: <strong className="text-white font-mono">₹{(order.advanceAmount || 0).toLocaleString("en-IN")}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#D8C19A] uppercase tracking-wider block">
                {balance > 0 ? "Balance on Handover" : "Status"}
              </span>
              <div className="font-serif-display text-lg sm:text-xl font-bold text-[#D8C19A]">
                {balance > 0 ? `₹${balance.toLocaleString("en-IN")}` : "100% Fully Paid"}
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="flex items-end justify-between pt-6 text-xs text-[#7E5C30] border-t border-[#3A2025]/10">
            <div>
              <p className="italic">Thank you for choosing Tales by Threads!</p>
              <p className="text-[10px] mt-0.5">Gobichettipalayam Studio • Terms: Fitting trial within 3 days of delivery.</p>
            </div>
            <div className="text-right">
              <div className="border-b border-[#3A2025]/40 w-32 mb-1 inline-block" />
              <p className="text-[10px] font-bold text-[#3A2025]">Master Artisan Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

