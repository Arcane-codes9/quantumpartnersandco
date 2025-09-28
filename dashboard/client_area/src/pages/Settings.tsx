import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function Settings() {
  const { user, updateInfo, isUpdatingInfo, updateInfoError } = useAuth();
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [nationality, setNationality] = useState(user?.nationality || '');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    updateInfo(
      { fullname, phone, nationality },
      {
        onSuccess: () => setSuccess(true),
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings.</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input id="fullname" value={fullname} onChange={e => setFullname(e.target.value)} placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" value={nationality} onChange={e => setNationality(e.target.value)} placeholder="Enter nationality" />
                </div>
                <Button type="submit" disabled={isUpdatingInfo}>Save Changes</Button>
                {success && <div className="text-green-600 text-sm">Profile updated successfully!</div>}
                {updateInfoError && <div className="text-red-600 text-sm">{(updateInfoError as any).message || 'Update failed'}</div>}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between'>
                <h1>Notifications</h1>
                <div className="flex items-center gap-2">
                  <Badge className="border-2 border-blue-500 text-blue-500" variant="outline">Coming Soon</Badge>
                </div>
              </CardTitle>

              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifs">Email Notifications</Label>
                <Switch disabled id="emailNotifs" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifs">Push Notifications</Label>
                <Switch disabled id="pushNotifs" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="marketAlerts">Market Alerts</Label>
                <Switch disabled id="marketAlerts" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between'>
                <h1>Trading Preferences</h1>
                <div className="flex items-center gap-2">
                  <Badge className="border-2 border-blue-500 text-blue-500" variant="outline">Coming Soon</Badge>
                </div>
              </CardTitle>
              <CardDescription>Customize your trading experience</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="advancedMode">Advanced Trading Mode</Label>
                <Switch disabled id="advancedMode" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="autoRefresh">Auto-refresh Data</Label>
                <Switch disabled id="autoRefresh" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}