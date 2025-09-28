import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, Key, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';


export default function Security() {
  const { updatePassword, isUpdatingPassword, updatePasswordError } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    updatePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-muted-foreground">Manage your account security and authentication settings.</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password & Authentication
              </CardTitle>
              <CardDescription>Update your login credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <Button type="submit" disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}>Update Password</Button>
                {success && <div className="text-green-600 text-sm">Password updated successfully!</div>}
                {updatePasswordError && <div className="text-red-600 text-sm">{(updatePasswordError as any).message || 'Update failed'}</div>}
                {newPassword !== confirmPassword && confirmPassword && <div className="text-red-600 text-sm">Passwords do not match</div>}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between'>
                <h1 className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Two-Factor Authentication</h1>
                <div className="flex items-center gap-2">
                  <Badge className="border-2 border-blue-500 text-blue-500" variant="outline">Coming Soon</Badge>
                </div>
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Authentication</Label>
                  <p className="text-sm text-muted-foreground">Receive codes via text message</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Not Enabled</Badge>
                  <Switch disabled />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Authenticator App</Label>
                  <p className="text-sm text-muted-foreground">Use Google Authenticator or similar</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Not Enabled</Badge>
                  <Switch disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between'>
                <h1 className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className="border-2 border-blue-500 text-blue-500" variant="outline">Coming Soon</Badge>
                </div>
              </CardTitle>

              <CardDescription>Configure additional security measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="loginAlerts">Login Alerts</Label>
                <Switch id="loginAlerts" disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="deviceTracking">Device Tracking</Label>
                <Switch id="deviceTracking" disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Switch id="ipWhitelist" disabled />
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">Chrome on Windows • New York, US</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-sm text-muted-foreground">iOS App • Last active 2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">Revoke</Button>
                </div>
              </div>
              <Button variant="destructive" className="w-full">End All Other Sessions</Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </DashboardLayout>
  );
}