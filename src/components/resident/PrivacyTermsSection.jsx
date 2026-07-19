import React, { useState } from "react";
import { ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PrivacyTermsSection() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <section className="py-6 max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-lg font-bold mb-4">Legal & Privacy</h2>
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Data Privacy Act Notice</p>
                <p className="text-xs text-muted-foreground mt-0.5">How we collect, use, and protect your personal information.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPrivacyOpen(true)}>Read More</Button>
          </div>

          <div className="border-t border-border" />

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Terms & Conditions</p>
                <p className="text-xs text-muted-foreground mt-0.5">Rules and guidelines for using the Resident Portal.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setTermsOpen(true)}>Read More</Button>
          </div>
        </div>
      </section>

      {/* Data Privacy Act Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Data Privacy Act Notice
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              In accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, Barangay San Vicente is committed to protecting the privacy and confidentiality of all personal information collected through this Resident Portal.
            </p>

            <div>
              <p className="font-semibold text-foreground mb-1">1. Information We Collect</p>
              <p>We collect personal information necessary for resident registration and barangay services, including but not limited to: full name, date of birth, gender, civil status, address, contact details, photograph, and valid identification documents.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">2. Purpose of Collection</p>
              <p>Your personal information is collected and used solely for: resident identification and verification, issuance of barangay certificates and clearances, record-keeping as required by law, and communication regarding barangay services and announcements.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">3. Data Security</p>
              <p>All personal information is stored securely and treated with the utmost confidentiality. Access is restricted to authorized barangay personnel only. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">4. Non-Disclosure</p>
              <p>Your personal information shall not be disclosed, reproduced, or shared with any unauthorized individual, organization, or entity without your prior consent, except as required or permitted by applicable laws and regulations.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">5. Your Rights</p>
              <p>As a data subject, you have the right to: be informed about how your data is used, access your personal information, rectify inaccurate data, and request the deletion of your data, subject to legal retention requirements.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">6. Consent</p>
              <p>By registering and using the Resident Portal, you acknowledge that you have read and understood this privacy notice and consent to the collection and processing of your personal information for the purposes stated herein.</p>
            </div>

            <p className="text-xs italic">For privacy concerns, please contact the Barangay San Vicente office directly.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms & Conditions Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Terms & Conditions
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Welcome to the Barangay San Vicente Resident Portal. By creating an account and using this platform, you agree to the following terms and conditions:</p>

            <div>
              <p className="font-semibold text-foreground mb-1">1. Eligibility</p>
              <p>You must be a bona fide resident of Barangay San Vicente, Olango Island, Lapu-Lapu City, Cebu to register and use this portal. You must provide accurate and truthful information at all times.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">2. Account Registration</p>
              <p>You are responsible for maintaining the confidentiality of your login credentials. You agree not to share your account with others or allow unauthorized access. All activities under your account are your responsibility.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">3. Acceptable Use</p>
              <p>You agree to use the portal only for lawful purposes. You shall not submit false or misleading information, abuse or disrupt portal services, attempt to access other users' data, or use the portal for any fraudulent activity.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">4. Document Requests</p>
              <p>All certificate and clearance requests submitted through the portal are subject to review and approval by the barangay office. Issuance of documents is at the discretion of authorized barangay officials. Fees, where applicable, must be settled at the barangay office.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">5. Digital Resident ID</p>
              <p>The Digital Resident ID issued through this portal is for identification purposes within Barangay San Vicente. It is non-transferable. Misuse, alteration, or falsification of the ID is punishable by law.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">6. Data Accuracy</p>
              <p>You are responsible for ensuring that your personal information remains accurate and up to date. Any changes must be promptly reflected through the Edit Profile feature or reported to the barangay office.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">7. Account Termination</p>
              <p>The barangay reserves the right to suspend or terminate accounts found in violation of these terms. You may request account deletion at any time, subject to legal record retention requirements.</p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">8. Updates to Terms</p>
              <p>Barangay San Vicente reserves the right to update these terms at any time. Continued use of the portal after changes constitutes acceptance of the updated terms.</p>
            </div>

            <p className="text-xs italic">For questions regarding these terms, please contact the Barangay San Vicente office.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}