import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Download, Printer } from "lucide-react";

const BARANGAY_LOGO = "https://media.base44.com/images/public/6a1d00c12929ea8d18f9682c/fb119da1d_sanvicentelogo.png";
const LAPU_LAPU_SEAL = "https://media.base44.com/images/public/6a1d00c12929ea8d18f9682c/c4de232ea_LLC.png";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function ResidentIDCard({ resident, showActions = true }) {
  const cardRef = useRef(null);
  const { toast } = useToast();

  const verifyUrl = `${window.location.origin}/verify?resident_id=${encodeURIComponent(resident.resident_id || "")}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verifyUrl)}`;

  const handleDownload = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [90, 57] });
      pdf.addImage(imgData, "PNG", 0, 0, 90, 57);
      pdf.save(`resident-id-${resident.resident_id || "card"}.pdf`);
      toast({ title: "ID Card downloaded" });
    } catch {
      toast({ title: "Download failed", description: "Please try Print instead.", variant: "destructive" });
    }
  };

  const handlePrint = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const printWin = window.open("", "_blank");
      printWin.document.write(`<html><head><title>Resident ID - ${resident.resident_id || ""}</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;"><img src="${imgData}" style="max-width:100%;"/></body></html>`);
      printWin.document.close();
      setTimeout(() => { printWin.print(); }, 500);
    } catch {
      toast({ title: "Print failed", variant: "destructive" });
    }
  };

  return (
    <div>
      <div ref={cardRef} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-border w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3 relative flex items-center justify-between gap-2">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
            <img src={BARANGAY_LOGO} alt="Barangay Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 text-center min-w-0">
            <p className="text-[8px] opacity-75 leading-tight uppercase tracking-wide">Republic of the Philippines</p>
            <p className="text-[9px] opacity-90 leading-tight">City of Lapu-Lapu</p>
            <h3 className="font-heading font-bold text-sm leading-tight">Barangay San Vicente</h3>
            <p className="text-[10px] opacity-80 leading-tight">Resident Digital ID</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden">
            <img src={LAPU_LAPU_SEAL} alt="Lapu-Lapu City Seal" crossOrigin="anonymous" className="w-13 h-13 object-contain" />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex gap-4">
          <div className="shrink-0">
            {resident.photo_url ? (
              <img src={resident.photo_url} alt={resident.full_name} crossOrigin="anonymous" className="w-20 h-20 rounded-lg object-cover border-2 border-border" />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border-2 border-border">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1 text-xs">
            <div>
              <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Resident ID</p>
              <p className="font-bold text-primary">{resident.resident_id || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Name</p>
              <p className="font-medium truncate">{resident.full_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Address</p>
              <p className="truncate">{[resident.address, resident.barangay, resident.municipality].filter(Boolean).join(", ")}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Birth Date</p>
                <p>{resident.date_of_birth ? format(new Date(resident.date_of_birth), "MMM d, yyyy") : "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Sex</p>
                <p>{resident.gender || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={qrUrl} alt="QR Code" crossOrigin="anonymous" className="w-14 h-14" />
          </div>
          <div className="text-right text-[10px]">
            <p className="text-muted-foreground">Registered</p>
            <p className="font-medium">{resident.created_date ? format(new Date(resident.created_date), "MMM d, yyyy") : "—"}</p>
            <Badge className={`mt-1 ${resident.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
              {resident.status || "Active"}
            </Badge>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 mt-4 justify-center no-print">
          <Button size="sm" variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button size="sm" variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      )}
    </div>
  );
}