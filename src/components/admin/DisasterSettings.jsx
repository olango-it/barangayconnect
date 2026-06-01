import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const DEFAULT_CONTACTS = [
  { name: "Barangay Emergency Hotline", number: "0917-XXX-XXXX" },
  { name: "Municipal DRRMO", number: "0917-XXX-XXXX" },
  { name: "PNP Lapu-Lapu", number: "(032) XXX-XXXX" },
  { name: "BFP Lapu-Lapu", number: "(032) XXX-XXXX" },
  { name: "Red Cross Cebu", number: "(032) 253-6525" },
  { name: "National Emergency Hotline", number: "911" },
];

const DEFAULT_CENTERS = [
  "San Vicente Elementary School",
  "Barangay Hall",
  "San Vicente Chapel",
];

const DEFAULT_GUIDES = [
  { title: "Typhoon Preparedness", items: ["Secure your home and roof", "Store food and water for 3 days", "Keep flashlights and batteries ready", "Know your evacuation route", "Listen to official announcements"] },
  { title: "Earthquake Safety", items: ["Drop, Cover, and Hold On", "Stay away from glass and heavy objects", "Move to open area after shaking stops", "Check for injuries and damage", "Be prepared for aftershocks"] },
  { title: "Flood Preparedness", items: ["Know your area's flood risk", "Move to higher ground when warned", "Never walk through floodwaters", "Secure important documents", "Have emergency supplies ready"] },
];

async function saveSetting(key, value, existingId) {
  if (existingId) {
    return base44.entities.AdminSettings.update(existingId, { setting_value: value });
  }
  return base44.entities.AdminSettings.create({ setting_key: key, setting_value: value, setting_type: "json" });
}

export default function DisasterSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: () => base44.entities.AdminSettings.filter({}),
  });

  const getSetting = (key, def) => {
    const s = settings.find((s) => s.setting_key === key);
    try { return s ? { value: JSON.parse(s.setting_value), id: s.id } : { value: def, id: null }; }
    catch { return { value: def, id: null }; }
  };

  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [centers, setCenters] = useState(DEFAULT_CENTERS);
  const [guides, setGuides] = useState(DEFAULT_GUIDES);

  useEffect(() => {
    if (settings.length) {
      setContacts(getSetting("disaster_contacts", DEFAULT_CONTACTS).value);
      setCenters(getSetting("disaster_centers", DEFAULT_CENTERS).value);
      setGuides(getSetting("disaster_guides", DEFAULT_GUIDES).value);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: ({ key, value, id }) => saveSetting(key, JSON.stringify(value), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-photos"] });
      toast({ title: "Saved!" });
    },
  });

  const saveAll = () => {
    saveMutation.mutate({ key: "disaster_contacts", value: contacts, id: getSetting("disaster_contacts", null).id });
    saveMutation.mutate({ key: "disaster_centers", value: centers, id: getSetting("disaster_centers", null).id });
    saveMutation.mutate({ key: "disaster_guides", value: guides, id: getSetting("disaster_guides", null).id });
  };

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <div className="space-y-6">

      {/* Emergency Contacts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Emergency Contacts</CardTitle>
          <p className="text-xs text-muted-foreground">Contacts shown on the Disaster Preparedness page.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {contacts.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={c.name}
                onChange={(e) => { const n = [...contacts]; n[i] = { ...n[i], name: e.target.value }; setContacts(n); }}
                placeholder="Name"
                className="flex-1"
              />
              <Input
                value={c.number}
                onChange={(e) => { const n = [...contacts]; n[i] = { ...n[i], number: e.target.value }; setContacts(n); }}
                placeholder="Number"
                className="w-40"
              />
              <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => setContacts(contacts.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" className="gap-1 mt-1" onClick={() => setContacts([...contacts, { name: "", number: "" }])}>
            <Plus className="w-3 h-3" /> Add Contact
          </Button>
        </CardContent>
      </Card>

      {/* Evacuation Centers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Evacuation Centers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {centers.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={c}
                onChange={(e) => { const n = [...centers]; n[i] = e.target.value; setCenters(n); }}
                placeholder="Evacuation center name"
                className="flex-1"
              />
              <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => setCenters(centers.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" className="gap-1 mt-1" onClick={() => setCenters([...centers, ""])}>
            <Plus className="w-3 h-3" /> Add Center
          </Button>
        </CardContent>
      </Card>

      {/* Preparedness Guides */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preparedness Guides</CardTitle>
          <p className="text-xs text-muted-foreground">Typhoon, Earthquake, Flood guides etc.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {guides.map((g, gi) => (
            <div key={gi} className="border rounded-lg p-4 space-y-3">
              <div className="flex gap-2 items-center">
                <Input
                  value={g.title}
                  onChange={(e) => { const n = [...guides]; n[gi] = { ...n[gi], title: e.target.value }; setGuides(n); }}
                  placeholder="Guide title"
                  className="font-medium"
                />
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => setGuides(guides.filter((_, idx) => idx !== gi))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1.5 pl-2">
                {g.items.map((item, ii) => (
                  <div key={ii} className="flex gap-2 items-center">
                    <span className="text-xs text-muted-foreground w-5 shrink-0">{ii + 1}.</span>
                    <Input
                      value={item}
                      onChange={(e) => {
                        const n = [...guides]; n[gi] = { ...n[gi], items: [...n[gi].items] }; n[gi].items[ii] = e.target.value; setGuides(n);
                      }}
                      placeholder="Guide item"
                      className="text-sm"
                    />
                    <Button size="icon" variant="ghost" className="text-destructive shrink-0 h-7 w-7" onClick={() => {
                      const n = [...guides]; n[gi] = { ...n[gi], items: n[gi].items.filter((_, idx) => idx !== ii) }; setGuides(n);
                    }}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="ghost" className="text-xs gap-1 mt-1" onClick={() => {
                  const n = [...guides]; n[gi] = { ...n[gi], items: [...n[gi].items, ""] }; setGuides(n);
                }}>
                  <Plus className="w-3 h-3" /> Add item
                </Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" className="gap-1" onClick={() => setGuides([...guides, { title: "", items: [""] }])}>
            <Plus className="w-3 h-3" /> Add Guide Section
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveAll} disabled={saveMutation.isPending} className="gap-2">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}