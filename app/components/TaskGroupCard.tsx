'use client';

import { useState, memo, useCallback } from 'react';
import { CategoryType } from './Sidebar';
import { Circle, CheckCircle2, AlertCircle, Trash2, Plus } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  category: CategoryType;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskGroupCardProps {
  category: CategoryType;
  tasks: Task[];
  onAddTaskClick: () => void;
  onToggleTask: (id: string, completed: boolean) => void;
  onDeleteTask: (id: string) => void;
  loading: boolean;
}

const TaskItem = memo(function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  loading 
}: { 
  task: Task; 
  onToggle: (id: string, completed: boolean) => void; 
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  
  const priorityColors = {
    HIGH: 'text-red-600',
    MEDIUM: 'text-gray-600',
    LOW: 'text-gray-500',
  };

  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-50 group ${
      isOverdue ? 'border-l-2 border-red-500 bg-red-50' : ''
    }`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
        disabled={loading}
        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-gray-500 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${
          task.completed ? 'line-through text-gray-400' : 'text-gray-900'
        }`}>
          {task.title}
        </p>
        {task.dueDate && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${
            isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
          }`}>
            {isOverdue && <AlertCircle className="w-3 h-3" />}
            {isOverdue ? 'Overdue' : 'Due'}: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>
      <span className={`text-xs font-medium ${
        task.priority === 'HIGH' ? 'text-red-600' : 
        task.priority === 'MEDIUM' ? 'text-gray-600' : 
        'text-gray-500'
      }`}>
        {task.priority === 'HIGH' ? 'HIGH' : task.priority === 'MEDIUM' ? 'MED' : 'LOW'}
      </span>
      <button
        onClick={() => {
          if (confirm('Delete this task?')) {
            onDelete(task.id);
          }
        }}
        disabled={loading}
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 disabled:cursor-not-allowed transition-opacity"
        title="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
});

const getCategoryLabel = (category: CategoryType): string => {
  switch (category) {
    case 'PERSONAL': return 'Personal';
    case 'WORK': return 'Work';
    default: return 'All Tasks';
  }
};

export default function TaskGroupCard({ 
  category, 
  tasks, 
  onAddTaskClick, 
  onToggleTask, 
  onDeleteTask,
  loading 
}: TaskGroupCardProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{getCategoryLabel(category)}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        <button
          onClick={onAddTaskClick}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
          title="Add task"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-1">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">
              {completedCount === 0 
                ? "No tasks here yet" 
                : "All tasks completed 🎉"}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
}
