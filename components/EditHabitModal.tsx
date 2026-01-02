
import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { PASTEL_COLORS } from '../constants';

interface EditHabitModalProps {
  habit: Habit;
  onSave: (id: string, name: string, emoji: string) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['✨', '🧘', '💧', '📖', '🏃', '📵', '🥗', '💡', '🌱', '💤', '✍️', '🍎', '💪', '🧠', '☀️'];

const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, onSave, onClose }) => {
  const [name, setName] = useState(habit.name);
  const [emoji, setEmoji] = useState(habit.emoji);

  useEffect(() => {
    setName(habit.name);
    setEmoji(habit.emoji);
  }, [habit]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif font-bold text-gray-800">Edit Habit</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Habit Name</label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all font-medium"
                placeholder="e.g. Read for 30 mins"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icon / Emoji</label>
              <div className="grid grid-cols-5 gap-2">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`h-12 flex items-center justify-center text-xl rounded-xl border-2 transition-all ${
                      emoji === e 
                        ? 'border-indigo-400 bg-indigo-50 scale-105' 
                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-100 text-gray-500 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(habit.id, name, emoji)}
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHabitModal;
