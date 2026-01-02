
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MONTHS, YEAR } from '../constants';
import { getDateKey } from '../utils/dateUtils';

interface SleepTrackerProps {
  sleepLogs: Record<string, number>;
  onUpdate: (dateKey: string, hours: number) => void;
}

const SleepTracker: React.FC<SleepTrackerProps> = ({ sleepLogs, onUpdate }) => {
  const [selectedMonth, setSelectedMonth] = useState(0);

  const monthData = useMemo(() => {
    const month = MONTHS[selectedMonth];
    return Array.from({ length: month.days }).map((_, i) => {
      const day = i + 1;
      const key = getDateKey(selectedMonth, day);
      return {
        day: day,
        hours: sleepLogs[key] || 0
      };
    });
  }, [selectedMonth, sleepLogs]);

  const avgSleep = useMemo(() => {
    const values = monthData.map(d => d.hours).filter(h => h > 0);
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  }, [monthData]);

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-800">Sleep Journal</h2>
          <p className="text-gray-400 text-sm">Monitor your recovery and rest trends.</p>
        </div>
        <div className="flex space-x-2 bg-gray-50 p-1 rounded-xl">
          {MONTHS.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => setSelectedMonth(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedMonth === idx ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {m.name.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthData}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CDB4DB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#CDB4DB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 12]} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <ReferenceLine y={8} stroke="#A2D2FF" strokeDasharray="3 3" label={{ position: 'right', value: 'Goal', fill: '#A2D2FF', fontSize: 10 }} />
                <Area type="monotone" dataKey="hours" stroke="#B19CD9" fillOpacity={1} fill="url(#colorSleep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Average Sleep</span>
            <span className="text-4xl font-serif font-bold text-indigo-900">{avgSleep}h</span>
            <span className="text-indigo-400 text-[10px] mt-1 italic">This month's avg.</span>
          </div>
          
          <div className="bg-white p-1 max-h-[180px] overflow-y-auto rounded-xl border border-gray-100 custom-scrollbar">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-white border-b border-gray-100">
                <tr>
                  <th className="px-3 py-2 font-semibold text-gray-500">Date</th>
                  <th className="px-3 py-2 font-semibold text-gray-500 text-right">Hours</th>
                </tr>
              </thead>
              <tbody>
                {monthData.map((d) => (
                  <tr key={d.day} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-gray-600">{MONTHS[selectedMonth].name.substring(0,3)} {d.day}</td>
                    <td className="px-3 py-2 text-right">
                      <input 
                        type="number" 
                        step="0.5"
                        min="0"
                        max="24"
                        value={d.hours || ''}
                        onChange={(e) => onUpdate(getDateKey(selectedMonth, d.day), parseFloat(e.target.value) || 0)}
                        placeholder="-"
                        className="w-12 bg-transparent text-right font-medium focus:outline-none focus:text-indigo-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
