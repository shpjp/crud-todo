'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, User, Briefcase, LogOut, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateAvatarUrl } from '@/lib/avatar';
import { motion, AnimatePresence } from 'framer-motion';

export type CategoryType = 'ALL' | 'PERSONAL' | 'WORK';

interface SidebarProps {
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

export default function Sidebar({ activeCategory, userName, onCategoryChange, onLogout }: SidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const avatarUrl = userName ? generateAvatarUrl(userName, 48) : '';

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 overflow-hidden"
    >
      {/* App Logo/Title */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <CheckSquare className="w-6 h-6 text-black flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">Todo-fier</h1>
                <p className="text-xs text-gray-500 mt-1 truncate">Stay organized, stay focused</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center w-full"
            >
              <CheckSquare className="w-6 h-6 text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <div className="px-4 py-2 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Profile Section */}
      {userName && (
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleProfileClick}
            className={`w-full flex items-center rounded-lg hover:bg-gray-100 transition-colors ${
              isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'
            }`}
            title={isCollapsed ? userName : undefined}
          >
            <img
              src={avatarUrl}
              alt={userName}
              className={`rounded-full border-2 border-gray-300 flex-shrink-0 ${
                isCollapsed ? 'w-10 h-10' : 'w-12 h-12'
              }`}
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.id)}
                className={`w-full flex items-center rounded-lg text-left transition-colors ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                } ${
                  activeCategory === category.id
                    ? 'bg-black text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={isCollapsed ? category.label : undefined}
              >
                <category.Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {category.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
