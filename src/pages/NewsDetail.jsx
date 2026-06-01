import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function NewsDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = window.location.pathname.split("/news/")[1];

  const { data: article, isLoading } = useQuery({
    queryKey: ["news-detail", id],
    queryFn: async () => {
      const list = await base44.entities.NewsArticle.filter({ id });
      return list[0];
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-10 bg-muted rounded w-3/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Article not found.</p>
        <Link to="/news"><Button variant="outline">← Back to News</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/news">
        <Button variant="ghost" size="sm" className="mb-6 gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Button>
      </Link>

      <article>
        <div className="flex items-center gap-2 mb-4">
          <Badge>{article.category || "General"}</Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(article.publish_date || article.created_date), "MMMM d, yyyy")}
          </span>
          {article.author && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" /> {article.author}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-6">{article.title}</h1>

        {article.featured_image && (
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-72 object-cover rounded-2xl mb-8"
          />
        )}

        <div className="prose prose-sm max-w-none text-foreground">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}