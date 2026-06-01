import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Users, TrendingUp, Search, Trash2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, startOfDay, subDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function ChatDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: chats = [] } = useQuery({
    queryKey: ["admin-chats"],
    queryFn: () => base44.entities.ChatHistory.list("-created_date", 200),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ChatHistory.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-chats"] }); toast({ title: "Deleted" }); },
  });

  const today = startOfDay(new Date()).getTime();
  const weekAgo = subDays(new Date(), 7).getTime();

  const totalConvos = new Set(chats.map(c => c.session_id)).size;
  const dailyMsgs = chats.filter(c => new Date(c.created_date).getTime() >= today).length;
  const weeklyMsgs = chats.filter(c => new Date(c.created_date).getTime() >= weekAgo).length;

  // Most asked questions (by keyword frequency)
  const wordFreq = {};
  chats.forEach(c => {
    c.question?.split(/\s+/).forEach(w => {
      if (w.length > 4) wordFreq[w.toLowerCase()] = (wordFreq[w.toLowerCase()] || 0) + 1;
    });
  });
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const filtered = chats.filter(c =>
    !search || c.question?.toLowerCase().includes(search.toLowerCase()) || c.session_id?.includes(search)
  );

  const exportCsv = () => {
    const rows = [["Session", "Question", "Answer", "Time"]];
    filtered.forEach(c => rows.push([c.session_id, c.question, c.answer, c.created_date]));
    const csv = rows.map(r => r.map(v => `"${(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "chat_history.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Chat Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Conversations", value: totalConvos, icon: Users },
          { label: "Messages Today", value: dailyMsgs, icon: MessageSquare },
          { label: "This Week", value: weeklyMsgs, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card rounded-xl border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Top Keywords */}
      {topWords.length > 0 && (
        <div className="bg-card rounded-xl border p-4">
          <h3 className="font-medium text-sm mb-3">Most Frequent Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {topWords.map(([word, count]) => (
              <span key={word} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{word} ({count})</span>
            ))}
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv} className="gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground"><MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No conversations yet.</p></div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filtered.map((c) => (
              <div key={c.id} className="bg-card rounded-xl border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{c.session_id?.substring(0, 12)}...</span>
                      <span className="text-xs text-muted-foreground">{c.created_date ? format(new Date(c.created_date), "MMM d, HH:mm") : ""}</span>
                    </div>
                    <p className="text-sm font-medium text-primary">Q: {c.question}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">A: {c.answer}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(c.id)} className="text-destructive shrink-0"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}