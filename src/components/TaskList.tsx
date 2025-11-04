import { useState } from "react";
import { useTaskContext } from "../hooks/useTaskContext";
import type { Task } from "../types/task";
import "./task-list.css";

export default function TaskList() {
  const { tasks, autoChainEnabled, toggleAutoChain, reorderTasks } =
    useTaskContext();
  const [showAddForm, setShowAddForm] = useState(false);

  // Sort tasks by order for display

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <div className="task-list-controls">
          <label className="auto-chain-toggle">
            <input
              type="checkbox"
              checked={autoChainEnabled}
              onChange={toggleAutoChain}
            />
            <span>Auto-chain tasks</span>
          </label>
          <button
            className="add-task-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "+ Add Task"}
          </button>
        </div>
      </div>

      {/**
       * {showAddForm && (
        <TaskForm onComplete={() => setShowAddForm(false)} />
        )}
       */}

      {/**
        * <div className="task-list">
        {sortedTasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one to get started!</p>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>

        */}
    </div>
  );
}
