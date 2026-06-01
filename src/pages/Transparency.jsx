import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const categories = ["All", "Budget", "Financial Statement", "Procurement", "Resolution", "Development Plan", "Other"];

export default function Transparency() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const { data: docs = [] } = useQuery({
    queryKey: ["transparency-docs"],
    queryFn: () => base44.entities.Document.filter({ is_public: true }, "-created_date"),
  });

  const transparencyDocs = docs.filter((d) => ["Budget", "Financial Statement", "Procurement", "Resolution", "Development Plan", "Other"].includes(d.category));
  const filtered = transparencyDocs.filter((d) => {
    const matchSearch = !search || d.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || d.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Eye className="w-8 h-8 mx-auto mb-3 text-secondary" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Transparency Portal</h1>
          <p className="opacity-80">Access public documents, budget reports, and governance information</p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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
            <p>No documents available at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-card rounded-xl border hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{doc.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{doc.category}</Badge>
                      <span className="text-xs text-muted-foreground">{format(new Date(doc.created_date), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-1">
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