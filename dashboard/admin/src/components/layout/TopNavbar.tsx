import { useMemo, useState } from 'react';
import { Bell, Search, User, Moon, Sun, Globe, ChevronDown, Monitor, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth, useTrading } from '@/hooks';
import { useRate } from '@/hooks/useRate';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@/hooks/useAuth';

export function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const {
    user,
    logout,
    deleteNotification,
    isDeletingNotification,
    clearNotifications,
    isClearingNotifications
  } = useAuth();
  const { data: rates, isLoading } = useRate();
  const { useActivities } = useTrading();
  const { data: activities } = useActivities({ page: 1 });
  const nav = useNavigate();

  const notifications = useMemo(() => Array.isArray(activities?.data?.notifications) ? activities?.data.notifications : [], [activities]);

  // Mark all as read handler
  const handleMarkAllAsRead = () => {
    clearNotifications();
  };

  const usdt = useMemo(() => rates?.USDT, [rates]);
  const totalValue = useMemo(() => +user?.balance || 0, [user?.balance || 0]);
  const usdtPrice = useMemo(() => !isLoading ? +usdt?.price : 1, [isLoading, usdt]);
  const usdtChange24h = useMemo(() => !isLoading ? +usdt?.change24h : 0, [isLoading, usdt]);
  const usdtChangePercent = useMemo(() => !isLoading ? +usdt?.changePercent : 0, [isLoading, usdt]);
  const totalChange24h = useMemo(() => usdtPrice !== 0 ? usdtChange24h * totalValue / usdtPrice : 0, [usdtPrice, usdtChange24h, totalValue]);
  const totalChangePercent = useMemo(() => usdtChangePercent, [usdtChangePercent]);

  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="md:hidden" />

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search cryptocurrencies..."
              className="pl-10 w-80 bg-background border-border"
            /> */}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Market Status */}
        <div className="hidden lg:flex items-center space-x-2">
        </div>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Globe className="w-4 h-4" />
              <span className="ml-1">EN</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
            <DropdownMenuItem>🇪🇸 Español</DropdownMenuItem>
            <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
            <DropdownMenuItem>🇩🇪 Deutsch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              {theme === 'light' ? (
                <Sun className="w-4 h-4" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Monitor className="w-4 h-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="w-4 h-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="w-4 h-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                >
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">Notifications</div>
                {notifications.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-auto"
                    onClick={handleMarkAllAsRead}
                    disabled={isClearingNotifications}
                  >
                    {isClearingNotifications ? 'Marking...' : 'Mark all as read'}
                  </Button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="text-xs text-muted-foreground py-4 text-center">No notifications</div>
              ) : (
                <ul className="space-y-2">
                  {notifications.map((n, i) => (
                    <li key={n._id || i} className="bg-muted rounded p-2 flex flex-col relative group">
                      <span className="font-medium text-sm">{n.type || 'Notification'}</span>
                      {n.message && <span className="text-xs text-muted-foreground mt-1">{n.message}</span>}
                      {/* {n.createdAt && <span className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</span>} */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-xs px-2 py-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Mark as read"
                        onClick={() => deleteNotification(n._id)}
                        disabled={isDeletingNotification}
                      >
                        {isDeletingNotification ? 'Marking...' : 'Mark as read'}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{user?.fullname}</div>
                <div className="text-xs text-muted-foreground">
                  {
                    user
                      ?.isActivated ? <CheckCircle className="w-4 h-4 text-blue-600" />
                      : <XCircle className="w-4 h-4 text-red-600" />
                  }
                </div>
              </div>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <div className="text-sm font-medium">Portfolio Balance</div>
              <div className="text-lg font-bold text-primary">${totalValue}</div>
              <div className="text-xs text-success">{totalChangePercent >= 0 ? '+' : ''}${totalChange24h} (24h)</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => nav('/settings')}>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => nav('/security')}>Security</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={logout}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}