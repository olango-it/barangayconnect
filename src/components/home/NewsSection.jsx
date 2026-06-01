import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function NewsSection() {
  const { data: news = [] } = useQuery({
    queryKey: ["public-news"],
    queryFn: () => base44.entities.NewsArticle.filter({ is_published: true }, "-created_date", 3),
  });

  if (news.length === 0) return null;

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">Latest News & Announcements</h2>
            <p className="text-muted-foreground text-sm">Stay updated with community news</p>
          </div>
          <Link to="/news" className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <Link
              key={article.id}
              to={`/news/${article.id}`}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {article.featured_image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">{article.category || "General"}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.publish_date ? format(new Date(article.publish_date), "MMM d, yyyy") : format(new Date(article.created_date), "MMM d, yyyy")}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt || article.content?.substring(0, 150)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link to="/news" className="sm:hidden flex items-center justify-center gap-1 text-sm text-primary font-medium mt-6 hover:underline">
          View All News <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}