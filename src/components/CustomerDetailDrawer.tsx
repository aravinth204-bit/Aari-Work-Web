"use client";

import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Calendar,
  Sparkles,
  MapPin,
  Crown,
  ArrowLeft,
  X,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  ShoppingBag
} from "lucide-react";
import type { EnquiryRecord } from "@/app/admin/page";

interface CustomerProfile {
  mobile: string;
  name: string;
  city: string;
  orders: EnquiryRecord[];
  totalSpent: number;
  totalAdvance: number;
  firstOrderDate: string;
  isRepeat: boolean;
}

interface CustomerDetailDrawerProps {
  customer: CustomerProfile;
  onClose: () => void;
  onSelectOrder: (order: EnquiryRecord) => void;
}

export default function CustomerDetailDrawer({
  customer,
  onClose,
  onSelectOrder,
}: CustomerDetailDrawerProps) {
  const pendingDues = Math.max(0, customer.totalSpent - customer.totalAdvance);

  return (
    <div className="fixed inset-y-0 right-0 left-0 md:left-72 z-40 bg-[#FFFFFF] flex flex-col overflow-hidden animate-fade-in shadow-2xl border-l border-[#D8C19A]/40">
      {/* ========================================================== */}
      {/* TOP PROMINENT ACTION BAR                                   */}
      {/* ========================================================== */}
      <div className="bg-[#F8F3EC] border-b border-[#D8C19A]/40 px-4 sm:px-8 py-4 shrink-0 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          {/* Top row: Single clean Back Arrow button + Client info */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              {/* Single Back Arrow Button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white hover:bg-[#F1E7DC] text-[#3A2025] ring-1 ring-[#D8C19A]/60 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                aria-label="Back to Customer Directory"
                title="Back to Customer Directory"
              >
                <ArrowLeft className="w-4 h-4 text-[#6B2638]" />
              </button>

              <span className="w-9 h-9 rounded-xl bg-[#6B2638] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                {customer.name[0]}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif-display text-base sm:text-xl font-bold text-[#3A2025] truncate max-w-[180px] sm:max-w-sm">
                    {customer.name}
                  </h2>
                  {customer.isRepeat && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-[#B08A57]" />
                      <span className="hidden sm:inline">Repeat Bride</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7E5C30] flex items-center gap-2 mt-0.5 font-mono">
                  <span>{customer.mobile}</span>
                  {customer.city && <span>• {customer.city}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Top Actions: WhatsApp & Call */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/${customer.mobile.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-atelier-whatsapp flex-1 sm:flex-none justify-center text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${customer.mobile}`}
              className="btn-atelier-primary flex-1 sm:flex-none justify-center text-xs"
            >
              <Phone className="w-4 h-4 text-[#D8C19A]" />
              <span>Call Bride</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SCROLLABLE CUSTOMER DOSSIER BODY                           */}
      {/* ========================================================== */}
      <div
        data-lenis-prevent
        className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8 py-6 text-[#3A2025] touch-pan-y bg-[#FDFBF7]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Customer Lifetime Financial Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-[#D8C19A]/50 shadow-2xs">
              <span className="text-[10px] text-[#7E5C30] font-bold uppercase tracking-wider block">
                Total Orders
              </span>
              <div className="font-serif-display text-2xl font-bold text-[#3A2025] mt-1 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#B08A57]" />
                <span>{customer.orders.length}</span>
              </div>
              <span className="text-[10px] text-[#7E5C30] block mt-0.5">
                First: {new Date(customer.firstOrderDate).toLocaleDateString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D8C19A]/50 shadow-2xs">
              <span className="text-[10px] text-[#7E5C30] font-bold uppercase tracking-wider block">
                Lifetime Value
              </span>
              <div className="font-serif-display text-2xl font-bold text-[#0F7A6C] mt-1">
                ₹{customer.totalSpent.toLocaleString("en-IN")}
              </div>
              <span className="text-[10px] text-[#7E5C30] block mt-0.5">Total Billed</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D8C19A]/50 shadow-2xs">
              <span className="text-[10px] text-[#7E5C30] font-bold uppercase tracking-wider block">
                Advance Paid
              </span>
              <div className="font-serif-display text-2xl font-bold text-[#6B2638] mt-1">
                ₹{customer.totalAdvance.toLocaleString("en-IN")}
              </div>
              <span className="text-[10px] text-[#7E5C30] block mt-0.5">Deposited in Studio</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#3A2025] text-white shadow-2xs">
              <span className="text-[10px] text-[#D8C19A] font-bold uppercase tracking-wider block">
                Outstanding Balance
              </span>
              <div className="font-serif-display text-2xl font-bold text-[#D8C19A] mt-1">
                ₹{pendingDues.toLocaleString("en-IN")}
              </div>
              <span className="text-[10px] text-white/70 block mt-0.5">
                {pendingDues > 0 ? "Pending Handover" : "100% Cleared"}
              </span>
            </div>
          </div>

          {/* Past Orders Ledger History */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#D8C19A]/50 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8C19A]/30">
              <div>
                <h3 className="font-serif-display text-lg font-bold text-[#3A2025]">
                  Complete Order History ({customer.orders.length} Records)
                </h3>
                <p className="text-xs text-[#7E5C30]">
                  Click on any order to view full measurements, artisan slip, and update details
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#D8C19A]/20">
              {customer.orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => onSelectOrder(ord)}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8F3EC]/50 p-3 rounded-2xl cursor-pointer transition-colors group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#6B2638] bg-[#F8F3EC] px-2 py-0.5 rounded-full ring-1 ring-[#D8C19A]/40">
                        ORD-#{ord.id}
                      </span>
                      <span className="font-bold text-sm text-[#3A2025] group-hover:text-[#6B2638] transition-colors">
                        {ord.workType}
                      </span>
                    </div>
                    <p className="text-xs text-[#7E5C30]">
                      Ordered on {new Date(ord.createdAt).toLocaleDateString()}
                      {ord.deliveryDate ? ` • Delivery Target: ${ord.deliveryDate}` : ""}
                      {ord.functionDate ? ` • Muhurtham: ${ord.functionDate}` : ""}
                    </p>
                    {ord.message && (
                      <p className="text-xs text-[#3A2025]/70 italic line-clamp-1">
                        "{ord.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="font-bold text-sm text-[#0F7A6C] block">
                        ₹{(ord.orderAmount || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-[#7E5C30] uppercase font-semibold">
                        {ord.status.replace("_", " ")}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(ord);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#6B2638] text-white text-xs font-semibold hover:bg-[#541D2B] transition-colors shadow-xs flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

