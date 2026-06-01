import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const categories = ["All", "Announcement", "News", "Advisory", "Event", "Health", "Disaster", "General"];

export default function News() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: news = [], isLoading } = useQuery({
    queryKey: ["news-list"],
    queryFn: () => base44.entities.NewsArticle.filter({ is_published: true }, "-created_date"),
  });

  const filtered = news.filter((a) => {
    const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || a.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">News & Announcements</h1>
          <p className="opacity-80">Stay informed about the latest updates from Barangay San Vicente</p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={category === cat ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Articles */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border p-5 animate-pulse">
                <div className="h-40 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Tag className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No articles found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all group"
              >
                {article.featured_image && (
                  <div className="h-48 overflow-hidden">
                    <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">{article.category || "General"}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(article.publish_date || article.created_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt || article.content?.substring(0, 150)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}