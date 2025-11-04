import { useState, useEffect, type ReactNode } from "react";
import { TaskContext, type TaskContextValue } from "./TaskContext";
import type { Task } from "../types/task";

export function TaskProvider({ children }: { children: ReactNode }) {
  // Load tasks from localStorage on mount
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem("pomodoro:tasks");
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      return [];
    }
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Load auto-chain setting
  const [autoChainEnabled, setAutoChainEnabled] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("pomodoro:autoChain");
      return raw ? JSON.parse(raw) : false;
    } catch (error) {
      console.error("Error loading autoChain setting:", error);
      return false;
    }
  });

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pomodoro:tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Persist auto-chain setting
  useEffect(() => {
    localStorage.setItem(
      "pomodoro:autoChain",
      JSON.stringify(autoChainEnabled)
    );
  }, [autoChainEnabled]);

  function addTask(taskData: Omit<Task, "id" | "createdAt" | "order">) {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      createdAt: new Date().toISOString(),
      order: tasks.length,
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function updateTask(id: string, updates: Partial<Task>) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  }

  function reorderTasks(reorderedTasks: Task[]) {
    const tasksWithNewOrder = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
    }));
    setTasks(tasksWithNewOrder);
  }

  function setActiveTask(taskId: string | null) {
    setActiveTaskId(taskId);
  }

  function incrementTaskPomodoro(taskId: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
          : task
      )
    );
  }

  function getNextTask(): Task | null {
    const incompleteTasks = tasks
      .filter((task) => !task.completed)
      .sort((a, b) => a.order - b.order);

    return incompleteTasks.length > 0 ? incompleteTasks[0] : null;
  }

  function toggleAutoChain() {
    setAutoChainEnabled((prev) => !prev);
  }

  const value: TaskContextValue = {
    tasks,
    activeTaskId,
    autoChainEnabled,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    setActiveTask,
    incrementTaskPomodoro,
    getNextTask,
    toggleAutoChain,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
