'use client';

import { useRouter } from 'next/navigation';
import { ClipboardList, User, Briefcase, LogOut, CheckSquare } from 'lucide-react';
import { generateAvatarUrl } from '@/lib/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

export type CategoryType = 'ALL' | 'PERSONAL' | 'WORK';

interface AppSidebarProps {
  activeCategory: CategoryType;
  userName?: string;
  onCategoryChange: (category: CategoryType) => void;
  onLogout: () => void;
}

const categories = [
  { id: 'ALL' as CategoryType, label: 'All Tasks', Icon: ClipboardList },
  { id: 'PERSONAL' as CategoryType, label: 'Personal', Icon: User },
  { id: 'WORK' as CategoryType, label: 'Work', Icon: Briefcase },
];

export default function AppSidebar({ activeCategory, userName, onCategoryChange, onLogout }: AppSidebarProps) {
  const router = useRouter();
  const { state } = useSidebar();
  const avatarUrl = userName ? generateAvatarUrl(userName, 48) : '';

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <Sidebar collapsible="icon">
      {/* App Logo/Title */}
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <CheckSquare className="w-7 h-7 text-black flex-shrink-0" />
            {state === 'expanded' && (
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">Todo-fier</h1>
                <p className="text-xs text-gray-500 truncate">Stay organized</p>
              </div>
            )}
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* User Profile Section */}
        {userName && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleProfileClick}
                  tooltip={state === 'collapsed' ? userName : undefined}
                  className="hover:bg-gray-100"
                >
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex-shrink-0"
                  />
                  {state === 'expanded' && (
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton
                    onClick={() => onCategoryChange(category.id)}
                    isActive={activeCategory === category.id}
                    tooltip={state === 'collapsed' ? category.label : undefined}
                  >
                    <category.Icon className="w-6 h-6" />
                    <span>{category.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Button */}
      <SidebarFooter className="border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              tooltip={state === 'collapsed' ? 'Logout' : undefined}
              className="text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-6 h-6" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>      <SidebarRail />    </Sidebar>
  );
}
