import { useState } from "react";
import HistoryList from "./components/HistoryList";
import PomodoroTimer from "./components/PomodoroTimer";
import { HistoryProvider } from "./contexts/HistoryProvider";
import { TaskProvider } from "./contexts/TaskProvider";
import "./App.css";
import { IonIcon } from "@ionic/react";
import { timerOutline } from "ionicons/icons";

export default function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  return (
    <>
      <TaskProvider>
        <HistoryProvider>
          <div className="app-container">
            <div className="main-panel">
              <PomodoroTimer />
            </div>
            <div className={`history-panel ${isHistoryOpen ? "open" : ""}`}>
              <HistoryList />
            </div>

            <button
              className="history-toggle-btn"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              aria-label={isHistoryOpen ? "Close history" : "Open History"}
            >
              <IonIcon icon={timerOutline} />
            </button>
          </div>
        </HistoryProvider>
      </TaskProvider>
    </>
  );
}
