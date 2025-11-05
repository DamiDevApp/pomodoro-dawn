import { useState } from "react";
import { useTaskContext } from "../../hooks/useTaskContext";
import TaskForm from "../TaskForm";
import type { Task } from "../../types/task";
import "./task-item.css";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask, setActiveTask, activeTaskId } =
    useTaskContext();
  const [isEditing, setIsEditing] = useState(false);

  const isActive = activeTaskId === task.id;

  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  function handleToggleComplete() {
    updateTask(task.id, { completed: !task.completed });
  }

  function handleDelete() {
    if (window.confirm(`Delete task "${task.name}"`)) {
      deleteTask(task.id);
    }
  }

  function handleStartPomodoro() {
    setActiveTask(task.id);
    // TODO: Integration with pomodoro application
    console.log("Starting pomodoro for task: ", task.name);
  }

  function formatDueDate(isoDate: string): string {
    const date = new Date(isoDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  }

  function isOverdue(): boolean {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today && !task.completed;
  }

  if (isEditing) {
    return <TaskForm task={task} onComplete={() => setIsEditing(false)} />;
  }

  return (
    <div
      className={`task-item ${isActive ? "active" : ""} ${
        task.completed ? "completed" : ""
      }`}
      draggable // We'll implement drag handlers in next step
    >
      {/* Drag handle */}
      <div className="drag-handle">
        <span>⋮⋮</span>
      </div>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
        className="task-checkbox"
      />

      {/* Task content */}
      <div className="task-content">
        <div className="task-main">
          <span className="task-name">{task.name}</span>

          {/* Priority indicator */}
          <span
            className="priority-badge"
            style={{
              backgroundColor: priorityColors[task.priority],
              opacity: task.completed ? 0.5 : 1,
            }}
          >
            {task.priority}
          </span>

          {/* Pomodoro progress */}
          <span className="pomodoro-count">
            🍅 {task.completedPomodoros}/{task.estimatedPomodoros}
          </span>
        </div>

        {/* Optional metadata row */}
        {(task.category || task.dueDate) && (
          <div className="task-metadata">
            {task.category && (
              <span className="category-badge">{task.category}</span>
            )}
            {task.dueDate && (
              <span className={`due-date ${isOverdue() ? "overdue" : ""}`}>
                📅 {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="task-actions">
        {!task.completed && (
          <button
            className="btn-start-pomodoro"
            onClick={handleStartPomodoro}
            title="Start Pomodoro for this task"
          >
            ▶
          </button>
        )}
        <button
          className="btn-edit"
          onClick={() => setIsEditing(true)}
          title="Edit task"
        >
          ✏️
        </button>
        <button
          className="btn-delete"
          onClick={handleDelete}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
