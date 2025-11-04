import { createContext } from "react";
import type { Task } from "../types/task";

export interface TaskContextValue {
  tasks: Task[];
  activeTaskId: string | null;
  autoChainEnabled: boolean;
  addTask: (task: Omit<Task, "id" | "createdAt" | "order">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (reorderedTasks: Task[]) => void;
  setActiveTask: (taskId: string | null) => void;
  incrementTaskPomodoro: (taskId: string) => void;
  getNextTask: () => Task | null;
  toggleAutoChain: () => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);
