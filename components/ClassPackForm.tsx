import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { SUBJECT_OPTIONS, CURRICULUM_DATA, SUPPORTED_LANGUAGES } from '../constants';

interface ClassPackFormProps {
  prefs: UserPreferences;
  lastQuizScore: { correct: number; total: number } | null;
  onSubmit: (data: {
    subject: string;
    topic: string;
    performance: string;
    parentLanguage: string;
  }) => void;
  onCancel: () => void;
}

const ClassPackForm: React.FC<ClassPackFormProps> = ({
  prefs,
  lastQuizScore,
  onSubmit,
  onCancel,
}) => {
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [topic, setTopic] = useState('');
  const [parentLanguage, setParentLanguage] = useState('English');
  
  // Performance states
  const [useQuizScore, setUseQuizScore] = useState(!!lastQuizScore);
  const [performanceToggle, setPerformanceToggle] = useState('Excellent'); // 'Excellent' or 'NeedsAttention'

  // Get dynamic topics based on subject & grade
  const topics = CURRICULUM_DATA[subject]?.[prefs.grade] || [
    `Introduction to ${subject}`,
    `Core Concepts in ${subject}`,
    `Advanced ${subject} Topics`,
  ];

  // Auto-set first topic when topics change
  useEffect(() => {
    if (topics.length > 0) {
      setTopic(topics[0]);
    }
  }, [subject, prefs.grade]);

  // Handle auto-performance toggling based on quiz score
  useEffect(() => {
    if (lastQuizScore && useQuizScore) {
      const percentage = lastQuizScore.correct / lastQuizScore.total;
      if (percentage >= 0.7) {
        setPerformanceToggle('Excellent');
      } else {
        setPerformanceToggle('NeedsAttention');
      }
    }
  }, [lastQuizScore, useQuizScore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resolve performance string based on toggle/score
    let performanceString = '';
    if (lastQuizScore && useQuizScore) {
      const percent = Math.round((lastQuizScore.correct / lastQuizScore.total) * 100);
      const level = performanceToggle === 'Excellent' ? 'Excellent / Strong understanding' : 'Needs attention / Focus area';
      performanceString = `${level} (Quiz Score: ${lastQuizScore.correct}/${lastQuizScore.total} - ${percent}%)`;
    } else {
      performanceString = performanceToggle === 'Excellent' 
        ? 'Excellent / Strong understanding' 
        : 'Needs attention / Focus area';
    }

    onSubmit({
      subject,
      topic,
      performance: performanceString,
      parentLanguage,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-orange-50 via-amber-50 to-yellow-50 relative overflow-y-auto selection:bg-orange-200">
      {/* Decorative Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none animate-pulse delay-500"></div>

      <div className="bg-white/80 backdrop-blur-xl w-full max-w-2xl rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-6 sm:p-10 md:p-12 border border-white/60 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl filter drop-shadow-sm mb-4 inline-block animate-bounce">🏫</span>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Class Pack Generator</h1>
          <p className="text-slate-500 font-medium mt-1">Create study guides and WhatsApp summaries for parents</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Subject Selector */}
            <div className="group">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider ml-4 mb-2">Subject</label>
              <div className="relative">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-300 focus:shadow-lg focus:shadow-orange-100 outline-none text-base font-bold text-slate-700 appearance-none cursor-pointer transition-all"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
              </div>
            </div>

            {/* Class / Grade display (read-only) */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider ml-4 mb-2">Class Level</label>
              <div className="w-full p-4 bg-slate-100/80 border-2 border-transparent rounded-2xl text-base font-bold text-slate-500 cursor-not-allowed select-none">
                👤 {prefs.grade}
              </div>
            </div>
            
          </div>

          {/* Topic Covered Dropdown */}
          <div className="group">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider ml-4 mb-2">Topic Covered</label>
            <div className="relative">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-300 focus:shadow-lg focus:shadow-orange-100 outline-none text-base font-bold text-slate-700 appearance-none cursor-pointer transition-all"
              >
                {topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Parent Language Preference */}
            <div className="group">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider ml-4 mb-2">Parent Language Preference</label>
              <div className="relative">
                <select
                  value={parentLanguage}
                  onChange={(e) => setParentLanguage(e.target.value)}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-300 focus:shadow-lg focus:shadow-orange-100 outline-none text-base font-bold text-slate-700 appearance-none cursor-pointer transition-all"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
              </div>
            </div>

            {/* Performance Toggle */}
            <div className="flex flex-col justify-end">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider ml-4 mb-2">Student Performance</label>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border-2 border-transparent">
                <button
                  type="button"
                  onClick={() => setPerformanceToggle('Excellent')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all text-center ${
                    performanceToggle === 'Excellent'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🌟 Excellent
                </button>
                <button
                  type="button"
                  onClick={() => setPerformanceToggle('NeedsAttention')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all text-center ${
                    performanceToggle === 'NeedsAttention'
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ⚠️ Needs Attention
                </button>
              </div>
            </div>

          </div>

          {/* Optional Quiz Score Box */}
          {lastQuizScore && (
            <div className="bg-orange-50/60 border border-orange-100 rounded-3xl p-5 flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <h4 className="font-extrabold text-orange-950 text-sm">Last Quiz Score Available</h4>
                  <p className="text-orange-800 text-xs mt-0.5">
                    The student scored <strong>{lastQuizScore.correct}/{lastQuizScore.total}</strong> ({Math.round((lastQuizScore.correct / lastQuizScore.total) * 100)}%) on their last quiz.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useQuizScore}
                  onChange={(e) => setUseQuizScore(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                <span className="ml-2.5 text-xs font-black text-orange-950 uppercase tracking-wide">Link Score</span>
              </label>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-black hover:bg-slate-800 text-white font-bold rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-slate-100"
            >
              Generate Class Pack
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ClassPackForm;
