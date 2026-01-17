'use client';

import { useMemo, useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between">
        {/* Left: Greeting + Date */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{greeting}</h2>
          <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
        </div>

        {/* Center: Hustling Quote */}
        <div className="flex-1 flex justify-center items-center px-8">
          <motion.p
            key={quoteKey}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              ease: 'easeOut',
              scale: { duration: 0.4 }
            }}
            className="text-sm text-gray-400 italic font-light"
          >
            "{quote}"
          </motion.p>
        </div>

        {/* Right: Add Task Button */}
        <div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onAddTaskClick} 
              size="sm" 
              className="gap-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isHovered ? <Loader2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </motion.div>
              Add Task
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
