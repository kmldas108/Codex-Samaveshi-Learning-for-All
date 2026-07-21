import React, { useState, useEffect, useRef } from 'react';
import { AppMode, UserPreferences, EducationalContent, UserDisability } from './types';
import { DEFAULT_PREFERENCES, APP_MODES, ICONS } from './constants';
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import SettingsModal from './components/SettingsModal';
import OnboardingView from './components/OnboardingView';
import ClassPackForm from './components/ClassPackForm';
import { analyzeContent } from './services/openaiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.ONBOARDING);
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<AppMode>(AppMode.HOME);
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Input State
  const [currentInputSrc, setCurrentInputSrc] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string>('');
  const [lastQuizScore, setLastQuizScore] = useState<{ correct: number; total: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Check if user has a name, if so skip onboarding
    if (prefs.name) {
        setMode(AppMode.HOME);
    }
  }, []);

  useEffect(() => {
    if (mode === AppMode.ANALYZING && prefs.disability === UserDisability.VISUAL) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Clears any queued speech
            let text = "Image uploaded successfully. I am now analyzing the image under Hear Images mode. Please wait...";
            let langCode = "en-US";
            
            if (prefs.language === "Hindi" || prefs.language === "Hinglish") {
                text = "चित्र सफलतापूर्वक अपलोड हो गया है। मैं अब इसका विश्लेषण कर रहा हूँ, कृपया प्रतीक्षा करें...";
                langCode = "hi-IN";
            } else if (prefs.language === "Spanish") {
                text = "Imagen subida con éxito. Ahora estoy analizando la imagen. Por favor, espere...";
                langCode = "es-ES";
            } else if (prefs.language === "French") {
                text = "Image téléchargée avec succès. J'analyse l'image maintenant. S'il vous plaît, attendez...";
                langCode = "fr-FR";
            } else if (prefs.language === "Tamil") {
                text = "படம் வெற்றிகரமாக பதிவேற்றப்பட்டது. நான் இப்போது அதை பகுப்பாய்வு செய்கிறேன், தயவுசெய்து காத்திருங்கள்...";
                langCode = "ta-IN";
            } else if (prefs.language === "Telugu") {
                text = "చిత్రం విజయవంతంగా అప్‌లోడ్ చేయబడింది. నేను ఇప్పుడు దానిని విశ్లేషిస్తున్నాను, దయచేసి వేచి ఉండండి...";
                langCode = "te-IN";
            } else if (prefs.language === "Kannada") {
                text = "ಚಿತ್ರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ. ನಾನು ಈಗ ಅದನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ಕಾಯಿರಿ...";
                langCode = "kn-IN";
            } else if (prefs.language === "Bangla") {
                text = "ছবিটি সফলভাবে আপলোড করা হয়েছে। আমি এখন এটি বিশ্লেষণ করছি, দয়া করে অপেক্ষা করুন...";
                langCode = "bn-IN";
            } else if (prefs.language === "Assamese") {
                text = "ছবিখন সফলভাৱে আপলোড কৰা হৈছে। মই এতিয়া ইয়াৰ বিশ্লেষণ কৰি আছোঁ, অনুগ্ৰহ কৰি অপেক্ষা কৰক...";
                langCode = "as-IN";
            } else if (prefs.language === "Marathi") {
                text = "चित्र यशस्वीरित्या अपलोड झाले आहे. मी आता त्याचे विश्लेषण करत आहे, कृपया प्रतीक्षा करा...";
                langCode = "mr-IN";
            } else if (prefs.language === "Odia") {
                text = "ଚିତ୍ର ସଫଳତାର ସହିତ ଅପଲୋଡ୍ ହୋଇଛି | ମୁଁ ବର୍ତ୍ତମାନ ଏହାର ବିଶ୍ଳେଷଣ କରୁଛି, ଦୟାକରି ଅପେକ୍ଷା କରନ୍ତୁ...";
                langCode = "or-IN";
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = langCode;
            window.speechSynthesis.speak(utterance);
        }
    }
    return () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };
  }, [mode, prefs.disability, prefs.language]);

  const handleOnboardingComplete = (newPrefs: UserPreferences) => {
      setPrefs(newPrefs);
      setMode(AppMode.HOME);
  };

  const handleModeSelect = (selectedMode: AppMode) => {
    setActiveAnalysisMode(selectedMode);
    if (selectedMode === AppMode.CLASS_PACK) {
      setMode(AppMode.CLASS_PACK);
    } else if (fileInputRef.current) {
        const accept = APP_MODES.find(m => m.id === selectedMode)?.accepts || "image/*";
        fileInputRef.current.accept = accept;
        fileInputRef.current.click();
    }
  };

  const handleClassPackSubmit = async (data: {
    subject: string;
    topic: string;
    performance: string;
    parentLanguage: string;
  }) => {
    setMode(AppMode.ANALYZING);
    setCurrentMimeType("text-based");
    setCurrentInputSrc(null);

    try {
      const result = await analyzeContent("placeholder", "text-based", AppMode.CLASS_PACK, prefs, data);
      setContent(result);
      setMode(AppMode.RESULT);
    } catch (error) {
      alert("Failed to generate Class Pack. Please try again.");
      setMode(AppMode.HOME);
    }
  };

  const handleProcessInput = async (base64Data: string, mimeType: string) => {
    setMode(AppMode.ANALYZING);
    setCurrentMimeType(mimeType);
    setCurrentInputSrc(`data:${mimeType};base64,${base64Data}`);

    try {
      const result = await analyzeContent(base64Data, mimeType, activeAnalysisMode, prefs);
      setContent(result);
      setMode(AppMode.RESULT);
    } catch (error) {
      alert("Failed to analyze content. Please try again.");
      setMode(AppMode.HOME);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        handleProcessInput(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Render Home Screen
  const renderHome = () => (
    <div className="flex flex-col h-full relative overflow-y-auto overflow-x-hidden">
      {/* Decorative Background Blobs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>
      <div className="fixed top-1/2 -right-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>
      <div className="fixed -bottom-32 left-1/2 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 sticky top-0 z-20">
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm">
          <span className="text-2xl animate-bounce">🎓</span>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Samaveshi</h1>
        </div>
        <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-slate-700 border border-white/50 shadow-sm">
                <span>👤 {prefs.name}</span>
                <span className="text-slate-300">|</span>
                <span className="text-purple-600">{prefs.language}</span>
             </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-3 bg-white hover:bg-white/80 text-slate-800 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 border border-white/50"
            >
              {ICONS.settings}
            </button>
        </div>
      </nav>

      {/* Main Content Grid */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-10 w-full max-w-7xl mx-auto relative z-10">
        <div className="mb-10 text-center w-full">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 drop-shadow-sm">
              Hi, {prefs.name}! 👋
            </h2>
            <p className="text-slate-600 text-lg font-medium">What magic shall we learn today?</p>
        </div>

        <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            {APP_MODES.map((appMode) => (
                <button
                    key={appMode.id}
                    onClick={() => handleModeSelect(appMode.id)}
                    className={`group relative flex flex-col items-start p-8 rounded-[2.5rem] border-4 border-transparent transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] text-left bg-white/80 backdrop-blur-sm hover:border-${appMode.color.split('-')[1]}-200`}
                >
                    <div className={`absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-transparent to-${appMode.color.split('-')[1]}-50 pointer-events-none`}></div>
                    
                    <div className="relative z-10 w-full">
                      <div className="flex justify-between w-full mb-6">
                          <span className="text-6xl filter drop-shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300">{appMode.icon}</span>
                          <div className="bg-slate-900 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                              {appMode.id === AppMode.CLASS_PACK ? ICONS.send : ICONS.upload}
                          </div>
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-black">{appMode.title}</h2>
                      <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 group-hover:bg-white/80">{appMode.subtitle}</span>
                      <p className="text-slate-600 font-medium leading-relaxed">{appMode.description}</p>
                    </div>
                </button>
            ))}
        </div>
      </main>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center h-full relative p-8 text-center animate-fadeIn overflow-hidden">
       {/* Background Animation */}
       <div className="absolute inset-0 bg-white/40 backdrop-blur-xl"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>

       <div className="relative z-10 bg-white/80 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border border-white/50 max-w-md w-full">
          <div className="text-6xl mb-6 animate-bounce">
              {APP_MODES.find(m => m.id === activeAnalysisMode)?.icon || "✨"}
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">Making Magic...</h2>
          <div className="space-y-2 text-slate-600 font-medium">
            <p>🎨 Customizing for <span className="text-purple-600 font-bold">{prefs.name}</span></p>
            <p>🌍 Adapting to <span className="text-blue-600 font-bold">{prefs.grade}</span></p>
            <p>🗣️ Translating to <span className="text-pink-600 font-bold">{prefs.language}</span></p>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 bg-slate-300 rounded-full animate-bounce delay-0"></div>
            <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce delay-200"></div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-yellow-50 via-purple-50 to-cyan-50 font-sans selection:bg-purple-200 selection:text-purple-900">
      {mode === AppMode.ONBOARDING && (
          <OnboardingView prefs={prefs} onComplete={handleOnboardingComplete} />
      )}

      {mode === AppMode.HOME && renderHome()}
      
      {mode === AppMode.CAMERA && (
        <CameraView 
          onCapture={(base64) => handleProcessInput(base64, 'image/jpeg')} 
          onClose={() => setMode(AppMode.HOME)} 
        />
      )}

      {mode === AppMode.ANALYZING && renderAnalyzing()}

      {mode === AppMode.RESULT && content && (
        <ResultView 
          content={content} 
          prefs={prefs} 
          inputSource={currentInputSrc}
          mimeType={currentMimeType}
          onBack={() => setMode(AppMode.HOME)} 
          onQuizScoreUpdate={(score) => setLastQuizScore(score)}
        />
      )}

      {mode === AppMode.CLASS_PACK && (
        <ClassPackForm 
          prefs={prefs} 
          lastQuizScore={lastQuizScore} 
          onSubmit={handleClassPackSubmit} 
          onCancel={() => setMode(AppMode.HOME)} 
        />
      )}

      {showSettings && (
        <SettingsModal 
          prefs={prefs} 
          onUpdate={setPrefs} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
};

export default App;
