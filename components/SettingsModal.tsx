import React from 'react';
import { UserPreferences, UserDisability } from '../types';
import { SUPPORTED_LANGUAGES, DISABILITY_OPTIONS, GRADE_OPTIONS } from '../constants';

interface SettingsModalProps {
  prefs: UserPreferences;
  onUpdate: (newPrefs: UserPreferences) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ prefs, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center animate-fadeIn p-4">
      <div className="bg-white/90 backdrop-blur-xl w-full md:w-[600px] rounded-[2.5rem] max-h-[85vh] overflow-y-auto flex flex-col shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-white/50">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-10 rounded-t-[2.5rem]">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Your Profile</h2>
            <p className="text-slate-500 text-sm font-medium">Customize your learning magic</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-2">Name</label>
                <input 
                  type="text" 
                  value={prefs.name}
                  onChange={(e) => onUpdate({ ...prefs, name: e.target.value })}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-purple-300 focus:shadow-lg focus:shadow-purple-100 outline-none text-lg font-bold text-slate-700 transition-all"
                />
             </div>
             <div className="group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-2">Grade</label>
                <div className="relative">
                    <select 
                        value={prefs.grade}
                        onChange={(e) => onUpdate({ ...prefs, grade: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-300 focus:shadow-lg focus:shadow-blue-100 outline-none text-lg font-bold text-slate-700 appearance-none cursor-pointer transition-all"
                    >
                        {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                </div>
             </div>
          </div>

          {/* Language Section */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-3">I learn in</label>
            <div className="flex flex-wrap gap-3">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => onUpdate({ ...prefs, language: lang })}
                  className={`py-3 px-5 rounded-2xl text-sm font-bold transition-all transform active:scale-95 ${
                    prefs.language === lang 
                      ? 'bg-slate-800 text-white shadow-lg scale-105' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-2">My Location</label>
            <input 
              type="text" 
              value={prefs.location}
              onChange={(e) => onUpdate({ ...prefs, location: e.target.value })}
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-pink-300 focus:shadow-lg focus:shadow-pink-100 outline-none text-lg font-bold text-slate-700 transition-all"
              placeholder="e.g. Mumbai, Rural Texas..."
            />
          </div>

          {/* Disability / Accessibility Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mb-3">Accessibility Mode</label>
            <div className="space-y-3">
              {DISABILITY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onUpdate({ ...prefs, disability: opt.id as UserDisability })}
                  className={`w-full p-4 rounded-3xl border-2 flex items-center gap-4 text-left transition-all ${
                    prefs.disability === opt.id 
                      ? 'border-purple-400 bg-purple-50 shadow-md' 
                      : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-3xl bg-white p-2 rounded-2xl shadow-sm">{opt.icon}</span>
                  <div>
                    <span className={`block font-bold text-lg ${prefs.disability === opt.id ? 'text-purple-900' : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                  </div>
                  {prefs.disability === opt.id && (
                    <div className="ml-auto text-purple-600 bg-white rounded-full p-1 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white/80 rounded-b-[2.5rem] backdrop-blur-md sticky bottom-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;