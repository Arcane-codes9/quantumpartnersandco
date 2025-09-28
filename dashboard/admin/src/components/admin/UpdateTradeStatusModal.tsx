import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useToast } from '@/hooks/use-toast';

interface UpdateTradeStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tradeId: string;
  currentStatus: string;
  onTradeUpdated: () => void;
}

export function UpdateTradeStatusModal({ 
  open, 
  onOpenChange, 
  tradeId, 
  currentStatus,
  onTradeUpdated
}: UpdateTradeStatusModalProps) {
  const [status, setStatus] = useState(currentStatus);
  const { updateTradeStatus } = useAdminActions();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateTradeStatus.mutateAsync({ tradeId, status });
      
      toast({
        title: "Success",
        description: "Trade status updated successfully",
      });
      
      onTradeUpdated();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update trade status: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Trade Status</DialogTitle>
          <DialogDescription>
            Update the status of this trade
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateTradeStatus.isPending}>
              {updateTradeStatus.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}