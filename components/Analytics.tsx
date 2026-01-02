
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { Habit, HabitLog, SleepEntry } from '../types';
import { MONTHS, YEAR } from '../constants';
import { getDateKey, getWeekNumber } from '../utils/dateUtils';

interface AnalyticsProps {
  habits: Habit[];
  logs: HabitLog;
  sleepLogs: Record<string, number>;
}

const Analytics: React.FC<AnalyticsProps> = ({ habits, logs, sleepLogs }) => {
  // Monthly Data Calculation
  const monthlyData = useMemo(() => {
    return MONTHS.map((month, mIdx) => {
      let totalCompleted = 0;
      let totalCheckboxes = month.days * habits.length;

      habits.forEach(habit => {
        const habitLogs = logs[habit.id] || {};
        for (let d = 1; d <= month.days; d++) {
          if (habitLogs[getDateKey(mIdx, d)]) {
            totalCompleted++;
          }
        }
      });

      const accuracy = totalCheckboxes > 0 ? (totalCompleted / totalCheckboxes) * 100 : 0;

      return {
        name: month.name.substring(0, 3),
        accuracy: Math.round(accuracy),
        completed: totalCompleted
      };
    });
  }, [habits, logs]);

  // Weekly Data Calculation (Simulated aggregation for current data)
  const weeklyData = useMemo(() => {
    const weeks: Record<number, number> = {};
    const totalPossiblePerWeek: Record<number, number> = {};

    habits.forEach(habit => {
      const habitLogs = logs[habit.id] || {};
      MONTHS.forEach((month, mIdx) => {
        for (let d = 1; d <= month.days; d++) {
          const date = new Date(YEAR, mIdx, d);
          const week = getWeekNumber(date);
          weeks[week] = (weeks[week] || 0) + (habitLogs[getDateKey(mIdx, d)] ? 1 : 0);
          totalPossiblePerWeek[week] = (totalPossiblePerWeek[week] || 0) + 1;
        }
      });
    });

    return Object.keys(weeks).map(w => ({
      week: `W${w}`,
      value: weeks[Number(w)],
      percentage: Math.round((weeks[Number(w)] / totalPossiblePerWeek[Number(w)]) * 100)
    })).slice(0, 52); // Keep first 52 weeks
  }, [habits, logs]);

  const totalYearlyCompleted = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.completed, 0);
  }, [monthlyData]);

  const yearlyAccuracy = useMemo(() => {
    const sum = monthlyData.reduce((acc, curr) => acc + curr.accuracy, 0);
    return Math.round(sum / 12);
  }, [monthlyData]);

  return (
    <div className="space-y-8 pb-20">
      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Yearly Completion</span>
          <span className="text-4xl font-serif font-bold text-sage-600">{yearlyAccuracy}%</span>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
             <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: `${yearlyAccuracy}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Total Habits 2026</span>
          <span className="text-4xl font-serif font-bold text-gray-800">{totalYearlyCompleted}</span>
          <span className="text-xs text-gray-400 mt-2">Checkboxes ticked across all months</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Top Performer</span>
          <span className="text-lg font-medium text-gray-700 mt-2">
            {habits.length > 0 ? habits[0].name : 'No habits yet'}
          </span>
          <span className="text-xs text-green-500 font-bold mt-1">Consistency 🔥</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Performance (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#A7C957' : '#E9EDC9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Habits Tally</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BDE0FE" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#BDE0FE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="week" hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#8ECAE6" fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
