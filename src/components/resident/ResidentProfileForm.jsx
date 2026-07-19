import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MobileSelect from "@/components/ui/MobileSelect";
import { Upload, Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const CIVIL_STATUS_OPTIONS = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Widowed", label: "Widowed" },
  { value: "Separated", label: "Separated" },
  { value: "Divorced", label: "Divorced" },
];

function computeAge(birthDate) {
  if (!birthDate) return "";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : "";
}

export default function ResidentProfileForm({ user, existing, onSaved }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: existing?.first_name || "",
    middle_name: existing?.middle_name || "",
    last_name: existing?.last_name || "",
    suffix: existing?.suffix || "",
    date_of_birth: existing?.date_of_birth || "",
    gender: existing?.gender || "",
    civil_status: existing?.civil_status || "",
    nationality: existing?.nationality || "Filipino",
    address: existing?.address || "",
    purok_sitio: existing?.purok_sitio || "",
    barangay: existing?.barangay || "San Vicente",
    municipality: existing?.municipality || "Lapu-Lapu City",
    province: existing?.province || "Cebu",
    contact_number: existing?.contact_number || "",
    email: existing?.email || user?.email || "",
    occupation: existing?.occupation || "",
    emergency_contact: existing?.emergency_contact || "",
    photo_url: existing?.photo_url || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "date_of_birth" ? { age: computeAge(value) } : {}),
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange("photo_url", file_url);
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fullName = [form.first_name, form.middle_name, form.last_name, form.suffix].filter(Boolean).join(" ");
      const age = computeAge(form.date_of_birth);
      const data = { ...form, full_name: fullName, age, email: user.email };

      if (existing) {
        await base44.entities.Resident.update(existing.id, data);
        toast({ title: "Profile updated successfully" });
      } else {
        const year = new Date().getFullYear();
        const residents = await base44.entities.Resident.list("-created_date", 1000);
        data.resident_id = `SV-${year}-${String(residents.length + 1).padStart(8, "0")}`;
        await base44.entities.Resident.create(data);
        toast({ title: "Profile created!", description: `Resident ID: ${data.resident_id}` });
      }
      onSaved?.();
    } catch {
      toast({ title: "Failed to save profile", variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div className="flex flex-col items-center gap-2">
        <label className="cursor-pointer">
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
            {form.photo_url ? (
              <img src={form.photo_url} alt="Profile" className="w-24 h-28 rounded-lg mx-auto object-cover" />
            ) : (
              <div className="w-24 h-28 rounded-lg mx-auto bg-muted flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">{uploading ? "Uploading..." : "Click to upload 2x2 photo"}</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
        </label>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="font-heading text-sm font-bold mb-3 text-primary">Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>First Name *</Label>
            <Input value={form.first_name} onChange={(e) => handleChange("first_name", e.target.value)} required />
          </div>
          <div>
            <Label>Middle Name</Label>
            <Input value={form.middle_name} onChange={(e) => handleChange("middle_name", e.target.value)} />
          </div>
          <div>
            <Label>Last Name *</Label>
            <Input value={form.last_name} onChange={(e) => handleChange("last_name", e.target.value)} required />
          </div>
          <div>
            <Label>Suffix</Label>
            <Input value={form.suffix} onChange={(e) => handleChange("suffix", e.target.value)} placeholder="Jr., Sr., III" />
          </div>
          <div>
            <Label>Birth Date *</Label>
            <Input type="date" value={form.date_of_birth} onChange={(e) => handleChange("date_of_birth", e.target.value)} required />
          </div>
          <div>
            <Label>Age</Label>
            <Input value={form.age || computeAge(form.date_of_birth)} disabled placeholder="Auto-computed" />
          </div>
          <div>
            <Label>Sex *</Label>
            <MobileSelect value={form.gender} onValueChange={(v) => handleChange("gender", v)} placeholder="Select sex" options={GENDER_OPTIONS} />
          </div>
          <div>
            <Label>Civil Status *</Label>
            <MobileSelect value={form.civil_status} onValueChange={(v) => handleChange("civil_status", v)} placeholder="Select status" options={CIVIL_STATUS_OPTIONS} />
          </div>
          <div>
            <Label>Nationality</Label>
            <Input value={form.nationality} onChange={(e) => handleChange("nationality", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="font-heading text-sm font-bold mb-3 text-primary">Address</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Label>Complete Address *</Label>
            <Input value={form.address} onChange={(e) => handleChange("address", e.target.value)} required placeholder="House no., street" />
          </div>
          <div>
            <Label>Purok / Sitio</Label>
            <Input value={form.purok_sitio} onChange={(e) => handleChange("purok_sitio", e.target.value)} />
          </div>
          <div>
            <Label>Barangay</Label>
            <Input value={form.barangay} onChange={(e) => handleChange("barangay", e.target.value)} />
          </div>
          <div>
            <Label>Municipality / City</Label>
            <Input value={form.municipality} onChange={(e) => handleChange("municipality", e.target.value)} />
          </div>
          <div>
            <Label>Province</Label>
            <Input value={form.province} onChange={(e) => handleChange("province", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="font-heading text-sm font-bold mb-3 text-primary">Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Contact Number *</Label>
            <Input value={form.contact_number} onChange={(e) => handleChange("contact_number", e.target.value)} required placeholder="0912-345-6789" />
          </div>
          <div>
            <Label>Email Address</Label>
            <Input value={form.email} disabled className="bg-muted/50" />
          </div>
          <div>
            <Label>Occupation</Label>
            <Input value={form.occupation} onChange={(e) => handleChange("occupation", e.target.value)} />
          </div>
          <div>
            <Label>Emergency Contact *</Label>
            <Input value={form.emergency_contact} onChange={(e) => handleChange("emergency_contact", e.target.value)} required placeholder="Name - 0912-345-6789" />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2" disabled={saving || uploading}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Saving..." : existing ? "Update Profile" : "Create Profile"}
      </Button>
    </form>
  );
}