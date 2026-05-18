"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/forms/FormField";
import { TextInput } from "@/components/shared/forms/TextInput";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your practice settings, policies, and configuration."
      />

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="practice">Practice Details</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="appointmentTypes">Appointment Types</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="practice">
          <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
            <h3 className="text-lg font-medium">Practice Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Practice Name" htmlFor="practiceName">
                <TextInput id="practiceName" defaultValue="Canterbury Therapy Clinic" />
              </FormField>
              <FormField label="Address" htmlFor="address">
                <TextInput id="address" defaultValue="123 High Street, Canterbury, CT1 2AB" />
              </FormField>
              <FormField label="Contact Email" htmlFor="email">
                <TextInput id="email" type="email" defaultValue="admin@canterburytherapy.com" />
              </FormField>
              <FormField label="Phone Number" htmlFor="phone">
                <TextInput id="phone" defaultValue="01227 123456" />
              </FormField>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="policies">
          <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
            <h3 className="text-lg font-medium">Policy Defaults</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Cancellation Notice (Hours)" htmlFor="cancelNotice">
                <TextInput id="cancelNotice" type="number" defaultValue="48" />
              </FormField>
              <FormField label="Buffer Time (Minutes)" htmlFor="bufferTime">
                <TextInput id="bufferTime" type="number" defaultValue="15" />
              </FormField>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
            <h3 className="text-lg font-medium">Portal Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Primary Colour (Hex)" htmlFor="primaryColor">
                <TextInput id="primaryColor" defaultValue="#0f172a" />
              </FormField>
              <FormField label="Logo URL" htmlFor="logoUrl">
                <TextInput id="logoUrl" defaultValue="https://example.com/logo.png" />
              </FormField>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointmentTypes">
          <AppointmentTypesTab />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AppointmentTypesTab() {
  const [types, setTypes] = useState([
    { id: 1, name: "Initial Assessment", duration: 60, fee: 7500 },
    { id: 2, name: "Individual Therapy Session", duration: 50, fee: 6500 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("60");
  const [fee, setFee] = useState("0");

  const handleOpenCreate = () => {
    setEditingId(null);
    setName("");
    setDuration("60");
    setFee("0");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (type: any) => {
    setEditingId(type.id);
    setName(type.name);
    setDuration(type.duration.toString());
    setFee((type.fee / 100).toString());
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFee = Math.round(parseFloat(fee) * 100);

    if (editingId) {
      setTypes(types.map(t => t.id === editingId ? { ...t, name, duration: parseInt(duration), fee: parsedFee } : t));
    } else {
      setTypes([...types, { id: Date.now(), name, duration: parseInt(duration), fee: parsedFee }]);
    }
    setIsDialogOpen(false);
  };

  const handleArchive = (id: number) => {
    setTypes(types.filter(t => t.id !== id));
  };

  return (
    <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Appointment Types</h3>
        <Button onClick={handleOpenCreate}>Create New</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-panel-bg text-panel-text border-panel-border">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Create"} Appointment Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Name" htmlFor="typeName" required>
              <TextInput id="typeName" value={name} onChange={(e) => setName(e.target.value)} required />
            </FormField>
            <FormField label="Duration (minutes)" htmlFor="typeDuration" required>
              <TextInput id="typeDuration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </FormField>
            <FormField label="Fee (£)" htmlFor="typeFee" required>
              <TextInput id="typeFee" type="number" step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} required />
            </FormField>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border border-panel-border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-contrast-bg text-canvas-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Duration (mins)</th>
              <th className="px-4 py-3 font-medium">Fee</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-border">
            {types.map((type) => (
              <tr key={type.id} className="hover:bg-contrast-bg/50">
                <td className="px-4 py-3 font-medium">{type.name}</td>
                <td className="px-4 py-3 text-panel-muted">{type.duration}</td>
                <td className="px-4 py-3 text-panel-muted">£{(type.fee / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(type)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-state-danger-text" onClick={() => handleArchive(type.id)}>Archive</Button>
                </td>
              </tr>
            ))}
            {types.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-panel-muted">
                  No appointment types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoomsTab() {
  const [rooms, setRooms] = useState([
    { id: 1, name: "Room 1 (Ground Floor)", status: "Active" },
    { id: 2, name: "Room 2 (First Floor)", status: "Active" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");

  const handleOpenCreate = () => {
    setEditingId(null);
    setName("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (room: any) => {
    setEditingId(room.id);
    setName(room.name);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setRooms(rooms.map(r => r.id === editingId ? { ...r, name } : r));
    } else {
      setRooms([...rooms, { id: Date.now(), name, status: "Active" }]);
    }
    setIsDialogOpen(false);
  };

  const handleDeactivate = (id: number) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  return (
    <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Rooms</h3>
        <Button onClick={handleOpenCreate}>Add Room</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-panel-bg text-panel-text border-panel-border">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Room Name" htmlFor="roomName" required>
              <TextInput id="roomName" value={name} onChange={(e) => setName(e.target.value)} required />
            </FormField>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border border-panel-border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-contrast-bg text-canvas-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-border">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-contrast-bg/50">
                <td className="px-4 py-3 font-medium">{room.name}</td>
                <td className="px-4 py-3 text-panel-muted">{room.status}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(room)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-state-warning-text" onClick={() => handleDeactivate(room.id)}>Deactivate</Button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-panel-muted">
                  No active rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
