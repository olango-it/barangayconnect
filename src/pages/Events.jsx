import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Events() {
  const { data: events = [] } = useQuery({
    queryKey: ["public-events"],
    queryFn: () => base44.entities.Event.filter({ is_published: true }, "-event_date"),
  });

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Events Calendar</h1>
          <p className="opacity-80">Community activities and upcoming events</p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4">
        {events.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No upcoming events at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow flex gap-5 items-start">
                <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-xl shrink-0">
                  <span className="text-xs text-primary font-medium uppercase">
                    {event.event_date ? format(new Date(event.event_date), "MMM") : "TBD"}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {event.event_date ? format(new Date(event.event_date), "d") : "—"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">{event.category || "General"}</Badge>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-1">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {event.event_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {format(new Date(event.event_date), "MMMM d, yyyy")}
                      </span>
                    )}
                    {event.start_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {event.start_time}{event.end_time ? ` – ${event.end_time}` : ""}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}