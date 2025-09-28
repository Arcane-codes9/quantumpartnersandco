import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useAdminActions } from '@/hooks/useAdminActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UpdateUserModal } from '@/components/admin/UpdateUserModal';
import { NotifyUserModal } from '@/components/admin/NotifyUserModal';

const Index = () => {
  const { isLoadingUser } = useAuth();
  const { useUsers, deleteUser, } = useAdminActions();
  const { data: usersData, isLoading: isLoadingUsers, isError: isUsersError, refetch: refetchUsers } = useUsers();
  console.log({ usersData, isLoadingUsers, isUsersError });
  // Modal state management
  const [updateUserOpen, setUpdateUserOpen] = useState(false);
  const [notifyUserOpen, setNotifyUserOpen] = useState(false);

  // Data for modals
  const [selectedUserData, setSelectedUserData] = useState({
    userId: '',
    currentBalance: '',
    currentProfit: '',
    username: ''
  });

  const [selectedNotifyData, setSelectedNotifyData] = useState({
    userId: '',
    username: ''
  });

  // Modal handlers
  const openUpdateUserModal = (userId: string, balance: string, profit: string, username: string) => {
    setSelectedUserData({ userId, currentBalance: balance, currentProfit: profit, username });
    setUpdateUserOpen(true);
  };

  const openNotifyUserModal = (userId: string, username: string) => {
    setSelectedNotifyData({ userId, username });
    setNotifyUserOpen(true);
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin</h1>
          <p className="text-muted-foreground">Manage your Users Balance, Profit, Delete user and send users Notification.</p>
        </div>

        <div className="grid gap-6">
          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="text-center py-4">Loading users...</div>
              ) : isUsersError ? (
                <div className="text-center py-4 text-red-500">Error loading users</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div>
                            <div className="font-medium">Username</div>
                            <div className="text-sm text-muted-foreground">Email</div>
                          </div>
                        </TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData?.users?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.nationality || 'NA'}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-normal"
                              onClick={() => openUpdateUserModal(user.id, user.balance, user.profit, user.username)}
                            >
                              ${Number(user.balance || 0).toLocaleString()}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-normal"
                              onClick={() => openUpdateUserModal(user.id, user.balance, user.profit, user.username)}
                            >
                              ${Number(user.profit || 0).toLocaleString()}
                            </Button>
                          </TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <Badge variant="default">Admin</Badge>
                            ) : (
                              <Badge variant="secondary">User</Badge>
                            )}
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openNotifyUserModal(user.id, user.username)}
                            >
                              Notify
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete user ${user.username}? This will permanently delete all their data.`)) {
                                  deleteUser.mutate(user.id, {
                                    onSuccess: () => {
                                      refetchUsers();
                                    }
                                  });
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(!usersData || !usersData.users || usersData.users.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground">No users found</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modals */}
          <UpdateUserModal
            open={updateUserOpen}
            onOpenChange={setUpdateUserOpen}
            userId={selectedUserData.userId}
            currentBalance={selectedUserData.currentBalance}
            currentProfit={selectedUserData.currentProfit}
            username={selectedUserData.username}
            onUserUpdated={() => {
              // Refetch data after update
              refetchUsers();
            }}
          />

          <NotifyUserModal
            open={notifyUserOpen}
            onOpenChange={setNotifyUserOpen}
            userId={selectedNotifyData.userId}
            username={selectedNotifyData.username}
            onUserNotified={() => {
              // Refetch data after notification
              refetchUsers();
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
