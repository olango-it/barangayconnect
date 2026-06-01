import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function MessageManager() {
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => base44.entities.ContactMessage.list("-created_date"),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.update(id, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Messages</h1>
      {messages.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`bg-card rounded-xl border p-5 ${!m.is_read ? "border-primary/30 bg-primary/5" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{m.name}</p>
                      {!m.is_read && <Badge className="text-xs bg-primary">New</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.email} • {format(new Date(m.created_date), "MMM d, yyyy HH:mm")}</p>
                    {m.subject && <p className="text-sm font-medium mt-2">{m.subject}</p>}
                    <p className="text-sm text-muted-foreground mt-1">{m.message}</p>
                  </div>
                </div>
                {!m.is_read && (
                  <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={() => markReadMutation.mutate(m.id)}>
                    <Check className="w-3 h-3" /> Mark Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}