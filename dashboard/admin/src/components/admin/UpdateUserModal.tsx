import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useToast } from '@/hooks/use-toast';

interface UpdateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentBalance: string;
  currentProfit: string;
  username: string;
  onUserUpdated: () => void;
}

export function UpdateUserModal({ 
  open, 
  onOpenChange, 
  userId, 
  currentBalance, 
  currentProfit, 
  username,
  onUserUpdated
}: UpdateUserModalProps) {
  const [balance, setBalance] = useState(currentBalance);
  const [profit, setProfit] = useState(currentProfit);
  const { updateUser } = useAdminActions();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update balance if it has changed
      if (balance !== currentBalance) {
        await updateUser.mutateAsync({ userId, balance: parseFloat(balance) });
      }
      
      // Update profit if it has changed
      if (profit !== currentProfit) {
        await updateUser.mutateAsync({ userId, profit: parseFloat(profit) });
      }
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Update balance and profit for {username}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance
              </Label>
              <Input
                id="balance"
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profit" className="text-right">
                Profit
              </Label>
              <Input
                id="profit"
                type="number"
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}