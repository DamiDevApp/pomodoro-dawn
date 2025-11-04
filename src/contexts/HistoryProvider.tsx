import { useState, useEffect, type ReactNode } from "react";
import type { PomodoroRecordSession } from "../types";
import { HistoryContext } from "./HistoryContext";

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<PomodoroRecordSession[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pomodoro:history");
      if (raw) {
        setHistory(JSON.parse(raw) as PomodoroRecordSession[]);
      }
    } catch (error) {
      console.error("Error setting pomodoro history: ", error);
    }
  }, []);

  function addRecord(record: PomodoroRecordSession) {
    setHistory((prev) => {
      const updated = [...prev, record];
      localStorage.setItem("pomodoro:history", JSON.stringify(updated));
      return updated;
    });
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem("pomodoro:history");
  }

  return (
    <HistoryContext.Provider value={{ history, addRecord, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}
