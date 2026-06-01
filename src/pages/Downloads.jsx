import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Search, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const categories = ["All", "Form", "Report", "Ordinance", "Citizens Charter", "Other"];

export default function Downloads() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const { data: docs = [] } = useQuery({
    queryKey: ["download-docs"],
    queryFn: () => base44.entities.Document.filter({ is_public: true }, "-created_date"),
  });

  const downloadDocs = docs.filter((d) => ["Form", "Report", "Ordinance", "Citizens Charter", "Other"].includes(d.category));
  const filtered = downloadDocs.filter((d) => {
    const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || d.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <FolderOpen className="w-8 h-8 mx-auto mb-3 text-secondary" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Downloads Center</h1>
          <p className="opacity-80">Download forms, reports, ordinances, and other public documents</p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge key={c} variant={cat === c ? "default" : "outline"} className="cursor-pointer" onClick={() => setCat(c)}>{c}</Badge>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No files available for download.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doc) => (
              <div key={doc.id} className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">{doc.title}</h3>
                    <Badge variant="secondary" className="text-xs">{doc.category}</Badge>
                  </div>
                </div>
                {doc.description && <p className="text-xs text-muted-foreground mb-3">{doc.description}</p>}
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full gap-1">
                      <Download className="w-3 h-3" /> Download
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}