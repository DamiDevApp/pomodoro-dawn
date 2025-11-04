import { useState, type FormEvent } from "react";
import { useTaskContext } from "../hooks/useTaskContext";
import type { Task, TaskPriority } from "../types/task";
import "./task-form.css";

interface TaskFormProps {
  task?: Task; // If provided theres editing, if not we are creating
  onComplete: () => void; // Called when submission or cancelation
}

export default function TaskForm({ task, onComplete }: TaskFormProps) {
  const { addTask, updateTask } = useTaskContext();

  // Initialize form state with existing data or defaults
  const [name, setName] = useState(task?.name || "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || "low"
  );
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    task?.estimatedPomodoros || 1
  );
  const [category, setCategory] = useState(task?.category || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");

  const isEditing = !!task; // Are we editing or creating a task

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validation: name required value

    if (!name.trim()) {
      alert("Task name is required");
      return;
    }

    if (isEditing) {
      // Update existing task
      updateTask(task.id, {
        name: name.trim(),
        priority,
        estimatedPomodoros,
        category: category.trim() || undefined,
        dueDate: dueDate || undefined,
      });
    } else {
      addTask({
        name: name.trim(),
        priority,
        estimatedPomodoros,
        category: category.trim() || undefined,
        dueDate: dueDate || undefined,
        completed: false,
        completedPomodoros: 0,
      });
    }

    onComplete(); // Hide form on completion
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group flex-grow">
          <label htmlFor="task-name">Task Name *</label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-pomodoros">Est. Pomodoros</label>
          <input
            id="task-pomodoros"
            type="number"
            min="1"
            max="99"
            value={estimatedPomodoros}
            onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-category">Category (optional)</label>
          <input
            id="task-category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Work, Personal"
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-due-date">Due Date (optional)</label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate ? dueDate.split("T")[0] : ""}
            onChange={(e) =>
              setDueDate(
                e.target.value ? new Date(e.target.value).toISOString() : ""
              )
            }
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {isEditing ? "Save Changes" : "Add Task"}
        </button>
        <button type="button" className="btn-cancel" onClick={onComplete}>
          Cancel
        </button>
      </div>
    </form>
  );
}
