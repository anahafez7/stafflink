import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import { roleMatrix } from "@/data/modules";

const AVAILABLE_ACTIONS = ["View", "Add", "Edit", "Delete", "Upload", "Download", "Export", "Import"];

type AccessLevel = "full" | "read" | "none";

type RoleProps = {
  role: string;
  access: AccessLevel[];
};

export function EditRoleDialog({ roleData }: { roleData: RoleProps }) {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState(roleData.role);
  
  // Map "full", "read", "none" to initial sets of actions
  const [accessSets, setAccessSets] = useState<Set<string>[]>(() => 
    roleData.access.map(level => {
      if (level === "full") return new Set(AVAILABLE_ACTIONS);
      if (level === "read") return new Set(["View"]);
      return new Set();
    })
  );

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update role goes here
    setOpen(false);
  };

  const toggleAction = (moduleIndex: number, action: string) => {
    setAccessSets(prev => {
      const newSets = [...prev];
      const newSet = new Set(newSets[moduleIndex]);
      if (newSet.has(action)) {
        newSet.delete(action);
      } else {
        newSet.add(action);
      }
      newSets[moduleIndex] = newSet;
      return newSets;
    });
  };

  const toggleAll = (moduleIndex: number, checkAll: boolean) => {
    setAccessSets(prev => {
      const newSets = [...prev];
      if (checkAll) {
        newSets[moduleIndex] = new Set(AVAILABLE_ACTIONS);
      } else {
        newSets[moduleIndex] = new Set();
      }
      return newSets;
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Pencil className="size-4" />
          <span className="sr-only">Edit Role</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] overflow-hidden flex flex-col max-h-[90vh]">
        <form onSubmit={handleEdit} className="flex flex-col flex-1 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle>Edit role permissions</DialogTitle>
            <DialogDescription>Modify the role name and its granular access levels across modules.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor={`edit-role-name-${roleData.role}`}>Role Name</Label>
              <Input id={`edit-role-name-${roleData.role}`} value={roleName} onChange={(e) => setRoleName(e.target.value)} required />
            </div>

            <div className="space-y-3">
              <Label>Permission Matrix</Label>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary">
                    <TableRow>
                      <TableHead className="w-[180px]">Module</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead className="w-[100px] text-right">Select All</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleMatrix.modules.map((module, index) => {
                      const selectedActions = accessSets[index] || new Set();
                      const isAllSelected = selectedActions.size === AVAILABLE_ACTIONS.length;
                      const isIndeterminate = selectedActions.size > 0 && selectedActions.size < AVAILABLE_ACTIONS.length;

                      return (
                        <TableRow key={module}>
                          <TableCell className="font-medium text-sm py-4 align-top">{module}</TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-wrap gap-x-6 gap-y-4">
                              {AVAILABLE_ACTIONS.map(action => (
                                <div key={action} className="flex items-center space-x-2 w-[90px]">
                                  <Checkbox 
                                    id={`${module}-${action}`} 
                                    checked={selectedActions.has(action)}
                                    onCheckedChange={() => toggleAction(index, action)}
                                  />
                                  <label 
                                    htmlFor={`${module}-${action}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {action}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right align-top">
                            <Checkbox 
                              checked={isIndeterminate ? "indeterminate" : isAllSelected}
                              onCheckedChange={(checked) => toggleAll(index, checked === true)}
                              aria-label={`Select all for ${module}`}
                            />
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
