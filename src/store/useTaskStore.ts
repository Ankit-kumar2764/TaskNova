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

const parseDate = (value?: Date | string): Date | undefined => {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
};

const normalizeTask = (task: Task | any): Task => ({
  ...task,
  startDate: parseDate(task.startDate),
  dueDate: parseDate(task.dueDate),
  createdAt: parseDate(task.createdAt) || new Date(),
  updatedAt: parseDate(task.updatedAt) || new Date(),
});

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
        const currentTasks = get().tasks;

        if (currentTasks.length > 0) {
          const normalized = currentTasks.map(normalizeTask);
          set({ tasks: normalized });
          return;
        }

        set({ tasks: generateTasks(520) });
      },
    }),
    {
      name: 'tasknova-storage',
      partialize: (state) => ({ tasks: state.tasks, filters: state.filters, sort: state.sort }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (Array.isArray(state.tasks)) {
          state.tasks = state.tasks.map(normalizeTask);
        }
      },
    },
  ),
);
