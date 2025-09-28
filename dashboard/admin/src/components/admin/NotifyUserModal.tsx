import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminActions } from '@/hooks/useAdminActions';
import { useToast } from '@/hooks/use-toast';

interface NotifyUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  username: string;
  onUserNotified: () => void;
}

export function NotifyUserModal({ 
  open, 
  onOpenChange, 
  userId,
  username,
  onUserNotified
}: NotifyUserModalProps) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const { notifyUser } = useAdminActions();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await notifyUser.mutateAsync({ 
        userId, 
        title: title || undefined,
        text, 
        emailSubject: emailSubject || undefined, 
        emailBody: emailBody || undefined 
      });
      
      toast({
        title: "Success",
        description: "Notification sent to user successfully",
      });
      
      onUserNotified();
      onOpenChange(false);
      
      // Reset form
      setTitle('');
      setText('');
      setEmailSubject('');
      setEmailBody('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset form when canceling
    setTitle('');
    setText('');
    setEmailSubject('');
    setEmailBody('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Notify User</DialogTitle>
          <DialogDescription>
            Send notification and optional email to {username}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Enter notification title"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">
                Notification Text
              </Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="col-span-3"
                placeholder="Enter notification message"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emailSubject" className="text-right">
                Email Subject
              </Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="col-span-3"
                placeholder="Enter email subject (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emailBody" className="text-right">
                Email Body
              </Label>
              <Textarea
                id="emailBody"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="col-span-3"
                placeholder="Enter email body (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={notifyUser.isPending}>
              {notifyUser.isPending ? "Sending..." : "Send Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}