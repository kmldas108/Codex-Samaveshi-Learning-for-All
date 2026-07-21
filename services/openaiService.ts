import { EducationalContent, UserPreferences, AppMode } from "../types";

export const analyzeContent = async (
  inputData: string, // Base64 string
  mimeType: string,
  mode: AppMode,
  prefs: UserPreferences,
  classPackData?: {
    subject: string;
    topic: string;
    performance: string;
    parentLanguage: string;
  }
): Promise<EducationalContent> => {
  try {
    const response = await fetch("/api/analyze-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputData, mimeType, mode, prefs, ...classPackData }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const result = await response.json();
    return result as EducationalContent;
  } catch (error: any) {
    console.error("Client side analyzeContent failed:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string, language: string): Promise<string> => {
  try {
    const response = await fetch("/api/generate-speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.audioBase64 || "";
  } catch (error) {
    console.error("Client side speech generation failed:", error);
    throw error;
  }
};

export const transcribeAudio = async (audioBase64: string, language: string): Promise<string> => {
  try {
    const response = await fetch("/api/transcribe-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioBase64, language }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Client side transcription failed:", error);
    return "";
  }
};

export const decodePCM16 = (base64Data: string, ctx: AudioContext): AudioBuffer => {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const bufferLength = bytes.length;
  const safeLength = bufferLength - (bufferLength % 2);
  
  const dataInt16 = new Int16Array(bytes.buffer, 0, safeLength / 2);
  const numChannels = 1;
  const sampleRate = 24000;
  const frameCount = dataInt16.length;
  
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  
  return buffer;
};

export const decodeSpeechAudio = async (base64Data: string, ctx: AudioContext): Promise<AudioBuffer> => {
  try {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // Attempt standard browser audio decoding (handles MP3/WAV/etc. returned by standard TTS model)
    return await ctx.decodeAudioData(bytes.buffer);
  } catch (error) {
    console.warn("Standard decodeAudioData failed, falling back to decodePCM16 parsing:", error);
    return decodePCM16(base64Data, ctx);
  }
};

export const sendChatMessage = async (
  history: {role: 'user'|'model', text: string}[], 
  newMessage: string | null,
  audioBase64: string | null,
  context: EducationalContent,
  prefs: UserPreferences
) => {
  try {
    const response = await fetch("/api/send-chat-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, newMessage, audioBase64, context, prefs }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Client side sendChatMessage failed:", error);
    throw error;
  }
};

export const getAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 24000, 
  });
};
