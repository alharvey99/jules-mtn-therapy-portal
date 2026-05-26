"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/forms/FormField";
import { TextInput } from "@/components/shared/forms/TextInput";
import { TextareaInput } from "@/components/shared/forms/TextareaInput";
import { SelectInput } from "@/components/shared/forms/SelectInput";
import { ColorPicker } from "@/components/shared/forms/ColorPicker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("practice");
  const [cancelNotice, setCancelNotice] = useState("48");
  const [bufferTime, setBufferTime] = useState("10");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your practice settings, policies, and configuration."
      />

      <div className="sm:hidden mb-4">
        <SelectInput
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
          options={[
            { value: "practice", label: "Practice Details" },
            { value: "policies", label: "Policies" },
            { value: "appointmentTypes", label: "Appointment Types" },
            { value: "rooms", label: "Rooms" },
            { value: "branding", label: "Branding" }
          ]}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden sm:inline-flex mb-4 flex-wrap">
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
                <TextareaInput id="address" defaultValue="123 High Street, Canterbury, CT1 2AB" />
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
                <SelectInput
                  id="cancelNotice"
                  value={["24", "48", "72"].includes(cancelNotice) ? cancelNotice : "custom"}
                  onChange={(val) => setCancelNotice(val === "custom" ? "" : val)}
                  options={[
                    { value: "24", label: "24" },
                    { value: "48", label: "48" },
                    { value: "72", label: "72" },
                    { value: "custom", label: "custom" }
                  ]}
                />
                {!["24", "48", "72"].includes(cancelNotice) && (
                  <TextInput type="number" value={cancelNotice} onChange={(e) => setCancelNotice(e.target.value)} placeholder="Custom hours" className="mt-2" />
                )}
              </FormField>
              <FormField label="Buffer Time (Minutes)" htmlFor="bufferTime">
                <SelectInput
                  id="bufferTime"
                  value={["10", "15", "30"].includes(bufferTime) ? bufferTime : "custom"}
                  onChange={(val) => setBufferTime(val === "custom" ? "" : val)}
                  options={[
                    { value: "10", label: "10" },
                    { value: "15", label: "15" },
                    { value: "30", label: "30" },
                    { value: "custom", label: "custom" }
                  ]}
                />
                {!["10", "15", "30"].includes(bufferTime) && (
                  <TextInput type="number" value={bufferTime} onChange={(e) => setBufferTime(e.target.value)} placeholder="Custom minutes" className="mt-2" />
                )}
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
              <FormField label="Primary Colour" htmlFor="primaryColor">
                <ColorPicker id="primaryColor" defaultValue="#0f172a" />
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
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [archivingId, setArchivingId] = useState<number | null>(null);

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

  const handleConfirmArchive = () => {
    if (archivingId) {
      setTypes(types.filter(t => t.id !== archivingId));
    }
    setIsArchiveDialogOpen(false);
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

      <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the appointment type. Existing appointments will not be affected, but you won&apos;t be able to select it for new bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmArchive} className="bg-state-danger-bg text-state-danger-text hover:bg-state-danger-bg/90">Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="More options" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenEdit(type)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setArchivingId(type.id); setIsArchiveDialogOpen(true); }} className="text-state-danger-text">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" aria-label="More options" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenEdit(room)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeactivate(room.id)} className="text-state-warning-text">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
