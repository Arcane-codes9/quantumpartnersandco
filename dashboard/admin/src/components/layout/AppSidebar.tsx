import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Home,
  CandlestickChart,
  History,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks';
import { useRate } from '@/hooks/useRate';

const navigationItems = [
  { title: 'Users', url: '/', icon: Home },
  { title: 'Trades', url: '/trades', icon: CandlestickChart },
  { title: 'Activities', url: '/activities', icon: History },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const { data: rates, isLoading } = useRate();

  const usdt = useMemo(() => rates?.USDT, [rates]);
  const totalValue = useMemo(() => +user?.balance || 0, [user?.balance || 0]);
  const usdtChangePercent = useMemo(() => !isLoading ? +usdt?.changePercent : 0, [isLoading, usdt]);
  const totalChangePercent = useMemo(() => usdtChangePercent, [usdtChangePercent]);

  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-primary'
      : 'hover:bg-sidebar-accent/50 hover:text-sidebar-foreground';

  return (
    <Sidebar
      className="border-r border-sidebar-border"
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">CryptoTrader</h2>
                <p className="text-xs text-sidebar-foreground/60">Pro Dashboard</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium px-4 py-2">
            {!isCollapsed && 'MAIN MENU'}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) => `${getNavCls({ isActive })} flex items-center space-x-3 px-4 py-3 rounded-none transition-all duration-200`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Section - User Stats */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="crypto-card bg-sidebar-accent/30 p-3">
              <div className="text-xs text-sidebar-foreground/70 mb-1">Portfolio Value</div>
              <div className="text-lg font-bold text-sidebar-foreground">${totalValue?.toLocaleString()}</div>
              <div className={`text-xs ${totalChangePercent >= 0 ? 'text-success' : 'text-destructive'}`}>{`${totalChangePercent >= 0 ? '+' : ''}${totalChangePercent.toFixed(2)}%`} (24h)</div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}