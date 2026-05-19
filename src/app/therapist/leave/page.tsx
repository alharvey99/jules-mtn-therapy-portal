import { Inbox } from "lucide-react";
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/forms/FormField";
import { SelectInput } from "@/components/shared/forms/SelectInput";
import { TextInput } from "@/components/shared/forms/TextInput";
import { TextareaInput } from "@/components/shared/forms/TextareaInput";
import { useState } from "react";

export default function TherapistLeavePage() {
  const [requests, setRequests] = useState([
    { id: 1, startDate: "2026-08-12", endDate: "2026-08-15", type: "Annual Leave", status: "Pending", reason: "Summer holiday" },
    { id: 2, startDate: "2026-07-01", endDate: "2026-07-02", type: "Sick Leave", status: "Approved", reason: "Not feeling well" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("Annual Leave");
  const [reason, setReason] = useState("");

  const handleRequestLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setRequests([
      { id: Date.now(), startDate, endDate, type, status: "Pending", reason },
      ...requests,
    ]);
    setIsDialogOpen(false);
    setStartDate("");
    setEndDate("");
    setType("Annual Leave");
    setReason("");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Leave Requests"
          description="Manage your time off and view request statuses."
        />
        <Button onClick={() => setIsDialogOpen(true)}>Request Leave</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-panel-bg text-panel-text border-panel-border">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRequestLeave} className="space-y-4">
            <FormField label="Leave Type" htmlFor="leaveType" required>
              <SelectInput id="leaveType" value={type} onChange={(val) => setType(val)} required>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Compassionate Leave">Compassionate Leave</option>
                <option value="Other">Other</option>
              </SelectInput>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Date" htmlFor="startDate" required>
                <TextInput id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
              </FormField>
              <FormField label="End Date" htmlFor="endDate" required>
                <TextInput id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </FormField>
            </div>

            <FormField label="Reason (Optional)" htmlFor="reason">
              <TextareaInput id="reason" value={reason} onChange={e => setReason(e.target.value)} />
            </FormField>

            <DialogFooter>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-panel-bg border border-panel-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-contrast-bg text-canvas-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Date Range</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-panel-border">
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-contrast-bg/50">
                <td className="px-4 py-3 font-medium">{req.startDate} to {req.endDate}</td>
                <td className="px-4 py-3 text-panel-muted">{req.type}</td>
                <td className="px-4 py-3 text-panel-muted">{req.reason || "-"}</td>
                <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-panel-muted">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
