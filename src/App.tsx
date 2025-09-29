import HistoryList from './components/HistoryList';
import PomodoroTimer from './components/PomodoroTimer';
import { HistoryProvider } from './contexts/HistoryContext';

export default function App() {
  return (
    <>
      <HistoryProvider>
        <div className='app-container'>
          <div className='main-panel'>
            <PomodoroTimer />
          </div>
          <div className='history-panel'>
            <HistoryList />
          </div>
        </div>
      </HistoryProvider>
    </>
  );
}
