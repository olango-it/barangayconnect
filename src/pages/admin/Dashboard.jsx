import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, Clock, CheckCircle2, Package, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: residents = [] } = useQuery({
    queryKey: ["admin-residents-count"],
    queryFn: () => base44.entities.Resident.filter({ status: "Active" }),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: () => base44.entities.CertificateRequest.list("-created_date", 100),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events-upcoming"],
    queryFn: () => base44.entities.Event.list("-event_date", 5),
  });

  const { data: recentLogs = [] } = useQuery({
    queryKey: ["admin-recent-logs"],
    queryFn: () => base44.entities.AuditLog.list("-created_date", 10),
  });

  const today = new Date().toISOString().split("T")[0];
  const todayCerts = requests.filter((r) => r.date_approved === today || (r.status === "Approved" && r.created_date?.startsWith(today)));
  const pending = requests.filter((r) => r.status === "New" || r.status === "Pending");
  const approved = requests.filter((r) => r.status === "Approved");
  const released = requests.filter((r) => r.status === "Released");

  const stats = [
    { icon: Users, label: "Total Residents", value: residents.length, color: "text-blue-600 bg-blue-50" },
    { icon: FileText, label: "Certificates Today", value: todayCerts.length, color: "text-green-600 bg-green-50" },
    { icon: Clock, label: "Pending Requests", value: pending.length, color: "text-yellow-600 bg-yellow-50" },
    { icon: CheckCircle2, label: "Approved", value: approved.length, color: "text-emerald-600 bg-emerald-50" },
    { icon: Package, label: "Released", value: released.length, color: "text-purple-600 bg-purple-50" },
    { icon: TrendingUp, label: "Total Requests", value: requests.length, color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of Barangay San Vicente operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.slice(0, 5).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No requests yet</p>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 5).map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{req.applicant_name}</p>
                      <p className="text-xs text-muted-foreground">{req.document_type}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{req.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {events.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{evt.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {evt.event_date ? format(new Date(evt.event_date), "MMM d, yyyy") : "TBD"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 p-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium">{log.action}</span>
                    {log.details && <span className="text-muted-foreground"> – {log.details}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {log.created_date ? format(new Date(log.created_date), "MMM d, HH:mm") : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}