
import React, { useState, useEffect, useCallback } from 'react';
import { Habit, HabitLog, ViewMode } from './types';
import { INITIAL_HABITS, MONTHS, YEAR, PASTEL_COLORS } from './constants';
import { getDateKey } from './utils/dateUtils';
import HabitRow from './components/HabitRow';
import Analytics from './components/Analytics';
import SleepTracker from './components/SleepTracker';
import EditHabitModal from './components/EditHabitModal';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.TRACKER);
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('h_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  const [logs, setLogs] = useState<HabitLog>(() => {
    const saved = localStorage.getItem('h_logs');
    return saved ? JSON.parse(saved) : {};
  });
  const [sleepLogs, setSleepLogs] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('h_sleep');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Modal State
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Persist Data
  useEffect(() => {
    localStorage.setItem('h_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('h_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('h_sleep', JSON.stringify(sleepLogs));
  }, [sleepLogs]);

  const handleToggleHabit = useCallback((habitId: string, dateKey: string) => {
    setLogs(prev => {
      const habitLogs = prev[habitId] || {};
      return {
        ...prev,
        [habitId]: {
          ...habitLogs,
          [dateKey]: !habitLogs[dateKey]
        }
      };
    });
  }, []);

  const handleAddHabit = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: 'New Habit',
      emoji: '✨',
      color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)]
    };
    setHabits([...habits, newHabit]);
    // Immediately open modal for the newly added habit
    setEditingHabit(newHabit);
  };

  const handleUpdateHabit = (id: string, name: string, emoji: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, name, emoji } : h));
    setEditingHabit(null);
  };

  const handleRemoveHabit = (id: string) => {
    if (confirm('Delete this habit and all its progress?')) {
      setHabits(habits.filter(h => h.id !== id));
      setLogs(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleUpdateSleep = (dateKey: string, hours: number) => {
    setSleepLogs(prev => ({ ...prev, [dateKey]: hours }));
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800">
      {/* Sidebar Navigation (Desktop) / Top Bar (Mobile) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold">
            26
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight">Ethereal Tracker</h1>
        </div>
        
        <div className="flex bg-gray-50 p-1 rounded-xl">
          {[
            { id: ViewMode.TRACKER, label: 'Tracker', icon: '📝' },
            { id: ViewMode.DASHBOARD, label: 'Analytics', icon: '📊' },
            { id: ViewMode.SLEEP, label: 'Sleep', icon: '🌙' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                view === tab.id 
                  ? 'bg-white shadow-sm text-indigo-600 scale-105' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={handleAddHabit}
          className="hidden sm:flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <span>+</span>
          <span>New Habit</span>
        </button>
      </nav>

      <main className="pt-24 px-4 sm:px-8 max-w-[1600px] mx-auto pb-10">
        {view === ViewMode.TRACKER && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col h-[75vh]">
            <div className="flex-grow overflow-auto custom-scrollbar">
              <div className="inline-block min-w-full align-middle">
                {/* Header Row */}
                <div className="flex sticky top-0 z-30 bg-[#f9fafb] border-b border-gray-200">
                  <div className="sticky left-0 z-40 w-64 min-w-[256px] bg-[#f9fafb] border-r border-gray-200 p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Habit List
                  </div>
                  <div className="flex">
                    {MONTHS.map(month => (
                      <div key={month.name} className="flex border-r-2 border-gray-200/50">
                        <div 
                          className="px-4 py-4 text-xs font-bold text-indigo-400 uppercase tracking-widest bg-[#f4f7f6]"
                          style={{ width: `${month.days * 40}px` }}
                        >
                          {month.name} 2026
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Row */}
                <div className="flex bg-[#fcfdfd] border-b border-gray-100 sticky top-12 z-20">
                  <div className="sticky left-0 z-40 w-64 min-w-[256px] bg-[#fcfdfd] border-r border-gray-200"></div>
                  <div className="flex">
                    {MONTHS.map((month) => (
                      <div key={month.name} className="flex border-r-2 border-gray-200/50">
                        {Array.from({ length: month.days }).map((_, dIdx) => (
                          <div key={dIdx} className="w-10 h-10 flex flex-col items-center justify-center text-[10px] text-gray-400 border-r border-gray-100">
                            <span className="font-bold text-gray-300">{dIdx + 1}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rows */}
                {habits.map(habit => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    months={MONTHS}
                    logs={logs[habit.id] || {}}
                    onToggle={(dateKey) => handleToggleHabit(habit.id, dateKey)}
                    onEdit={() => setEditingHabit(habit)}
                    onRemove={() => handleRemoveHabit(habit.id)}
                  />
                ))}

                {habits.length === 0 && (
                  <div className="p-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4">🌱</div>
                    <p className="text-gray-400 font-medium">Start your 2026 journey by adding a habit.</p>
                    <button onClick={handleAddHabit} className="mt-4 text-indigo-500 font-bold hover:underline">Add First Habit</button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Spreadsheet Stats Footer */}
            <div className="bg-[#f9fafb] border-t border-gray-100 p-4 flex items-center justify-between text-xs text-gray-500">
               <div className="flex items-center space-x-6">
                  <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span> Success</span>
                  <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-200 mr-2"></span> Missed</span>
               </div>
               <div>2026 Year Overview • Non-Leap Year</div>
            </div>
          </div>
        )}

        {view === ViewMode.DASHBOARD && (
          <Analytics habits={habits} logs={logs} sleepLogs={sleepLogs} />
        )}

        {view === ViewMode.SLEEP && (
          <SleepTracker sleepLogs={sleepLogs} onUpdate={handleUpdateSleep} />
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={handleAddHabit}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl z-50 hover:scale-110 active:scale-95 transition-all"
      >
        +
      </button>

      {/* Modals */}
      {editingHabit && (
        <EditHabitModal 
          habit={editingHabit} 
          onSave={handleUpdateHabit} 
          onClose={() => setEditingHabit(null)} 
        />
      )}
    </div>
  );
};

export default App;
