export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  priority: TaskPriority;
  category?: string;
  dueDate?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  order: number;
  createdAt: string;
}
