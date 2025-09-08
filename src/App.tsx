import PomodoroTimer from "./components/PomodoroTimer";
import HistoryList from "./components/HistoryList";
import StatsPanel from "./components/StatsPanel";
import { useHistory } from "./hooks/useHistory";

export default function App() {
  const { history, clearHistory } = useHistory();

  return (
    <div className="app-container">
      {/* Left side */}
      <div className="side-panel">
        <HistoryList history={history} onClear={clearHistory} />
      </div>

      {/* Center */}
      <div className="main-panel">
        <PomodoroTimer />
      </div>

      {/* Right side */}
      <div className="side-panel">
        <StatsPanel history={history} />
      </div>
    </div>
  );
}
