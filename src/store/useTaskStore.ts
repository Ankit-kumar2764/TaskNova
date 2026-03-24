import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, User, Filters, SortConfig, ViewingUser } from '../types';
import { users as defaultUsers, generateTasks } from '../data/generator';

interface TaskStore {
  tasks: Task[];
  users: User[];
  filters: Filters;
  sort: SortConfig;
  viewingUsers: ViewingUser[];
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setFilters: (filters: Filters) => void;
  setSort: (sort: SortConfig) => void;
  updateViewingUsers: (viewingUsers: ViewingUser[]) => void;
  initializeData: () => void;
}

const initialFilters: Filters = {
  status: [],
  priority: [],
  assignee: [],
};

const initialSort: SortConfig = {
  sortBy: 'title',
  sortOrder: 'asc',
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      users: defaultUsers,
      filters: initialFilters,
      sort: initialSort,
      viewingUsers: [],

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date() }
              : task,
          ),
        })),

      setFilters: (filters) => set({ filters }),
      setSort: (sort) => set({ sort }),
      updateViewingUsers: (viewingUsers) => set({ viewingUsers }),

      initializeData: () => {
        if (get().tasks.length === 0) {
          set({ tasks: generateTasks(520) });
        }
      },
    }),
    {
      name: 'tasknova-storage',
      partialize: (state) => ({ tasks: state.tasks, filters: state.filters, sort: state.sort }),
    },
  ),
);
