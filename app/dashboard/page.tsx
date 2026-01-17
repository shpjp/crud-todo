'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppSidebar from '../components/AppSidebar';
import Header from '../components/Header';
import TaskGroupCard, { Task } from '../components/TaskGroupCard';
import OverviewPanel, { StatusFilterType } from '../components/OverviewPanel';
import AddTaskModal, { TaskFormData, CategoryType as ModalCategoryType } from '../components/AddTaskModal';
import { useDebounce } from '../hooks/useDebounce';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
type CategoryType = 'ALL' | 'PERSONAL' | 'WORK';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<StatusFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultCategory, setModalDefaultCategory] = useState<ModalCategoryType>('PERSONAL');

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 400);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user profile:', data);
        setUserEmail(data.user.email);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data.tasks);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserProfile();
    fetchTasks();
  }, [fetchUserProfile, fetchTasks]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [router]);

  const handleAddTaskClick = useCallback((category?: ModalCategoryType) => {
    // If category is provided, use it; otherwise use active category or default to PERSONAL
    const defaultCat = category || (activeCategory !== 'ALL' ? activeCategory as ModalCategoryType : 'PERSONAL');
    setModalDefaultCategory(defaultCat);
    setIsModalOpen(true);
  }, [activeCategory]);

  const handleCreateTask = useCallback(async (formData: TaskFormData) => {
    setActionLoading(true);
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category,
          priority: formData.priority,
          status: formData.status,
          dueDate: formData.dueDate || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create task');
      }

      const data = await response.json();
      setTasks(prev => [...prev, data.task]);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleToggleTask = useCallback(async (id: string, completed: boolean) => {
    setActionLoading(true);
    
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update task');
      }

      const data = await response.json();
      setTasks(prev => prev.map(t => t.id === id ? data.task : t));
      setError('');
    } catch (err: any) {
      // Revert optimistic update on error
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
      setError(err.message || 'Failed to update task');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleDeleteTask = useCallback(async (id: string) => {
    setActionLoading(true);
    
    // Optimistic update
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete task');
      }

      setError('');
    } catch (err: any) {
      // Revert optimistic update on error
      if (taskToDelete) {
        setTasks(prev => [...prev, taskToDelete]);
      }
      setError(err.message || 'Failed to delete task');
    } finally {
      setActionLoading(false);
    }
  }, [tasks]);

  // Step 1: Filter by category
  const categoryFilteredTasks = useMemo(() => {
    if (activeCategory !== 'ALL') {
      return tasks.filter(t => t.category === activeCategory);
    }
    return tasks;
  }, [tasks, activeCategory]);

  // Step 2: Filter by status (Completed / Remaining / All)
  const statusFilteredTasks = useMemo(() => {
    if (activeStatusFilter === 'COMPLETED') {
      return categoryFilteredTasks.filter(t => t.completed);
    } else if (activeStatusFilter === 'REMAINING') {
      return categoryFilteredTasks.filter(t => !t.completed);
    }
    return categoryFilteredTasks;
  }, [categoryFilteredTasks, activeStatusFilter]);

  // Step 3: Filter by search query and sort
  const filteredTasks = useMemo(() => {
    let filtered = statusFilteredTasks;
    
    // Filter by search query (debounced)
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query)
      );
    }
    
    // Sort: incomplete first, then by priority (HIGH > MEDIUM > LOW), then by due date
    return filtered.sort((a, b) => {
      // Completed tasks go last
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Sort by priority
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      // Sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [statusFilteredTasks, debouncedSearch]);

  // Group tasks by category for display
  const taskGroups = useMemo(() => {
    if (activeCategory === 'ALL') {
      return [
        { category: 'PERSONAL' as CategoryType, tasks: filteredTasks.filter(t => t.category === 'PERSONAL') },
        { category: 'WORK' as CategoryType, tasks: filteredTasks.filter(t => t.category === 'WORK') },
      ];
    } else {
      return [{ category: activeCategory, tasks: filteredTasks }];
    }
  }, [activeCategory, filteredTasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  const hasResults = taskGroups.some(group => group.tasks.length > 0);
  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <AppSidebar
          activeCategory={activeCategory}
          userName={userEmail}
          onCategoryChange={setActiveCategory}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <SidebarInset className="flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <Header onAddTaskClick={() => handleAddTaskClick()} />
          </div>

          {/* Search Bar */}
          <div className="flex justify-center px-8 pt-6 pb-4 bg-gray-50">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mt-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-xs text-red-600 hover:text-red-700 underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Cards with Overview Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main task area */}
          <main className="flex-1 overflow-y-auto px-8 py-6">

            {!hasResults ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isSearching ? 'No results found' : activeCategory === 'ALL' ? 'No tasks yet' : 'No tasks in this category'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {isSearching 
                    ? 'Try adjusting your search query'
                    : 'Start by adding your first task using the Add Task button'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {taskGroups.map((group) => (
                  <TaskGroupCard
                    key={group.category}
                    category={group.category}
                    tasks={group.tasks}
                    onAddTaskClick={() => handleAddTaskClick(group.category as ModalCategoryType)}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    loading={actionLoading}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Overview Panel */}
          <div className="w-72 flex-shrink-0">
            <OverviewPanel 
              tasks={tasks}
              activeStatusFilter={activeStatusFilter}
              onStatusFilterChange={setActiveStatusFilter}
            />
          </div>
        </div>
      </SidebarInset>
    </div>

    {/* Add Task Modal */}
    <AddTaskModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleCreateTask}
      defaultCategory={modalDefaultCategory}
    />
    </SidebarProvider>
  );
}
