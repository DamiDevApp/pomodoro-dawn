import { createContext } from "react";
import type { PomodoroRecordSession } from "../types";

export interface HistoryContextValue {
  history: PomodoroRecordSession[];
  addRecord: (record: PomodoroRecordSession) => void;
  clearHistory: () => void;
}

export const HistoryContext = createContext<HistoryContextValue | null>(null);
