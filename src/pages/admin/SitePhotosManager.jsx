import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Save, Image, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PHOTO_KEYS = [
  { key: "photo_hero", label: "Hero Banner (Home Page)", description: "Main photo shown on the homepage hero section" },
  { key: "photo_about", label: "About Page Photo", description: "Photo shown in the About / History section" },
  { key: "photo_tourism_1", label: "Tourism – Attraction 1", description: "Olango Island Wildlife Sanctuary" },
  { key: "photo_tourism_2", label: "Tourism – Attraction 2", description: "Beautiful Beaches" },
  { key: "photo_tourism_3", label: "Tourism – Attraction 3", description: "Marine Sanctuaries" },
  { key: "photo_tourism_4", label: "Tourism – Attraction 4", description: "Local Culture & Heritage" },
];

async function getSetting(key) {
  const results = await base44.entities.AdminSettings.filter({ setting_key: key });
  return results[0] || null;
}

async function saveSetting(key, value, existingId) {
  if (existingId) {
    return base44.entities.AdminSettings.update(existingId, { setting_value: value });
  } else {
    return base44.entities.AdminSettings.create({ setting_key: key, setting_value: value, setting_type: "text" });
  }
}

export default function SitePhotosManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState({});
  const [previews, setPreviews] = useState({});

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: () => base44.entities.AdminSettings.filter({}),
  });

  const getSettingValue = (key) => {
    const s = settings.find((s) => s.setting_key === key);
    return s ? { value: s.setting_value, id: s.id } : { value: "", id: null };
  };

  const saveMutation = useMutation({
    mutationFn: ({ key, value, id }) => saveSetting(key, value, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
      toast({ title: "Photo saved successfully!" });
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
        <h1 className="text-2xl font-heading font-bold">Site Photos</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload or paste URLs to change photos shown on the public website.</p>
      </div>

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
                  {/* Preview */}
                  <div className="w-full sm:w-48 h-32 rounded-xl border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                    {previewUrl ? (
                      <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="w-8 h-8 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Controls */}
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
    </div>
  );
}

function UrlInput({ defaultValue, onSave, onPreview }) {
  const [value, setValue] = useState(defaultValue || "");

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onPreview(e.target.value);
        }}
        placeholder="https://..."
        className="text-xs"
      />
      <Button size="sm" onClick={() => onSave(value)} disabled={!value}>
        <Save className="w-3 h-3 mr-1" />
        Save
      </Button>
    </div>
  );
}