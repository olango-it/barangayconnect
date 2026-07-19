import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { QrCode, Search, CheckCircle2, XCircle, Shield, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Verify() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [residentResult, setResidentResult] = useState(null);
  const [residentLoading, setResidentLoading] = useState(false);
  const [residentError, setResidentError] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const residentId = urlParams.get("resident_id");
    if (residentId) {
      setResidentLoading(true);
      base44.entities.Resident.filter({ resident_id: residentId })
        .then((res) => {
          setResidentResult(res[0] || null);
          setResidentError(!res[0]);
        })
        .catch(() => setResidentError(true))
        .finally(() => setResidentLoading(false));
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setSearched(true);

    const docs = await base44.entities.CertificateRequest.filter({ qr_verification_code: code.trim() });
    if (docs.length > 0) {
      setResult(docs[0]);
    } else {
      const byControl = await base44.entities.CertificateRequest.filter({ control_number: code.trim() });
      setResult(byControl.length > 0 ? byControl[0] : null);
    }
    setLoading(false);
  };

  // QR Code scanned — show resident certification
  if (residentLoading || residentResult || residentError) {
    return (
      <div>
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Shield className="w-10 h-10 mx-auto mb-3 text-secondary" />
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Resident ID Verification</h1>
            <p className="opacity-80">Barangay San Vicente, Olango Island, Lapu-Lapu City, Cebu</p>
          </div>
        </section>

        <section className="py-16 max-w-3xl mx-auto px-4">
          {residentLoading && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Verifying resident...</p>
            </div>
          )}

          {residentError && !residentLoading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-red-800 mb-1">Resident NOT FOUND</h3>
              <p className="text-sm text-red-600">This QR code does not match any registered resident. Please check and try again.</p>
            </div>
          )}

          {residentResult && !residentLoading && (
            <div className="bg-card rounded-2xl border shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-secondary" />
                <span className="font-heading font-bold">VERIFIED RESIDENT</span>
              </div>

              {/* Certification Body */}
              <div className="p-8 space-y-6">
                <div className="text-center pb-4 border-b border-border">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Republic of the Philippines</p>
                  <p className="text-xs text-muted-foreground">City of Lapu-Lapu</p>
                  <h2 className="font-heading text-lg font-bold text-primary mt-1">Barangay San Vicente</h2>
                  <p className="text-[11px] text-muted-foreground">Olango Island, Lapu-Lapu City, Cebu</p>
                </div>

                <div className="flex items-center gap-4">
                  {residentResult.photo_url ? (
                    <img src={residentResult.photo_url} alt={residentResult.full_name} className="w-16 h-16 rounded-lg object-cover border-2 border-border" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border-2 border-border">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="text-sm space-y-1">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Resident ID</p>
                    <p className="font-bold text-primary">{residentResult.resident_id}</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-foreground">
                  <p className="font-heading text-base font-semibold text-center">CERTIFICATION OF RESIDENCY</p>

                  <p className="text-center italic">This is to certify that</p>

                  <p className="text-center font-bold text-lg text-primary">{residentResult.full_name}</p>

                  <p className="text-center">
                    is a bona fide resident of <strong>Barangay San Vicente, Olango Island, Lapu-Lapu City, Cebu</strong>, and is duly registered in the official records of this Barangay.
                  </p>

                  <p className="text-justify">
                    This certification is issued upon the request of the above-named resident to attest to their residency and may be used for any lawful purpose for which it may serve.
                  </p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-xs text-muted-foreground space-y-2">
                  <p className="font-bold text-foreground">PRIVACY NOTICE</p>
                  <p className="text-justify">
                    In accordance with the Data Privacy Act of 2012 (Republic Act No. 10173), all personal information and records of the above-named resident maintained by Barangay San Vicente are treated with the utmost confidentiality. Such information shall not be disclosed, reproduced, or shared with any unauthorized individual, organization, or entity without the prior consent of the resident, except as required or permitted by applicable laws and regulations.
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                  <div>
                    <p>Registered: {residentResult.created_date ? format(new Date(residentResult.created_date), "MMM d, yyyy") : "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-white ${residentResult.status === "Active" ? "bg-green-600" : "bg-gray-500"}`}>
                      {residentResult.status || "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  // Default — manual verification form
  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Shield className="w-10 h-10 mx-auto mb-3 text-secondary" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Document Verification</h1>
          <p className="opacity-80">Verify the authenticity of barangay-issued documents</p>
        </div>
      </section>

      <section className="py-16 max-w-xl mx-auto px-4">
        <div className="bg-card rounded-2xl border p-8 shadow-sm">
          <div className="text-center mb-6">
            <QrCode className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-xl font-bold mb-1">Enter Verification Code</h2>
            <p className="text-sm text-muted-foreground">Scan the QR code or enter the verification number from the document</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <Input
              placeholder="Enter verification code or control number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-lg"
            />
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Search className="w-4 h-4" />
              {loading ? "Verifying..." : "Verify Document"}
            </Button>
          </form>

          {searched && !loading && (
            <div className="mt-8">
              {result ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-lg text-green-800 mb-4">Document is VALID</h3>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex justify-between py-1 border-b border-green-100">
                      <span className="text-green-700">Document Type</span>
                      <span className="font-medium">{result.document_type}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-green-100">
                      <span className="text-green-700">Control Number</span>
                      <span className="font-medium">{result.control_number}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-green-100">
                      <span className="text-green-700">Applicant</span>
                      <span className="font-medium">{result.applicant_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-green-100">
                      <span className="text-green-700">Status</span>
                      <span className="font-medium">{result.status}</span>
                    </div>
                    {result.date_approved && (
                      <div className="flex justify-between py-1">
                        <span className="text-green-700">Date Issued</span>
                        <span className="font-medium">{format(new Date(result.date_approved), "MMMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-lg text-red-800 mb-1">Document NOT FOUND</h3>
                  <p className="text-sm text-red-600">The verification code does not match any issued document. Please check and try again.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}