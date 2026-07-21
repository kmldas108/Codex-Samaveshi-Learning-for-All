import React, { useState, useRef, useEffect } from 'react';
import { EducationalContent, UserPreferences, AppMode, ChatMessage } from '../types';
import { ICONS } from '../constants';
import { generateSpeech, getAudioContext, sendChatMessage, decodeSpeechAudio, transcribeAudio } from '../services/openaiService';

interface ResultViewProps {
  content: EducationalContent;
  prefs: UserPreferences;
  onBack: () => void;
  inputSource?: string | null;
  mimeType?: string;
  onQuizScoreUpdate?: (score: { correct: number; total: number }) => void;
}

// Move Card definition here to avoid type inference issues
const Card = ({ children, color = "bg-white", border = "border-white", className = "" }: { children?: React.ReactNode, color?: string, border?: string, className?: string }) => (
  <div className={`${color} p-6 md:p-8 rounded-[2rem] border ${border} shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] ${className}`}>
      {children}
  </div>
);

const getLangCode = (language: string): string => {
  switch (language) {
    case "Hindi":
    case "Hinglish":
      return "hi-IN";
    case "Spanish":
      return "es-ES";
    case "French":
      return "fr-FR";
    case "Tamil":
      return "ta-IN";
    case "Telugu":
      return "te-IN";
    case "Kannada":
      return "kn-IN";
    case "Bangla":
      return "bn-IN";
    case "Assamese":
      return "as-IN";
    case "Marathi":
      return "mr-IN";
    case "Odia":
      return "or-IN";
    default:
      return "en-US";
  }
};

const ResultView: React.FC<ResultViewProps> = ({ content, prefs, onBack, inputSource, mimeType, onQuizScoreUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Refs for Audio Playback
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const autoPlayHasRunRef = useRef(false);

  const handlePlayAudio = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // If clicking the same text that is currently playing, treat as "Stop"
    if (isPlaying && playingText === textToSpeak) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setPlayingText(null);
      return;
    }

    // Stop any ongoing browser speech synthesis
    window.speechSynthesis.cancel();

    setPlayingText(textToSpeak);
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getLangCode(prefs.language);

    utterance.onend = () => {
      setIsPlaying(false);
      setPlayingText(null);
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsPlaying(false);
      setPlayingText(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (autoPlayHasRunRef.current) return;
    autoPlayHasRunRef.current = true;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    let timerId: any = null;
    const autoPlay = async () => {
        if (content.mode === AppMode.HEAR_IMAGES) {
            timerId = setTimeout(() => {
                const speechText = prefs.disability === 'VISUAL'
                  ? `${content.topic || ""}. Visual description: ${content.spatialDescription || ""}. Here is a tactile representation suggestion: ${content.tactileModelSuggestion || ""}.`
                  : (content.spatialDescription || "");
                if (speechText) {
                    handlePlayAudio(speechText);
                }
            }, 500);
        }
    };
    autoPlay();
    return () => {
        if (timerId) {
            clearTimeout(timerId);
        }
        if (audioSourceRef.current) {
            try { audioSourceRef.current.stop(); } catch (e) {}
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };
  }, []);

  // Effect to calculate and bubble up quiz scores
  useEffect(() => {
    if (content.quiz && content.quiz.length > 0 && onQuizScoreUpdate) {
      let correct = 0;
      const total = content.quiz.length;
      let answeredCount = 0;

      content.quiz.forEach((q, idx) => {
        if (selectedAnswers[idx]) {
          answeredCount++;
          if (selectedAnswers[idx] === q.correctAnswer) {
            correct++;
          }
        }
      });

      if (answeredCount === total) {
        onQuizScoreUpdate({ correct, total });
      }
    }
  }, [selectedAnswers, content.quiz, onQuizScoreUpdate]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = handleStopRecording;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required to record audio.");
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    if (!mediaRecorderRef.current) return;

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = (reader.result as string).split(',')[1];
      setIsTranscribing(true);
      try {
         const transcribedText = await transcribeAudio(base64Audio, prefs.language);
         if (transcribedText) {
             setInputMessage(transcribedText);
         }
      } catch(e) {
         console.error("Transcription error", e);
         alert("Failed to transcribe audio.");
      } finally {
         setIsTranscribing(false);
      }
    };
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: inputMessage }];
    setChatHistory(newHistory);
    setInputMessage('');
    setChatLoading(true);
    try {
      const response = await sendChatMessage(newHistory, inputMessage, null, content, prefs);
      setChatHistory([...newHistory, { role: 'model', text: response }]);
    } catch (e) { console.error(e); } finally { setChatLoading(false); }
  };

  const AssetPreview = () => {
    if (!inputSource) return null;
    return (
        <div className="flex justify-center bg-white/50 backdrop-blur-sm p-4 rounded-[2rem] border border-white mb-8 shadow-sm">
            {mimeType?.startsWith('image/') && (
                <img src={inputSource} alt="Analyzed content" className="max-h-64 w-auto object-contain rounded-2xl shadow-sm" />
            )}
            {mimeType?.startsWith('video/') && (
                <video src={inputSource} controls className="max-h-80 w-full rounded-2xl shadow-sm" />
            )}
            {mimeType?.startsWith('audio/') && (
                 <div className="flex flex-col items-center w-full">
                    <div className="text-6xl mb-4 animate-bounce">🎵</div>
                    <audio src={inputSource} controls className="w-full" />
                </div>
            )}
        </div>
    );
  };

  const HearImagesView = () => (
    <div className="space-y-6">
      <AssetPreview />
      <Card color="bg-blue-50/80 backdrop-blur-sm" border="border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start gap-4 mb-4">
          <h2 className="text-xl md:text-2xl font-black text-blue-900">👀 Spatial Description</h2>
          <button 
            onClick={() => handlePlayAudio(content.spatialDescription || "")}
            disabled={isAudioLoading && playingText !== content.spatialDescription}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all shadow-sm font-bold text-sm ${
                isPlaying && playingText === content.spatialDescription
                ? 'bg-red-100 text-red-600' 
                : 'bg-blue-600 text-white hover:scale-105'
            }`}
          >
            {isAudioLoading && playingText === content.spatialDescription ? "Loading..." : isPlaying && playingText === content.spatialDescription ? "Stop" : "Listen"}
          </button>
        </div>
        <p className="text-lg leading-relaxed text-blue-900 font-medium">{content.spatialDescription}</p>
      </Card>
      
      <Card color="bg-amber-50/80 backdrop-blur-sm" border="border-amber-100">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-black text-amber-900">🖐️ Tactile Model Idea</h2>
          <button 
            onClick={() => handlePlayAudio(content.tactileModelSuggestion || "")}
            disabled={isAudioLoading && playingText !== content.tactileModelSuggestion}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all shadow-sm font-bold text-sm ${
                isPlaying && playingText === content.tactileModelSuggestion
                ? 'bg-red-100 text-red-600' 
                : 'bg-amber-600 text-white hover:scale-105'
            }`}
          >
            {isAudioLoading && playingText === content.tactileModelSuggestion ? "Loading..." : isPlaying && playingText === content.tactileModelSuggestion ? "Stop" : "Listen"}
          </button>
        </div>
        <p className="text-amber-900 text-lg font-medium">{content.tactileModelSuggestion}</p>
      </Card>
    </div>
  );

  const SeeSoundView = () => (
    <div className="space-y-6">
      <AssetPreview />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <Card color="bg-purple-50/80" border="border-purple-100">
                <h3 className="text-sm font-black text-purple-900 uppercase tracking-wider mb-2">Tone Analysis</h3>
                <p className="text-2xl font-bold text-purple-700">{content.emotionalTone}</p>
            </Card>
            <Card className="h-[400px] overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-black mb-4 sticky top-0 bg-white/95 pb-2 backdrop-blur-sm z-10">Visual Transcript</h2>
                <p className="whitespace-pre-line text-slate-700 leading-relaxed font-medium">{content.transcript}</p>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-black mb-2 text-slate-800">Summary ({prefs.language})</h2>
                <p className="text-slate-600 text-lg">{content.summary}</p>
            </Card>
            <Card color="bg-yellow-50/80" border="border-yellow-100">
                <h2 className="text-sm font-black text-yellow-900 uppercase mb-4">Key Terms</h2>
                <div className="flex flex-wrap gap-2">
                {content.keyTerms?.map((term, i) => (
                    <span key={i} className="bg-white text-yellow-900 px-4 py-2 rounded-xl text-sm font-bold shadow-sm border border-yellow-100">{term}</span>
                ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );

  const EasyReadView = () => (
    <div className="space-y-8">
      <AssetPreview />
      <Card color="bg-green-50/90" border="border-green-100">
        <h2 className="text-3xl font-bold text-green-900 mb-6 font-serif">Simplified Text</h2>
        <div className="prose prose-lg text-slate-800 leading-loose font-serif font-medium">
            {content.simplifiedText}
        </div>
        <div className="mt-8 pt-6 border-t border-green-200/50">
             <h3 className="font-bold text-green-800 mb-2">💡 Local Analogy</h3>
             <p className="text-green-700 text-lg italic bg-green-100/50 p-4 rounded-xl">{content.analogies}</p>
        </div>
        <button 
             onClick={() => handlePlayAudio(content.simplifiedText || "")}
             className="mt-6 bg-green-600 text-white font-bold flex items-center gap-2 hover:bg-green-700 px-6 py-3 rounded-2xl transition-all hover:scale-105 shadow-md shadow-green-200"
        >
             {isPlaying && playingText === content.simplifiedText ? "Stop Reading" : "Read Aloud"}
        </button>
      </Card>

      {content.quiz && content.quiz.length > 0 && (
        <Card border="border-slate-100">
          <h2 className="text-2xl font-black mb-6 text-slate-800">⚡ Quick Check</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.quiz.map((q, idx) => {
              const selected = selectedAnswers[idx];
              return (
                <div key={idx} className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4">{idx + 1}. {q.question}</p>
                  <div className="space-y-3">
                    {q.options.map((opt, oi) => {
                      const isSelected = selected === opt;
                      const isCorrect = opt === q.correctAnswer;
                      let btnStyle = "border-slate-200 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-900";
                      
                      if (selected) {
                        if (isSelected) {
                          btnStyle = isCorrect 
                            ? "border-green-500 bg-green-100 text-green-900 ring-2 ring-green-500/20" 
                            : "border-red-500 bg-red-100 text-red-900 ring-2 ring-red-500/20";
                        } else if (isCorrect) {
                          btnStyle = "border-green-500 bg-green-50 text-green-800";
                        } else {
                          btnStyle = "border-slate-200 bg-white opacity-60 cursor-not-allowed";
                        }
                      }
                      
                      return (
                        <button 
                          key={oi} 
                          disabled={!!selected}
                          onClick={() => {
                            setSelectedAnswers(prev => ({ ...prev, [idx]: opt }));
                          }}
                          className={`block w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${btnStyle}`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{opt}</span>
                            {selected && isSelected && (
                              <span>{isCorrect ? "✅" : "❌"}</span>
                            )}
                            {selected && !isSelected && isCorrect && (
                              <span className="text-green-600 text-xs font-bold font-sans">Correct answer</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {Object.keys(selectedAnswers).length > 0 && (
            <button
              onClick={() => setSelectedAnswers({})}
              className="mt-6 text-sm text-slate-500 hover:text-slate-800 font-bold underline transition-colors"
            >
              Reset Quiz
            </button>
          )}
        </Card>
      )}
    </div>
  );

  const ClassPackView = () => (
    <div className="space-y-6">
      <AssetPreview />
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800">Student Notes</h2>
                <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 border border-slate-200">PRINTABLE</span>
            </div>
            <div className="prose text-slate-600 whitespace-pre-line leading-relaxed">
                {content.studentNotes}
            </div>
        </Card>

        <Card color="bg-green-50/90" border="border-green-100" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150 origin-top-right">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 3.5c.59 0 7.54.02 9.34.5a3.02 3.02 0 0 1 2.12 2.15C24 8.05 24 12 24 12v.04c0 .43-.03 4.03-.5 5.8A3.02 3.02 0 0 1 21.38 20c-1.76.48-8.45.5-9.3.51h-.17c-.85 0-7.54-.03-9.29-.5A3.02 3.02 0 0 1 .5 17.84c-.42-1.61-.49-4.7-.5-5.6v-.5c.01-.9.08-3.99.5-5.6a3.02 3.02 0 0 1 2.12-2.14c1.8-.49 8.75-.51 9.34-.51zM12 5.4a3.2 3.2 0 0 0-3.2 3.2v.29c0 .47.09.93.24 1.36L5.04 16h4.42c.63 0 1.22-.27 1.62-.74l.92-1.07 1.92 2.24c.4.47.99.74 1.62.74h2.92L14.5 12.2a3.2 3.2 0 0 0 .7-2.1V9.8a3.2 3.2 0 0 0-3.2-3.2h0z"/></svg>
            </div>
            <h2 className="text-2xl font-black text-green-900 mb-4">Parent WhatsApp Summary</h2>
            <div className="bg-white/80 p-5 rounded-2xl shadow-sm text-slate-800 mb-6 whitespace-pre-line border border-green-100 text-sm leading-relaxed">
                {content.parentSummary}
            </div>
            <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all hover:scale-[1.02] shadow-lg shadow-green-200">
                Copy to Clipboard
            </button>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-white/50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-all active:scale-95 shadow-sm border border-transparent hover:border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-slate-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
             <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-800 line-clamp-1">{content.topic}</h1>
             <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">{content.mode.replace('_', ' ')}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full custom-scrollbar pb-32">
        {prefs.disability === 'VISUAL' && (
           <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white rounded-[2rem] mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md border border-white/10 animate-fadeIn">
               <div className="flex items-center gap-4">
                   <span className="text-4xl animate-pulse">🔊</span>
                   <div>
                       <h3 className="text-xl font-extrabold tracking-tight">Vocal Guide Enabled</h3>
                       <p className="text-white/80 text-sm font-medium">Listening context automatically speaks the result aloud. Tap below to interrupt or restart any time!</p>
                   </div>
               </div>
               <button
                   onClick={() => {
                     const fullText = `${content.topic || ""}. Visual description: ${content.spatialDescription || ""}. Here is a tactile representation suggestion: ${content.tactileModelSuggestion || ""}.`;
                     handlePlayAudio(fullText);
                   }}
                   disabled={isAudioLoading}
                   className="bg-white text-blue-900 font-black px-6 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all text-sm shadow-md whitespace-nowrap"
               >
                   {isPlaying && playingText?.includes(content.topic) ? "Stop Guide" : "Play Full Guide"}
               </button>
           </div>
        )}
        {content.mode === AppMode.HEAR_IMAGES && <HearImagesView />}
        {content.mode === AppMode.SEE_SOUND && <SeeSoundView />}
        {content.mode === AppMode.EASY_READ && <EasyReadView />}
        {content.mode === AppMode.CLASS_PACK && <ClassPackView />}
        
        {/* Chat Section */}
        <div className="mt-12">
          <h3 className="text-xl font-black text-slate-700 mb-4 ml-2">Ask Samaveshi</h3>
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-white p-2 shadow-lg w-full">
             <div className="space-y-4 mb-4 max-h-60 overflow-y-auto p-4 custom-scrollbar">
               {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-center gap-2 max-w-[85%] px-6 py-3 rounded-2xl text-base font-medium shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}>
                      <span>{msg.text}</span>
                      {msg.role === 'model' && (
                        <button 
                            onClick={() => handlePlayAudio(msg.text)} 
                            className="ml-2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            {isPlaying && playingText === msg.text ? ICONS.stop : ICONS.speaker}
                        </button>
                      )}
                    </div>
                  </div>
               ))}
               {chatLoading && (
                   <div className="flex gap-2 ml-4">
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                   </div>
               )}
             </div>
             
             {chatHistory.length === 0 && (
                <div className="flex flex-wrap gap-2 mb-4 px-4">
                  {content.followUpSuggestions?.map((s, i) => (
                    <button key={i} onClick={() => setInputMessage(s)} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
             )}

             <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-[2rem]">
               <input 
                  className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-800 font-medium placeholder:text-slate-400"
                  placeholder={isTranscribing ? "Listening..." : "Type your question..."}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isRecording || isTranscribing}
               />
               
               <button 
                onClick={isRecording ? () => mediaRecorderRef.current?.stop() : handleStartRecording}
                className={`p-3 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white shadow-red-200 shadow-lg' : 'bg-white hover:bg-slate-100 text-slate-600 shadow-sm'}`}
                disabled={isTranscribing}
               >
                {isTranscribing ? ICONS.spinner : (isRecording ? ICONS.stop : ICONS.mic)}
               </button>

               <button 
                onClick={handleSendMessage} 
                className="bg-black text-white p-3 rounded-full hover:bg-slate-800 disabled:opacity-50 transition-transform active:scale-95 shadow-md"
                disabled={isRecording || isTranscribing}
               >
                  {ICONS.send}
               </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultView;
