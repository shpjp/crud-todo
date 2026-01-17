'use client';

import { useMemo } from 'react';
import { Task } from './TaskGroupCard';
import { CategoryType } from './Sidebar';
import { CheckCircle2, Clock, AlertTriangle, User, Briefcase } from 'lucide-react';

export type StatusFilterType = 'ALL' | 'COMPLETED' | 'REMAINING';

interface OverviewPanelProps {
  tasks: Task[];
  activeStatusFilter: StatusFilterType;
  onStatusFilterChange: (filter: StatusFilterType) => void;
}

export default function OverviewPanel({ 
  tasks, 
  activeStatusFilter, 
  onStatusFilterChange 
}: OverviewPanelProps) {
  const stats = useMemo(() => {
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const overdueCount = tasks.filter(
      t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;
    
    const categoryBreakdown = {
      PERSONAL: tasks.filter(t => t.category === 'PERSONAL' && !t.completed).length,
      WORK: tasks.filter(t => t.category === 'WORK' && !t.completed).length,
    };

    const highPriorityCount = tasks.filter(
      t => !t.completed && t.priority === 'HIGH'
    ).length;

    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      completedCount,
      totalCount,
      overdueCount,
      categoryBreakdown,
      highPriorityCount,
      completionRate,
    };
  }, [tasks]);

  return (
    <aside className="h-full bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Overview</h3>

      {/* Overview Stats (Clickable Filters) */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Overview
        </h3>
        
        {/* All Tasks */}
        <button
          onClick={() => onStatusFilterChange('ALL')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
            activeStatusFilter === 'ALL'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          <span className="text-sm font-medium">All Tasks</span>
          <span className="text-lg font-bold">{stats.totalCount}</span>
        </button>

        {/* Remaining Tasks */}
        <button
          onClick={() => onStatusFilterChange('REMAINING')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
            activeStatusFilter === 'REMAINING'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Remaining</span>
          </div>
          <span className="text-lg font-bold">
            {stats.totalCount - stats.completedCount}
          </span>
        </button>

        {/* Completed Tasks */}
        <button
          onClick={() => onStatusFilterChange('COMPLETED')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
            activeStatusFilter === 'COMPLETED'
              ? 'bg-black text-white'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <span className="text-lg font-bold">{stats.completedCount}</span>
        </button>

        {/* Overdue (if any) */}
        {stats.overdueCount > 0 && (
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Overdue</span>
            </div>
            <span className="text-lg font-bold text-red-600">{stats.overdueCount}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-gray-900">{stats.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-300 rounded-full"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {stats.completedCount} of {stats.totalCount} tasks completed
        </p>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Tasks by Category</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Personal</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {stats.categoryBreakdown.PERSONAL}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Work</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {stats.categoryBreakdown.WORK}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                </div>
                </div>
                </div>
                </div>
        </aside>
  );
}
