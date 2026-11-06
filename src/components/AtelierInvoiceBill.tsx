"use client";

import { useRef } from "react";
import Image from "next/image";
import { Printer, X, Scissors } from "lucide-react";
import { site } from "@/lib/site";
import type { EnquiryRecord } from "@/app/admin/page";

interface AtelierInvoiceBillProps {
  order: EnquiryRecord;
  onClose: () => void;
}

export default function AtelierInvoiceBill({ order, onClose }: AtelierInvoiceBillProps) {
  const handlePrint = () => {
    window.print();
  };

  const totalAmount = order.orderAmount || 0;
  const advanceAmount = order.advanceAmount || 0;
  const balanceAmount = Math.max(0, totalAmount - advanceAmount);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#FFFFFF] rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto p-4 sm:p-8 shadow-2xl ring-1 ring-[#D8C19A] border border-[#D8C19A]/40 flex flex-col justify-between print:ring-0 print:shadow-none print:border-none print:p-0 print:max-h-none print:w-full">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D8C19A]/30 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F8F3EC] text-[#6B2638] ring-1 ring-[#D8C19A]/50">
              <Scissors className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#3A2025]">
                Atelier Official Bill & Job Slip
              </h3>
              <p className="text-[11px] text-[#7E5C30]">
                Customer receipt & artisan embroidery specification slip
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#6B2638] text-white text-xs font-semibold hover:bg-[#541D2B] transition-all shadow-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#7E5C30] hover:text-[#3A2025] hover:bg-[#F8F3EC] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PRINTABLE BILL SHEET                                           */}
        {/* ============================================================== */}
        <div className="printable-job-card space-y-5 text-[#3A2025]">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#3A2025]/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-[#D8C19A] bg-[#F8F3EC] p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/images/Logo-256.png"
                  alt={site.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-serif-display text-2xl font-bold tracking-tight text-[#3A2025]">
                  {site.name}
                </h1>
                <p className="text-xs text-[#6B2638] font-bold tracking-wider uppercase">
                  Handcrafted Aari & Maggam Bridal Studio
                </p>
                <p className="text-[11px] text-[#7E5C30]">
                  {site.address} • Ph: {site.phoneDisplay}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-[#3A2025] text-[#D8C19A] font-mono text-xs font-bold shadow-xs">
                INVOICE #{order.id}
              </span>
              <p className="text-[11px] text-[#7E5C30] mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Customer & Event Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F8F3EC] border border-[#D8C19A]/50 text-xs">
            <div>
              <span className="text-[10px] text-[#7E5C30] uppercase font-bold tracking-wider block">Customer / Bride</span>
              <span className="font-serif-display text-sm font-bold text-[#3A2025]">{order.name}</span>
              {order.city && <span className="text-[10px] text-[#7E5C30] block mt-0.5">{order.city}</span>}
            </div>
            <div>
              <span className="text-[10px] text-[#7E5C30] uppercase font-bold tracking-wider block">Phone Contact</span>
              <span className="font-mono font-bold text-[#3A2025]">{order.mobile}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7E5C30] uppercase font-bold tracking-wider block">Wedding / Muhurtham</span>
              <span className="font-bold text-[#6B2638]">
                {order.functionDate || "Not Specified"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-red-700 uppercase font-bold tracking-wider block">Expected Delivery</span>
              <span className="font-bold text-red-700 font-mono text-xs">
                {order.deliveryDate || "Urgent Delivery"}
              </span>
            </div>
          </div>

          {/* Order Itemization Table */}
          <div className="border border-[#D8C19A]/50 rounded-2xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F3EC] border-b border-[#D8C19A]/40 text-[#7E5C30] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4 text-center">Category</th>
                  <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C19A]/20">
                <tr>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#3A2025] block">{order.workType}</span>
                    <span className="text-[11px] text-[#7E5C30] italic">
                      {order.message || "Custom handmade thread & zardosi embroidery designing with trial trial assurance."}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-[#F8F3EC] text-[#6B2638] font-medium border border-[#D8C19A]/40 text-[10px]">
                      Handmade
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#3A2025]">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Blouse Measurements & Craft Notes */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Measurements */}
            <div className="p-3.5 rounded-2xl border border-[#D8C19A]/40 bg-white">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7E5C30] mb-2 flex items-center justify-between">
                <span>Blouse Measurements</span>
                <span className="text-[10px] text-[#7E5C30]/70">Inches (”)</span>
              </h4>

              {order.measurements ? (
                <div className="p-2.5 bg-[#F8F3EC]/50 rounded-xl font-mono text-xs text-[#3A2025] leading-relaxed whitespace-pre-wrap">
                  {order.measurements}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {["Bust", "Waist", "Length", "Front Neck", "Back Neck", "Sleeve"].map((f) => (
                    <div key={f} className="p-1.5 rounded-lg bg-[#F8F3EC]/50 border border-dashed border-[#D8C19A]">
                      <span className="text-[9px] text-[#7E5C30] block">{f}</span>
                      <span className="text-xs font-mono font-bold text-[#3A2025]">____</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Atelier Notes & Checkpoints */}
            <div className="p-3.5 rounded-2xl border border-[#D8C19A]/40 bg-white flex flex-col justify-between">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7E5C30] mb-1">
                  Artisan Notes / Instructions
                </h4>
                <p className="text-xs text-[#3A2025]/85 italic bg-[#F8F3EC]/50 p-2.5 rounded-xl border border-[#D8C19A]/30">
                  {order.adminNotes || "Use premium gold zari, Kundan stone lines and neat back neckline finishing."}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#D8C19A]/20">
                <span className="text-[10px] font-bold text-[#7E5C30] uppercase block mb-1.5">
                  Production Stages
                </span>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                  <div className="p-1 bg-[#F8F3EC] rounded border border-[#D8C19A]/40">1. Cut [ ]</div>
                  <div className="p-1 bg-[#F8F3EC] rounded border border-[#D8C19A]/40">2. Aari [ ]</div>
                  <div className="p-1 bg-[#F8F3EC] rounded border border-[#D8C19A]/40">3. Stitch [ ]</div>
                  <div className="p-1 bg-[#F8F3EC] rounded border border-[#D8C19A]/40">4. QC [ ]</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Accounts Settlement Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#3A2025] text-white">
            <div className="space-y-1">
              <span className="text-[10px] text-[#D8C19A] uppercase tracking-wider block font-semibold">
                Payment Summary
              </span>
              <p className="text-xs text-white/80">
                Total Billed: <strong className="text-white font-mono">₹{totalAmount.toLocaleString("en-IN")}</strong>
              </p>
              <p className="text-xs text-white/80">
                Advance Paid: <strong className="text-emerald-400 font-mono">₹{advanceAmount.toLocaleString("en-IN")}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#D8C19A] uppercase tracking-wider block">
                {balanceAmount > 0 ? "Balance on Handover" : "Accounts Status"}
              </span>
              <div className="font-serif-display text-xl sm:text-2xl font-bold text-[#D8C19A]">
                {balanceAmount > 0 ? `₹${balanceAmount.toLocaleString("en-IN")}` : "100% Fully Settled"}
              </div>
            </div>
          </div>

          {/* Footer Terms & Signatures */}
          <div className="flex items-end justify-between pt-4 text-xs text-[#7E5C30] border-t border-[#3A2025]/15">
            <div>
              <p className="font-serif-display text-sm font-bold text-[#3A2025]">Thank you for your order!</p>
              <p className="text-[10px] mt-0.5 max-w-xs">
                Free fitting trial at our Gobichettipalayam studio. Please bring the blouse within 3 days if adjustments needed.
              </p>
            </div>
            <div className="text-right">
              <div className="border-b border-[#3A2025]/40 w-36 mb-1 inline-block" />
              <p className="text-[10px] font-bold text-[#3A2025]">Authorized Atelier Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

