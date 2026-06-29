import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Image, Loader2, Phone, AlertTriangle } from "lucide-react";
import DisasterSettings from "@/components/admin/DisasterSettings";
import { useToast } from "@/components/ui/use-toast";

const PHOTO_KEYS = [
  { key: "photo_hero", label: "Hero Banner (Home Page)", description: "Main photo shown on the homepage hero section" },
  { key: "photo_about", label: "About Page Photo", description: "Photo shown in the About / History section" },
  { key: "photo_tourism_1", label: "Tourism – Attraction 1", description: "Olango Island Wildlife Sanctuary" },
  { key: "photo_tourism_2", label: "Tourism – Attraction 2", description: "Beautiful Beaches" },
  { key: "photo_tourism_3", label: "Tourism – Attraction 3", description: "Marine Sanctuaries" },
  { key: "photo_tourism_4", label: "Tourism – Attraction 4", description: "Local Culture & Heritage" },
];

const CONTACT_KEYS = [
  { key: "phone_main", label: "Main Phone / Barangay Hall", placeholder: "e.g. 0917-123-4567" },
  { key: "phone_emergency", label: "Barangay Emergency Hotline", placeholder: "e.g. 0917-123-4567" },
  { key: "phone_police", label: "Police Station", placeholder: "e.g. 0917-123-4567" },
  { key: "phone_fire", label: "Fire Department", placeholder: "e.g. 0917-123-4567" },
  { key: "phone_medical", label: "Medical Emergency", placeholder: "e.g. 0917-123-4567" },
  { key: "contact_email", label: "Email Address", placeholder: "e.g. brgy.sanvicente@gmail.com" },
  { key: "contact_hours", label: "Office Hours", placeholder: "e.g. Mon–Fri: 8:00 AM – 5:00 PM" },
];

async function saveSetting(key, value, existingId) {
  const res = await base44.functions.invoke('adminSettingsApi', { action: 'save', key, value, existingId });
  return res.data;
}

export default function SitePhotosManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState({});
  const [previews, setPreviews] = useState({});

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: async () => {
      const res = await base44.functions.invoke('adminSettingsApi', { action: 'list' });
      return res.data || [];
    },
  });

  const getSettingValue = (key) => {
    const s = settings.find((s) => s.setting_key === key);
    return s ? { value: s.setting_value, id: s.id } : { value: "", id: null };
  };

  const saveMutation = useMutation({
    mutationFn: ({ key, value, id }) => saveSetting(key, value, id),
    onMutate: async ({ key, value, id }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-photos"] });
      const previous = queryClient.getQueryData(["admin-photos"]);
      // Only optimistically update existing records; new records are handled on success
      if (id) {
        queryClient.setQueryData(["admin-photos"], (old = []) =>
          old.map((s) => s.setting_key === key ? { ...s, setting_value: value } : s)
        );
      }
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
      toast({ title: "Saved successfully!" });
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin-photos"], context.previous);
      }
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    },
  });

  const handleFileUpload = async (key, file) => {
    if (!file) return;
    setUploading((p) => ({ ...p, [key]: true }));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const { id } = getSettingValue(key);
    await saveMutation.mutateAsync({ key, value: file_url, id });
    setPreviews((p) => ({ ...p, [key]: null }));
    setUploading((p) => ({ ...p, [key]: false }));
  };

  const handleUrlSave = async (key, url) => {
    const { id } = getSettingValue(key);
    await saveMutation.mutateAsync({ key, value: url, id });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage photos, contact info, and disaster preparedness content for the public website.</p>
      </div>

      <Tabs defaultValue="photos">
        <TabsList className="mb-6">
          <TabsTrigger value="photos" className="gap-2"><Image className="w-4 h-4" />Photos</TabsTrigger>
          <TabsTrigger value="contact" className="gap-2"><Phone className="w-4 h-4" />Contact Info</TabsTrigger>
          <TabsTrigger value="disaster" className="gap-2"><AlertTriangle className="w-4 h-4" />Disaster Preparedness</TabsTrigger>
        </TabsList>

        {/* PHOTOS TAB */}
        <TabsContent value="photos">
          <div className="grid gap-6">
            {PHOTO_KEYS.map(({ key, label, description }) => {
              const { value: currentUrl } = getSettingValue(key);
              const previewUrl = previews[key] || currentUrl;

              return (
                <Card key={key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">{label}</CardTitle>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-48 h-32 rounded-xl border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                        {previewUrl ? (
                          <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-8 h-8 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label className="text-xs mb-1 block">Upload from device</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              className="text-xs"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(file) }));
                                  handleFileUpload(key, file);
                                }
                              }}
                            />
                            {uploading[key] && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">Or paste image URL</Label>
                          <UrlInput
                            defaultValue={currentUrl}
                            onSave={(url) => handleUrlSave(key, url)}
                            onPreview={(url) => setPreviews((p) => ({ ...p, [key]: url }))}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* CONTACT INFO TAB */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Phone Numbers & Contact Details</CardTitle>
              <p className="text-xs text-muted-foreground">These will appear on the Contact page, Emergency Hotlines section, footer, and navbar.</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5">
                {CONTACT_KEYS.map(({ key, label, placeholder }) => {
                  const { value: currentVal, id } = getSettingValue(key);
                  return (
                    <ContactFieldInput
                      key={key}
                      label={label}
                      placeholder={placeholder}
                      defaultValue={currentVal}
                      onSave={(val) => saveMutation.mutateAsync({ key, value: val, id })}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* DISASTER TAB */}
        <TabsContent value="disaster">
          <DisasterSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UrlInput({ defaultValue, onSave, onPreview }) {
  const [value, setValue] = useState(defaultValue || "");
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => { setValue(e.target.value); onPreview(e.target.value); }}
        placeholder="https://..."
        className="text-xs"
      />
      <Button size="sm" onClick={() => onSave(value)} disabled={!value}>
        <Save className="w-3 h-3 mr-1" />Save
      </Button>
    </div>
  );
}

function ContactFieldInput({ label, placeholder, defaultValue, onSave }) {
  const [value, setValue] = useState(defaultValue || "");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await onSave(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-1.5 block">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
        <Button size="sm" onClick={handleSave} variant={saved ? "outline" : "default"} className="shrink-0">
          <Save className="w-3 h-3 mr-1" />
          {saved ? "Saved!" : "Save"}
        </Button>
      </div>
    </div>
  );
}