'use client';

import { useMemo, useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAddTaskClick: () => void;
}

const hustlingQuotes = [
  "Make it happen. Shock everyone.",
  "Discipline beats motivation.",
  "Do it tired.",
  "Stay focused. Stay hungry.",
  "Consistency is everything.",
  "Progress over perfection."
];

export default function Header({ onAddTaskClick }: HeaderProps) {
  const [quoteKey, setQuoteKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const quote = useMemo(() => {
    return hustlingQuotes[Math.floor(Math.random() * hustlingQuotes.length)];
  }, [quoteKey]);

  // Trigger animation on mount
  useEffect(() => {
    setQuoteKey(1);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-8 md:py-6">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Mobile trigger + Greeting + Date */}
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className="md:hidden flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base md:text-2xl font-semibold text-gray-900 truncate">{greeting}</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 hidden sm:block truncate">{currentDate}</p>
          </div>
        </div>

        {/* Center: Hustling Quote — hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center items-center px-8">
          <motion.p
            key={quoteKey}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              ease: 'easeOut',
              scale: { duration: 0.4 }
            }}
            className="text-sm text-gray-400 italic font-light text-center"
          >
            "{quote}"
          </motion.p>
        </div>

        {/* Right: Add Task Button */}
        <div className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon-only on mobile, full button on sm+ */}
            <Button 
              onClick={onAddTaskClick} 
              size="sm" 
              className="gap-2 px-3 sm:px-4"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isHovered ? <Loader2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </motion.div>
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
