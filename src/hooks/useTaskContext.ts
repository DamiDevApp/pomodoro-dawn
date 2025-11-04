import { TaskContext } from "../contexts/TaskContext";
import { useContext } from "react";

export function useTaskContext() {
  const context = useContext(TaskContext);

  if (context === null) {
    throw new Error("useTaskContext must be used within its TaskProvider");
  }

  return context;
}
