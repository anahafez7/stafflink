import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus } from "lucide-react";
import { roleMatrix, worksites } from "@/data/modules";

const accessStyles = {
  full: "bg-success/15 text-success",
  read: "bg-warning/15 text-warning",
  none: "bg-muted text-muted-foreground",
} as const;

const accessLabel = { full: "Full", read: "Read", none: "None" } as const;

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(roleMatrix.roles[4]?.role || "Employee"); // Default to Employee

  const roleData = roleMatrix.roles.find((r) => r.role === selectedRole);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to actually create user goes here
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <UserPlus className="size-4 mr-2" />
          <span>Create user</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
        <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>Add a new user, assign them a role and set their initial password.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Hafez Rahim" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select defaultValue={worksites[0]?.name || ""}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {worksites.map((ws) => (
                      <SelectItem key={ws.name} value={ws.name}>
                        {ws.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="All">All Branches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleMatrix.roles.map((r) => (
                      <SelectItem key={r.role} value={r.role}>
                        {r.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Assigned Permissions</Label>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary">
                    <TableRow>
                      <TableHead className="w-[150px]">Module</TableHead>
                      <TableHead>Access Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleMatrix.modules.map((module, index) => {
                      const access = roleData?.access[index] || "none";
                      return (
                        <TableRow key={module}>
                          <TableCell className="font-medium text-sm py-2">{module}</TableCell>
                          <TableCell className="py-2">
                            <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${accessStyles[access]}`}>
                              {accessLabel[access]}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border mt-auto">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
