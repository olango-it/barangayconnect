import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { QrCode, Search, CheckCircle2, XCircle, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Verify() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setSearched(true);

    const docs = await base44.entities.CertificateRequest.filter({ qr_verification_code: code.trim() });
    if (docs.length > 0) {
      setResult(docs[0]);
    } else {
      // Try by control number
      const byControl = await base44.entities.CertificateRequest.filter({ control_number: code.trim() });
      setResult(byControl.length > 0 ? byControl[0] : null);
    }
    setLoading(false);
  };

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