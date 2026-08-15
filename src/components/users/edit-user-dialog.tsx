import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { roleMatrix, worksites } from "@/data/modules";

const accessStyles = {
  full: "bg-success/15 text-success",
  read: "bg-warning/15 text-warning",
  none: "bg-muted text-muted-foreground",
} as const;

const accessLabel = { full: "Full", read: "Read", none: "None" } as const;

type UserProps = {
  name: string;
  email: string;
  role: string;
  branch: string;
  twoFactor: boolean;
  lastSeen: string;
  status: string;
};

export function EditUserDialog({ user }: { user: UserProps }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [selectedBranch, setSelectedBranch] = useState(user.branch);

  const roleData = roleMatrix.roles.find((r) => r.role === selectedRole);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to actually update user goes here
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Pencil className="size-4" />
          <span className="sr-only">Edit User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
        <form onSubmit={handleEdit} className="flex flex-col flex-1 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>Update user details and role assignment.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-name-${user.email}`}>Full Name</Label>
                <Input id={`edit-name-${user.email}`} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edit-email-${user.email}`}>Email</Label>
                <Input id={`edit-email-${user.email}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-branch-${user.email}`}>Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger id={`edit-branch-${user.email}`}>
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
                <Label htmlFor={`edit-role-${user.email}`}>Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id={`edit-role-${user.email}`}>
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
