
import React from 'react';
import { Habit, MonthData } from '../types';
import { getDateKey } from '../utils/dateUtils';

interface HabitRowProps {
  habit: Habit;
  months: MonthData[];
  logs: Record<string, boolean>;
  onToggle: (dateKey: string) => void;
  onEdit: () => void;
  onRemove: () => void;
}

const HabitRow: React.FC<HabitRowProps> = ({ habit, months, logs, onToggle, onEdit, onRemove }) => {
  return (
    <div className="flex border-b border-gray-100 hover:bg-gray-50/30 group transition-colors">
      {/* Sticky Left Column: Habit Name */}
      <div className="sticky left-0 z-20 w-64 min-w-[256px] flex items-center bg-white border-r border-gray-200 p-3 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
        <span className="mr-3 text-lg">{habit.emoji}</span>
        <div 
          className="flex-grow font-medium text-gray-700 truncate cursor-pointer"
          onClick={onEdit}
        >
          {habit.name}
        </div>
        <div className="flex opacity-0 group-hover:opacity-100 transition-all ml-2">
          <button 
            onClick={onEdit}
            className="text-gray-300 hover:text-indigo-500 transition-all p-1.5 rounded-lg hover:bg-indigo-50"
            title="Edit Habit"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={onRemove}
            className="text-gray-300 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-50"
            title="Delete Habit"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Daily Checkboxes grouped by Months */}
      <div className="flex">
        {months.map((month, mIdx) => (
          <div key={month.name} className="flex border-r-2 border-gray-200/50">
            {Array.from({ length: month.days }).map((_, dIdx) => {
              const day = dIdx + 1;
              const dateKey = getDateKey(mIdx, day);
              const isChecked = logs[dateKey] || false;
              
              return (
                <div 
                  key={dateKey}
                  onClick={() => onToggle(dateKey)}
                  className={`w-10 h-12 flex items-center justify-center border-r border-gray-100 cursor-pointer transition-all duration-200
                    ${isChecked ? 'bg-[#f0f9f1]' : 'hover:bg-gray-100/50'}`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-200 border
                    ${isChecked 
                      ? 'bg-green-400 border-green-500 scale-110 shadow-sm' 
                      : 'bg-white border-gray-300'}`}
                  >
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitRow;
