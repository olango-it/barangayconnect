import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCog, Edit2, Plus, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const roles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "secretary", label: "Barangay Secretary" },
  { value: "records_officer", label: "Records Officer" },
  { value: "front_desk", label: "Front Desk Staff" },
];

export default function StaffManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("front_desk");
  const [inviting, setInviting] = useState(false);
  const [editForm, setEditForm] = useState({ role: "", position: "", employee_id: "", contact_number: "", status: "active" });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => base44.entities.User.list(),
  });

  const staffUsers = users.filter((u) => u.role && u.role !== "user");

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Staff Updated" });
      setDialogOpen(false);
    },
  });

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    await base44.users.inviteUser(inviteEmail, inviteRole === "super_admin" ? "admin" : "admin");
    toast({ title: "Invitation Sent", description: `Invitation sent to ${inviteEmail}. Please update their role after they register.` });
    setInviteEmail("");
    setInviting(false);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({
      role: u.role || "front_desk",
      position: u.position || "",
      employee_id: u.employee_id || "",
      contact_number: u.contact_number || "",
      status: u.status || "active",
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Staff Management</h1>

      {/* Invite Staff */}
      <div className="bg-card rounded-xl border p-5">
        <h3 className="font-medium text-sm mb-3">Invite New Staff</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="flex-1" />
          <Select value={inviteRole} onValueChange={setInviteRole}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {roles.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleInvite} disabled={inviting} className="gap-2">
            <Plus className="w-4 h-4" /> {inviting ? "Sending..." : "Invite"}
          </Button>
        </div>
      </div>

      {/* Staff List */}
      {staffUsers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UserCog className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No staff members yet. Invite someone above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {staffUsers.map((u) => (
            <div key={u.id} className="bg-card rounded-xl border p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{u.full_name || u.email}</p>
                  <p className="text-xs text-muted-foreground">{u.email} {u.employee_id && `• ID: ${u.employee_id}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize text-xs">{u.role?.replace("_", " ")}</Badge>
                <Badge variant={u.status === "disabled" ? "destructive" : "default"} className="text-xs">{u.status || "active"}</Badge>
                <Button variant="ghost" size="sm" onClick={() => openEdit(u)}><Edit2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Staff: {editUser?.full_name}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: editUser.id, data: editForm }); }} className="space-y-4">
            <div><Label>Role</Label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Position</Label><Input value={editForm.position} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} /></div>
            <div><Label>Employee ID</Label><Input value={editForm.employee_id} onChange={(e) => setEditForm({ ...editForm, employee_id: e.target.value })} /></div>
            <div><Label>Contact Number</Label><Input value={editForm.contact_number} onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })} /></div>
            <div><Label>Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Update"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}