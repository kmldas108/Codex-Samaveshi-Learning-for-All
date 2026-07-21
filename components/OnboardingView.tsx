import React, { useState } from 'react';
import { UserPreferences, UserDisability } from '../types';
import { DISABILITY_OPTIONS, SUPPORTED_LANGUAGES, GRADE_OPTIONS } from '../constants';

interface OnboardingViewProps {
  prefs: UserPreferences;
  onComplete: (prefs: UserPreferences) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ prefs, onComplete }) => {
  const [localPrefs, setLocalPrefs] = useState(prefs);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localPrefs.name.trim()) {
        onComplete(localPrefs);
    }
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-yellow-100 via-purple-100 to-cyan-100 flex flex-col items-center justify-center p-4 md:p-6 animate-fadeIn font-sans selection:bg-pink-200">
      
      {/* Playful Container */}
      <div className="bg-white/70 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 md:p-10 border border-white/60 relative overflow-hidden">
        
        {/* Decorative Background Blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/50 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-200/50 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>

        <div className="text-center mb-8 relative z-10">
            <div className="text-6xl mb-4 animate-bounce inline-block">🎓</div>
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight drop-shadow-sm">Samaveshi</h1>
            <p className="text-slate-600 text-lg font-medium">Your Magical Learning Bridge! 🌈</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Name Input - Big & Friendly */}
            <div className="group transition-all">
                <div className="bg-white p-2 rounded-3xl shadow-sm border-2 border-transparent group-focus-within:border-purple-300 group-focus-within:shadow-purple-100 group-focus-within:shadow-lg transition-all">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mt-1">My Name is</label>
                    <input 
                        required
                        type="text" 
                        value={localPrefs.name}
                        onChange={e => setLocalPrefs({...localPrefs, name: e.target.value})}
                        placeholder="e.g. Aarav"
                        className="w-full p-3 bg-transparent outline-none text-2xl font-bold text-slate-800 placeholder:text-slate-300 rounded-xl"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Grade Selector */}
                <div className="group">
                    <div className="bg-white p-2 rounded-3xl shadow-sm border-2 border-transparent group-focus-within:border-blue-300 group-focus-within:shadow-blue-100 group-focus-within:shadow-lg transition-all h-full">
                         <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mt-1">I am in</label>
                        <select 
                            value={localPrefs.grade}
                            onChange={e => setLocalPrefs({...localPrefs, grade: e.target.value})}
                            className="w-full p-3 bg-transparent outline-none text-lg font-bold text-slate-800 cursor-pointer"
                        >
                            {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>

                {/* Language Selector */}
                <div className="group">
                    <div className="bg-white p-2 rounded-3xl shadow-sm border-2 border-transparent group-focus-within:border-pink-300 group-focus-within:shadow-pink-100 group-focus-within:shadow-lg transition-all h-full">
                         <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 mt-1">I speak</label>
                        <select 
                            value={localPrefs.language}
                            onChange={e => setLocalPrefs({...localPrefs, language: e.target.value})}
                            className="w-full p-3 bg-transparent outline-none text-lg font-bold text-slate-800 cursor-pointer"
                        >
                            {SUPPORTED_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Accessibility Buttons */}
            <div>
                <label className="block text-center text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">How do you learn best?</label>
                <div className="grid grid-cols-1 gap-3">
                    {DISABILITY_OPTIONS.map(opt => {
                        const isSelected = localPrefs.disability === opt.id;
                        return (
                            <button
                                type="button"
                                key={opt.id}
                                onClick={() => setLocalPrefs({...localPrefs, disability: opt.id as UserDisability})}
                                className={`p-4 rounded-2xl flex items-center gap-4 transition-all transform duration-200 ${
                                    isSelected 
                                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-purple-200 scale-[1.02]' 
                                    : 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow-md'
                                }`}
                            >
                                <span className="text-3xl bg-white/20 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm">
                                    {opt.icon}
                                </span>
                                <span className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                    {opt.label}
                                </span>
                                {isSelected && <span className="ml-auto text-white text-xl">✓</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full bg-black hover:bg-slate-800 text-white font-bold py-5 rounded-3xl text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200 mt-6 flex items-center justify-center gap-2 group"
            >
                <span>Let's Start!</span>
                <span className="group-hover:translate-x-1 transition-transform">🚀</span>
            </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingView;