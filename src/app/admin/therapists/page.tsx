"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { FormField } from "@/components/shared/forms/FormField";
import { TextInput } from "@/components/shared/forms/TextInput";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState([
    { id: 1, name: "Dr. Sarah Jenkins", email: "sarah@example.com", status: "Active", activeClients: 12 },
    { id: 2, name: "Mark Thompson", email: "mark@example.com", status: "Invited", activeClients: 0 },
  ]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archivingTherapist, setArchivingTherapist] = useState<any>(null);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTherapists([...therapists, {
      id: Date.now(),
      name: inviteName,
      email: inviteEmail,
      status: "Invited",
      activeClients: 0
    }]);
    setIsInviteOpen(false);
    setInviteEmail("");
    setInviteName("");
  };

  const handleConfirmArchive = () => {
    if (archivingTherapist) {
      setTherapists(therapists.filter(t => t.id !== archivingTherapist.id));
    }
    setIsArchiveOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Therapists"
          description="Manage your practice's therapy team."
        />
        <Button onClick={() => setIsInviteOpen(true)}>Invite Therapist</Button>
      </div>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px] bg-panel-bg text-panel-text border-panel-border">
          <DialogHeader>
            <DialogTitle>Invite Therapist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <FormField label="Full Name" htmlFor="name" required>
              <TextInput id="name" value={inviteName} onChange={e => setInviteName(e.target.value)} required />
            </FormField>
            <FormField label="Email Address" htmlFor="email" required>
              <TextInput id="email" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
            </FormField>
            <DialogFooter>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isArchiveOpen}
        onOpenChange={setIsArchiveOpen}
        title="Archive Therapist"
        description={`Are you sure you want to archive ${archivingTherapist?.name}?\n\nWarning: This therapist currently has ${archivingTherapist?.activeClients} active client(s). They must be reassigned.`}
        confirmLabel="Archive"
        variant="destructive"
        onConfirm={handleConfirmArchive}
      />

      <div className="bg-panel-bg border border-panel-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-contrast-bg text-canvas-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Active Clients</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-border">
            {therapists.map(t => (
              <tr key={t.id} className="hover:bg-contrast-bg/50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/therapists/${t.id}`} className="hover:underline">
                    {t.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-panel-muted">{t.email}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-panel-muted">{t.activeClients}</td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/therapists/${t.id}`}>View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setArchivingTherapist(t); setIsArchiveOpen(true); }}
                        className="text-state-danger-text"
                      >
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {therapists.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-panel-muted">
                  No therapists found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
