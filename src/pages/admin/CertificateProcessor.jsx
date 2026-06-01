import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, FileText, Printer, QrCode, CheckCircle2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useOutletContext } from "react-router-dom";

const docTypes = [
  "Barangay Clearance", "Certificate of Residency", "Certificate of Indigency",
  "Business Clearance", "Good Moral Certificate", "Solo Parent Certificate",
  "Senior Citizen Certificate", "First Time Job Seeker Certificate", "Custom Certificate",
];

const defaultContent = {
  "Barangay Clearance": "This is to certify that the above-named person is a bonafide resident of Barangay San Vicente, Olango Island, Lapu-Lapu City, Cebu and has no derogatory record filed in this Barangay.",
  "Certificate of Residency": "This is to certify that the above-named person is a bonafide resident of Barangay San Vicente, Olango Island, Lapu-Lapu City, Cebu.",
  "Certificate of Indigency": "This is to certify that the above-named person is a bonafide resident of this Barangay and belongs to the indigent sector of the community.",
};

export default function CertificateProcessor() {
  const { toast } = useToast();
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const [residentSearch, setResidentSearch] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form, setForm] = useState({
    document_type: "", purpose: "", certificate_content: "", fee: 0,
  });
  const [generatedCert, setGeneratedCert] = useState(null);

  const { data: residents = [] } = useQuery({
    queryKey: ["cert-residents"],
    queryFn: () => base44.entities.Resident.filter({ status: "Active" }, "full_name"),
  });

  const filteredResidents = residents.filter((r) =>
    residentSearch && r.full_name?.toLowerCase().includes(residentSearch.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const controlNumber = `BRG-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
      const verificationCode = `VER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      const cert = await base44.entities.CertificateRequest.create({
        ...data,
        applicant_name: selectedResident.full_name,
        resident_id: selectedResident.id,
        control_number: controlNumber,
        qr_verification_code: verificationCode,
        application_number: `APP-${Date.now().toString(36).toUpperCase()}`,
        date_filed: new Date().toISOString().split("T")[0],
        date_approved: new Date().toISOString().split("T")[0],
        status: "Approved",
        processing_officer: user?.full_name || "Admin",
      });

      // Log activity
      await base44.entities.AuditLog.create({
        action: "Certificate Issued",
        details: `${data.document_type} issued to ${selectedResident.full_name} (${controlNumber})`,
        user_name: user?.full_name,
        user_role: user?.role,
        timestamp: new Date().toISOString(),
      });

      return cert;
    },
    onSuccess: (cert) => {
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
      setGeneratedCert(cert);
      setPreviewOpen(true);
      toast({ title: "Certificate Generated", description: `Control #: ${cert.control_number}` });
    },
  });

  const handleDocTypeChange = (type) => {
    setForm({
      ...form,
      document_type: type,
      certificate_content: defaultContent[type] || "",
      fee: ["Barangay Clearance", "Certificate of Residency", "Good Moral Certificate"].includes(type) ? 50 : type === "Business Clearance" ? 200 : 0,
    });
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!selectedResident) {
      toast({ title: "Error", description: "Please select a resident first.", variant: "destructive" });
      return;
    }
    createMutation.mutate(form);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-heading text-2xl font-bold">Certificate Processing</h1>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <FileText className="w-4 h-4" /> Issue Certificate
        </Button>
      </div>

      {/* Issue Certificate Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Issue Certificate / Clearance</DialogTitle>
          </DialogHeader>

          {/* Resident Search */}
          <div className="space-y-3">
            <Label>Search Resident</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Type resident name..."
                value={residentSearch}
                onChange={(e) => setResidentSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {residentSearch && filteredResidents.length > 0 && !selectedResident && (
              <div className="border rounded-lg max-h-40 overflow-y-auto">
                {filteredResidents.slice(0, 10).map((r) => (
                  <button
                    key={r.id}
                    className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex items-center gap-2"
                    onClick={() => { setSelectedResident(r); setResidentSearch(r.full_name); }}
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{r.full_name}</p>
                      <p className="text-xs text-muted-foreground">{r.purok_sitio} • {r.contact_number}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {selectedResident && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedResident.full_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedResident.address} • {selectedResident.purok_sitio}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setSelectedResident(null); setResidentSearch(""); }}>Change</Button>
              </div>
            )}
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <Label>Document Type *</Label>
              <Select value={form.document_type} onValueChange={handleDocTypeChange}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {docTypes.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Purpose *</Label>
              <Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required placeholder="Employment, School, etc." />
            </div>
            <div>
              <Label>Certificate Content</Label>
              <Textarea value={form.certificate_content} onChange={(e) => setForm({ ...form, certificate_content: e.target.value })} rows={4} />
            </div>
            <div>
              <Label>Fee (₱)</Label>
              <Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: parseFloat(e.target.value) || 0 })} />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={!selectedResident || !form.document_type || createMutation.isPending}>
              <FileText className="w-4 h-4" />
              {createMutation.isPending ? "Generating..." : "Generate Certificate"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {generatedCert && (
            <div>
              <div className="border rounded-lg p-8 bg-white" id="cert-preview">
                <div className="text-center mb-6">
                  <p className="text-xs text-muted-foreground">Republic of the Philippines</p>
                  <p className="text-xs text-muted-foreground">Province of Cebu • City of Lapu-Lapu</p>
                  <p className="text-xs text-muted-foreground">Olango Island</p>
                  <h2 className="font-heading text-xl font-bold mt-2">BARANGAY SAN VICENTE</h2>
                  <div className="w-20 h-0.5 bg-primary mx-auto my-3" />
                  <h3 className="font-heading text-lg font-bold uppercase">{generatedCert.document_type}</h3>
                </div>

                <div className="mb-6 text-sm space-y-2">
                  <p><strong>TO WHOM IT MAY CONCERN:</strong></p>
                  <p className="leading-relaxed">{generatedCert.certificate_content}</p>
                  <p className="mt-4">This certification is issued upon the request of <strong>{generatedCert.applicant_name}</strong> for <strong>{generatedCert.purpose}</strong> purposes.</p>
                  <p className="mt-2">Issued this {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} at Barangay San Vicente, Olango Island, Lapu-Lapu City, Cebu.</p>
                </div>

                <div className="flex justify-between items-end mt-12">
                  <div className="text-center">
                    <div className="border-2 border-dashed border-muted-foreground/30 w-24 h-24 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <QrCode className="w-8 h-8 text-muted-foreground mx-auto" />
                        <p className="text-[8px] text-muted-foreground mt-1">{generatedCert.qr_verification_code}</p>
                      </div>
                    </div>
                    <p className="text-[8px] text-muted-foreground mt-1">Control #: {generatedCert.control_number}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-40 border-b border-foreground mb-1" />
                    <p className="text-xs font-bold">BARANGAY CAPTAIN</p>
                    <p className="text-[10px] text-muted-foreground">Barangay San Vicente</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 no-print">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
                <Button className="gap-2" onClick={handlePrint}>
                  <Printer className="w-4 h-4" /> Print
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}