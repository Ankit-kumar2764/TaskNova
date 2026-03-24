export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  priority: Priority;
  status: Status;
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dateRange?: { start: Date; end: Date };
}

export interface SortConfig {
  sortBy: 'title' | 'priority' | 'dueDate';
  sortOrder: 'asc' | 'desc';
}

export interface ViewingUser {
  userId: string;
  taskId: string;
}
