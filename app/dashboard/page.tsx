'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const TaskCard = memo(function TaskCard({ task, onUpdate, onDelete, loading }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const priorityColors = {
    HIGH: 'bg-red-100 text-red-800 border-red-300',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    LOW: 'bg-green-100 text-green-800 border-green-300',
  };

  const handleSaveEdit = useCallback(() => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
      setIsEditing(false);
    }
  }, [task.id, editTitle, editDescription, onUpdate]);

  const handleToggleComplete = useCallback(() => {
    onUpdate(task.id, { completed: !task.completed });
  }, [task.id, task.completed, onUpdate]);

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  }, [task.id, onDelete]);

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task title"
          disabled={loading}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task description"
          rows={3}
          disabled={loading}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            disabled={loading || !editTitle.trim()}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className={`text-sm mb-3 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
          {task.description.length > 100
            ? task.description.substring(0, 100) + '...'
            : task.description}
        </p>
      )}
      {task.dueDate && (
        <p className="text-xs text-gray-500 mb-3">
          Due: {formatDate(task.dueDate)}
        </p>
      )}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleToggleComplete}
          disabled={loading}
          className={`px-3 py-1 text-sm rounded-md ${
            task.completed
              ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              : 'bg-green-600 text-white hover:bg-green-700'
          } disabled:cursor-not-allowed`}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    dueDate: '',
  });

  const fetchTasks = useCallback(async () => {
    try {
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
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    setActionLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description || null,
          priority: newTask.priority,
          dueDate: newTask.dueDate || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const data = await response.json();
      setTasks([...tasks, data.task]);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
      setShowAddForm(false);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const data = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleDeleteTask = useCallback(async (id: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const { ongoingTasks, completedTasks, overdueTasks } = useMemo(() => {
    const now = new Date();
    const ongoing: Task[] = [];
    const completed: Task[] = [];
    const overdue: Task[] = [];

    tasks.forEach((task) => {
      if (task.completed) {
        completed.push(task);
      } else if (task.dueDate && new Date(task.dueDate) < now) {
        overdue.push(task);
      } else {
        ongoing.push(task);
      }
    });

    return { ongoingTasks: ongoing, completedTasks: completed, overdueTasks: overdue };
  }, [tasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Todo-fier</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {showAddForm ? 'Cancel' : '+ Add Task'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Add Task Form */}
        {showAddForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title *"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={actionLoading}
              />
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={actionLoading}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={actionLoading}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={actionLoading}
                />
              </div>
              <button
                onClick={handleAddTask}
                disabled={actionLoading || !newTask.title.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
              >
                {actionLoading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        )}

        {/* Task Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ongoing Tasks */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Ongoing <span className="text-gray-500">({ongoingTasks.length})</span>
              </h2>
            </div>
            <div className="space-y-4">
              {ongoingTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No ongoing tasks</p>
              ) : (
                ongoingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    loading={actionLoading}
                  />
                ))
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Completed <span className="text-gray-500">({completedTasks.length})</span>
              </h2>
            </div>
            <div className="space-y-4">
              {completedTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No completed tasks</p>
              ) : (
                completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    loading={actionLoading}
                  />
                ))
              )}
            </div>
          </div>

          {/* Overdue Tasks */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-red-600">
                Overdue <span className="text-gray-500">({overdueTasks.length})</span>
              </h2>
            </div>
            <div className="space-y-4">
              {overdueTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No overdue tasks</p>
              ) : (
                overdueTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    loading={actionLoading}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2026 Todo-fier. Production-quality task management.</p>
        </div>
      </footer>
    </div>
  );
}
