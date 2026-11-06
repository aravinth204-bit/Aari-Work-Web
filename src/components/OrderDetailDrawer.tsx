"use client";

import { useState } from "react";
import {
  Printer,
  MessageCircle,
  Pencil,
  ArrowLeft,
  X,
  Phone,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Scissors,
  Save
} from "lucide-react";
import type { EnquiryRecord } from "@/app/admin/page";
import { parseMeasurements, formatMeasurementsToText, type BlouseMeasurements } from "@/lib/measurements";

interface OrderDetailDrawerProps {
  order: EnquiryRecord;
  statusOptions: { key: string; label: string; color: string }[];
  onClose: () => void;
  onPrint: (order: EnquiryRecord) => void;
  onUpdate: (id: number, updates: Partial<EnquiryRecord>) => Promise<void>;
  generateWhatsAppUrl: (order: EnquiryRecord, status: string) => string;
}

export default function OrderDetailDrawer({
  order,
  statusOptions,
  onClose,
  onPrint,
  onUpdate,
  generateWhatsAppUrl,
}: OrderDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EnquiryRecord>>({
    name: order.name,
    mobile: order.mobile,
    city: order.city || "",
    workType: order.workType,
    functionDate: order.functionDate || "",
    deliveryDate: order.deliveryDate || "",
    orderAmount: order.orderAmount || 0,
    advanceAmount: order.advanceAmount || 0,
    status: order.status,
    measurements: order.measurements || "",
    message: order.message || "",
    adminNotes: order.adminNotes || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const parsedInit = parseMeasurements(order.measurements);
  const [structuredMeas, setStructuredMeas] = useState<BlouseMeasurements>(parsedInit.structured);
  const [measureNotes, setMeasureNotes] = useState<string>(parsedInit.rawNotes);

  const total = Number(formData.orderAmount) || 0;
  const advance = Number(formData.advanceAmount) || 0;
  const balance = Math.max(0, total - advance);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formattedMeasurements = formatMeasurementsToText(structuredMeas, measureNotes);
      const updatedData = { ...formData, measurements: formattedMeasurements };
      await onUpdate(order.id, updatedData);
      setFormData(updatedData);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const currentStatusObj = statusOptions.find((s) => s.key === (formData.status || order.status)) || statusOptions[0];

  return (
    <div className="fixed inset-y-0 right-0 left-0 md:left-72 z-40 bg-[#FFFFFF] flex flex-col overflow-hidden animate-fade-in shadow-2xl border-l border-[#D8C19A]/40">
      {/* Main Full-Page Order Dossier Container */}
      <div data-lenis-prevent className="relative w-full h-full bg-[#FFFFFF] flex flex-col justify-between overflow-hidden">
        {/* ========================================================== */}
        {/* TOP PROMINENT ACTION BAR                                   */}
        {/* ========================================================== */}
        <div className="bg-[#F8F3EC] border-b border-[#D8C19A]/40 px-3.5 sm:px-8 py-3 shrink-0 shadow-2xs">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            {/* Top row: Single clean Back Arrow button + Order info */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                {/* Single Back Arrow Button (clean & intuitive across mobile & desktop) */}
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-[#F1E7DC] text-[#3A2025] ring-1 ring-[#D8C19A]/60 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                  aria-label="Back to Orders Hub"
                  title="Back to Orders Hub"
                >
                  <ArrowLeft className="w-4 h-4 text-[#6B2638]" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#3A2025] text-[#D8C19A]">
                      ORD-#{order.id}
                    </span>
                    <span className="text-[11px] text-[#7E5C30]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <h2 className="font-serif-display text-base sm:text-xl font-bold text-[#3A2025] leading-tight truncate max-w-[200px] sm:max-w-sm">
                    {order.name}
                  </h2>
                </div>
              </div>

              {/* Edit Toggle for mobile header */}
              <div className="sm:hidden">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer shadow-xs ${
                    isEditing
                      ? "bg-[#6B2638] text-white border-[#D8C19A]"
                      : "bg-white text-[#3A2025] border-[#D8C19A]/60"
                  }`}
                  title={isEditing ? "Exit Edit" : "Edit Order Details"}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Print Bill, WhatsApp, Edit */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* 1. Print Bill */}
              <button
                onClick={() => onPrint({ ...order, ...formData } as EnquiryRecord)}
                className="btn-atelier-gold flex-1 sm:flex-none justify-center text-xs"
                title="Print Official Boutique Bill & Measurements Slip"
              >
                <Printer className="w-4 h-4 text-[#B08A57]" />
                <span>Print Bill</span>
              </button>

              {/* 2. WhatsApp Direct */}
              <a
                href={generateWhatsAppUrl(order, formData.status || order.status)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-atelier-whatsapp flex-1 sm:flex-none justify-center text-xs"
                title="Send WhatsApp Status Update to Bride"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* 3. Edit Toggle (Desktop) */}
              <div className="hidden sm:block">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer shadow-xs ${
                    isEditing
                      ? "bg-[#6B2638] text-white border-[#D8C19A] shadow-md ring-2 ring-[#B08A57]/40"
                      : "bg-white text-[#3A2025] border-[#D8C19A]/60 hover:bg-[#F8F3EC] hover:border-[#B08A57]"
                  }`}
                  title={isEditing ? "Exit Edit" : "Edit Order Details"}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* SCROLLABLE ORDER DOSSIER BODY                              */}
        {/* ========================================================== */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8 py-6 text-[#3A2025] touch-pan-y bg-[#FDFBF7]" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Status & Muhurtham Banner */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F8F3EC] border border-[#D8C19A]/50">
            <div>
              <span className="text-[10px] text-[#7E5C30] uppercase font-bold tracking-wider block">
                Production Stage
              </span>
              {isEditing ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 w-full bg-white border border-[#D8C19A] rounded-xl px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#B08A57]"
                >
                  {statusOptions.map((st) => (
                    <option key={st.key} value={st.key}>
                      {st.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${currentStatusObj.color}`}>
                  {currentStatusObj.label}
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] text-red-700 uppercase font-bold tracking-wider block">
                Target Handover Date
              </span>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.deliveryDate || ""}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="mt-1 w-full bg-white border border-[#D8C19A] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              ) : (
                <span className="text-xs font-bold text-red-700 font-mono mt-1 block">
                  {formData.deliveryDate || "No Date Fixed"}
                </span>
              )}
            </div>
          </div>

          {/* Accounts & Settlement Card */}
          <div className="p-4 rounded-2xl bg-[#3A2025] text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs uppercase font-bold tracking-wider text-[#D8C19A]">
                Billing & Accounts
              </span>
              <span className="text-xs text-white/70">
                {balance > 0 ? `₹${balance.toLocaleString("en-IN")} Pending` : "100% Paid"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#D8C19A] block">Total Amount</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.orderAmount}
                    onChange={(e) => setFormData({ ...formData, orderAmount: Number(e.target.value) })}
                    className="w-full text-center bg-white text-[#3A2025] font-bold text-xs rounded-lg py-1 mt-1 font-mono"
                  />
                ) : (
                  <span className="font-serif-display text-base sm:text-lg font-bold text-white">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#D8C19A] block">Advance Received</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.advanceAmount}
                    onChange={(e) => setFormData({ ...formData, advanceAmount: Number(e.target.value) })}
                    className="w-full text-center bg-white text-[#3A2025] font-bold text-xs rounded-lg py-1 mt-1 font-mono"
                  />
                ) : (
                  <span className="font-serif-display text-base sm:text-lg font-bold text-emerald-400">
                    ₹{advance.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-[#6B2638] border border-white/20">
                <span className="text-[10px] text-[#D8C19A] block">Balance Due</span>
                <span className="font-serif-display text-base sm:text-lg font-bold text-[#D8C19A]">
                  ₹{balance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Bride Contact Information */}
          <div className="p-4 rounded-2xl border border-[#D8C19A]/40 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E5C30] pb-2 border-b border-[#D8C19A]/20">
              Bride & Event Information
            </h4>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#7E5C30] block">Customer Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 border border-[#D8C19A] rounded-xl text-xs font-medium"
                  />
                ) : (
                  <span className="font-bold text-[#3A2025] block mt-0.5">{formData.name}</span>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7E5C30] block">Mobile Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.mobile || ""}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full mt-1 p-2 border border-[#D8C19A] rounded-xl text-xs font-mono"
                  />
                ) : (
                  <a
                    href={`tel:${formData.mobile}`}
                    className="font-mono font-bold text-[#6B2638] flex items-center gap-1.5 mt-0.5 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{formData.mobile}</span>
                  </a>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7E5C30] block">City / Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full mt-1 p-2 border border-[#D8C19A] rounded-xl text-xs"
                  />
                ) : (
                  <span className="font-medium text-[#3A2025] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#7E5C30]" />
                    <span>{formData.city || "Gobichettipalayam"}</span>
                  </span>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7E5C30] block">Muhurtham / Wedding Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.functionDate || ""}
                    onChange={(e) => setFormData({ ...formData, functionDate: e.target.value })}
                    className="w-full mt-1 p-2 border border-[#D8C19A] rounded-xl text-xs font-mono"
                  />
                ) : (
                  <span className="font-bold text-[#6B2638] flex items-center gap-1 mt-0.5 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formData.functionDate || "Not Specified"}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Blouse Craft & Embroidery Work Details */}
          <div className="p-4 rounded-2xl border border-[#D8C19A]/40 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E5C30] pb-2 border-b border-[#D8C19A]/20">
              Blouse Work & Craft Category
            </h4>

            <div className="text-xs space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#7E5C30] block">Work Type</label>
                {isEditing ? (
                  <select
                    value={formData.workType}
                    onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                    className="w-full mt-1 p-2 border border-[#D8C19A] rounded-xl text-xs font-semibold"
                  >
                    <option value="Bridal Aari Blouse">Bridal Aari Blouse</option>
                    <option value="Party Wear Blouse">Party Wear Blouse</option>
                    <option value="Maggam Work Saree">Maggam Work Saree</option>
                    <option value="Simple / Daily Wear">Simple / Daily Wear</option>
                    <option value="Kids Frock Work">Kids Frock Work</option>
                    <option value="Custom Design">Custom Design</option>
                  </select>
                ) : (
                  <span className="font-bold text-sm text-[#3A2025] block mt-0.5">
                    {formData.workType}
                  </span>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7E5C30] block">Customer Special Instructions</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.message || ""}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full mt-1 p-2 border border-[#D8C19A] rounded-xl text-xs"
                  />
                ) : (
                  <p className="mt-1 p-2.5 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/30 text-xs text-[#3A2025]/85 italic">
                    {formData.message || "No special note registered."}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7E5C30] block">Artisan & Internal Notes</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.adminNotes || ""}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                    placeholder="Thread codes, assigned worker, etc."
                    className="w-full mt-1 p-2 border border-[#D8C19A] rounded-xl text-xs font-mono"
                  />
                ) : (
                  <p className="mt-1 p-2.5 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/30 text-xs font-mono text-[#3A2025]">
                    {formData.adminNotes || "Standard craftsmanship guidelines apply."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Measurements Specifications */}
          <div className="p-4 rounded-2xl border border-[#D8C19A]/40 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E5C30] flex items-center justify-between pb-2 border-b border-[#D8C19A]/20">
              <span className="flex items-center gap-1.5"><Scissors className="w-3.5 h-3.5 text-[#B08A57]" /> Tailoring Blouse Measurements</span>
              <span className="text-[10px] text-[#7E5C30]/70 font-mono">Unit: Inches (”)</span>
            </h4>

            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Bust / Chest</label>
                    <input
                      type="text"
                      value={structuredMeas.bust || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, bust: e.target.value })}
                      placeholder="e.g. 36"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Waist</label>
                    <input
                      type="text"
                      value={structuredMeas.waist || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, waist: e.target.value })}
                      placeholder="e.g. 30"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Blouse Length</label>
                    <input
                      type="text"
                      value={structuredMeas.blouseLength || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, blouseLength: e.target.value })}
                      placeholder="e.g. 14.5"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Front Neck Deep</label>
                    <input
                      type="text"
                      value={structuredMeas.frontNeck || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, frontNeck: e.target.value })}
                      placeholder="e.g. 6.5"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Back Neck Deep</label>
                    <input
                      type="text"
                      value={structuredMeas.backNeck || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, backNeck: e.target.value })}
                      placeholder="e.g. 8.5"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Sleeve Length</label>
                    <input
                      type="text"
                      value={structuredMeas.sleeveLength || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, sleeveLength: e.target.value })}
                      placeholder="e.g. 10.5"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Sleeve Round</label>
                    <input
                      type="text"
                      value={structuredMeas.sleeveRound || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, sleeveRound: e.target.value })}
                      placeholder="e.g. 11"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Shoulder</label>
                    <input
                      type="text"
                      value={structuredMeas.shoulder || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, shoulder: e.target.value })}
                      placeholder="e.g. 14"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Arm Hole</label>
                    <input
                      type="text"
                      value={structuredMeas.armHole || ""}
                      onChange={(e) => setStructuredMeas({ ...structuredMeas, armHole: e.target.value })}
                      placeholder="e.g. 15.5"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#7E5C30] block mb-0.5">Custom Fitting Notes</label>
                  <input
                    type="text"
                    value={measureNotes}
                    onChange={(e) => setMeasureNotes(e.target.value)}
                    placeholder="Princess cut, cup padding, potli buttons, dori..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8C19A] text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Bust</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.bust ? `${structuredMeas.bust}”` : "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Waist</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.waist ? `${structuredMeas.waist}”` : "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Length</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.blouseLength ? `${structuredMeas.blouseLength}”` : "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Front Neck</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.frontNeck ? `${structuredMeas.frontNeck}”` : "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Back Neck</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.backNeck ? `${structuredMeas.backNeck}”` : "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Sleeve Len</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.sleeveLength ? `${structuredMeas.sleeveLength}”` : "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Sleeve Rnd</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.sleeveRound ? `${structuredMeas.sleeveRound}”` : "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Shoulder</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.shoulder ? `${structuredMeas.shoulder}”` : "—"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/40">
                    <span className="text-[9px] text-[#7E5C30] block font-bold">Arm Hole</span>
                    <span className="text-xs font-bold text-[#3A2025] font-mono">{structuredMeas.armHole ? `${structuredMeas.armHole}”` : "—"}</span>
                  </div>
                </div>

                {formData.measurements && (
                  <p className="text-[11px] text-[#7E5C30] italic bg-[#F8F3EC]/40 p-2.5 rounded-xl border border-[#D8C19A]/30">
                    {formData.measurements}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        </div>

        {/* ========================================================== */}
        {/* BOTTOM SAVE BAR (When Editing)                             */}
        {/* ========================================================== */}
        {isEditing && (
          <div className="p-4 bg-[#F8F3EC] border-t border-[#D8C19A]/40 shrink-0 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-atelier-subtle"
            >
              Cancel Edit
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="btn-atelier-primary disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#D8C19A]" />
              <span>{isSaving ? "Saving..." : "Save Order Changes"}</span>
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

