import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  Send,
  Globe,
  CornerDownRight,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { LanguageCode } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onApplyVoiceLotCreation?: (crop: string, qty: number) => void;
}

const VOICE_PROMPT_PRESETS: { [key in LanguageCode]: { query: string; label: string; desc: string }[] } = {
  Kannada: [
    {
      query: 'ನನ್ನ 1,000 ಕೆಜಿ ಟೊಮ್ಯಾಟೊ ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿದರೆ ಹೆಚ್ಚು ಲಾಭ ಸಿಗುತ್ತದೆ?',
      label: 'Where should I sell my tomatoes?',
      desc: 'Nanna tomato yelli sell madidre better?',
    },
    {
      query: 'ನನ್ನ ಹತ್ತಿರ 500 ಕಿಲೋ ಗ್ರೇಡ್-A ಆಲೂಗಡ್ಡೆ ಇದೆ, ನಾಳೆ ಹಾರ್ವೆಸ್ಟ್.',
      label: 'Create listing by voice (500kg Potato)',
      desc: 'Nanna 500 kilo potato ide, harvest tomorrow',
    },
    {
      query: 'ಕೋಲಾರ ಎಪಿಎಂಸಿ ಮಂಡಿ ದರಕ್ಕೂ ನೇರ ಖರೀದಿದಾರರಿಗೂ ಎಷ್ಟು ವ್ಯತ್ಯಾಸವಿದೆ?',
      label: 'Mandi vs Direct Buyer comparison',
      desc: 'Kolar Mandi vs Direct buyers rate',
    },
  ],
  Telugu: [
    {
      query: 'కోలార్ నుండి నా 1,000 కిలోల టమాటాలకు ఎక్కడ మంచి ధర వస్తుంది?',
      label: 'Where will I get best price?',
      desc: 'Naa tomato ki ekkada manchi price vastundi?',
    },
    {
      query: 'నా దగ్గర 800 కిలోల టమాటా ఉంది, రేపు హార్వెస్ట్.',
      label: 'Voice lot creation (800kg Tomato)',
      desc: 'Voice listing creation for tomatoes',
    },
  ],
  Hindi: [
    {
      query: 'कोलार मंडी के मुकाबले ABC Foods को बेचने पर कितना अधिक मुनाफा होगा?',
      label: 'Mandi vs ABC Foods net profit',
      desc: 'Local mandi vs buyer net realization',
    },
    {
      query: 'मेरे पास 1,000 किलो टमाटर है, क्या मुझे आज बेचना चाहिए या रुकना चाहिए?',
      label: 'Sell now vs wait recommendation',
      desc: 'Should I sell today or hold?',
    },
  ],
  English: [
    {
      query: 'Where should I sell my 1,000 kg tomatoes from Kolar for maximum net realization?',
      label: 'Net Realization recommendation',
      desc: 'Compare Mandi vs Buyer A vs Buyer B',
    },
    {
      query: 'Should I sell my tomato lot today or wait 2 days?',
      label: 'Sell Now vs Wait signal',
      desc: 'Market decision engine advice',
    },
  ],
};

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  onApplyVoiceLotCreation,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assistantResponse, setAssistantResponse] = useState<{
    responseText: string;
    englishTranslation: string;
    suggestedAction: string;
    keyHighlight: string;
    extractedEntities?: { crop?: string; quantity?: number };
  } | null>(null);

  // Initialize with sample query
  useEffect(() => {
    if (isOpen && !query) {
      const defaultPreset = VOICE_PROMPT_PRESETS[currentLanguage]?.[0]?.query;
      if (defaultPreset) {
        setQuery(defaultPreset);
      }
    }
  }, [isOpen, currentLanguage]);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setQuery(queryText);

    try {
      const res = await fetch('/api/gemini/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          language: currentLanguage,
          farmerLocation: 'Kolar, Karnataka',
          activeCrop: 'Tomato',
        }),
      });
      const json = await res.json();
      if (json?.data) {
        setAssistantResponse(json.data);
        speakText(json.data.responseText);
      }
    } catch {
      // Fallback
      setAssistantResponse({
        responseText:
          'ಕೋಲಾರ ಮಂಡಿಗಿಂತ (₹25/kg) ಎಬಿಸಿ ಫುಡ್ಸ್ (ABC Foods) ಗೆ ಕೆಜಿಗೆ ₹27 ದರದಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿದರೆ ₹1 ಸಾರಿಗೆ ವೆಚ್ಚ ಕಳೆದ ನಂತರವೂ ನಿಮಗೆ ₹1,000 ಹೆಚ್ಚಿನ ಲಾಭ ಸಿಗುತ್ತದೆ. ಈಗಲೇ ಮಾರಾಟ ಮಾಡಿ.',
        englishTranslation:
          'Selling to ABC Foods at ₹27/kg yields ₹1,000 more net profit than Kolar mandi after ₹1/kg transport. Recommended to SELL NOW.',
        suggestedAction: 'VIEW_BUYER_OFFERS',
        keyHighlight: 'Buyer A yields +₹1,000 net profit over APMC Mandi',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [micNotice, setMicNotice] = useState<string | null>(null);

  const toggleMicListening = () => {
    setMicNotice(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicNotice('Microphone speech recognition is not supported or restricted in this browser frame. Click any sample prompt below to simulate spoken query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        currentLanguage === 'Kannada'
          ? 'kn-IN'
          : currentLanguage === 'Telugu'
          ? 'te-IN'
          : currentLanguage === 'Hindi'
          ? 'hi-IN'
          : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        setMicNotice('Microphone access paused. You can use the one-click sample voice queries below.');
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSendQuery(transcript);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setMicNotice('Speech recognition restricted in preview frame. Please click a sample query below.');
    }
  };

  const speakText = (text: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Audio speech ignored gracefully if restricted
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 shadow-2xl space-y-5 bg-white/95 border border-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                FarmLink AI Voice Assistant
              </h3>
              <p className="text-xs text-slate-500">
                Talk naturally in your local language (Kannada, Telugu, Hindi, English)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-semibold">
          {(['Kannada', 'Telugu', 'Hindi', 'English'] as LanguageCode[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`flex-1 py-1.5 px-2 rounded-lg transition text-center ${
                currentLanguage === lang
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Input Bar & Mic Button */}
        <div className="space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Speak or type your question..."
              className="w-full pl-4 pr-24 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-slate-50/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(query)}
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button
                onClick={toggleMicListening}
                className={`p-2 rounded-xl transition ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                title="Microphone input"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={() => handleSendQuery(query)}
                disabled={isLoading}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {micNotice && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-snug">
              {micNotice}
            </div>
          )}

          {/* Quick Vernacular Presets */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quick One-Click Farmer Voice Prompts ({currentLanguage}):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VOICE_PROMPT_PRESETS[currentLanguage]?.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(preset.query)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/50 text-left transition group"
                >
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    {preset.query}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assistant Response Box */}
        {assistantResponse && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-3 animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold uppercase text-emerald-950 tracking-wider">
                  FarmLink Advisor Answer ({currentLanguage})
                </span>
              </div>
              <button
                onClick={() => speakText(assistantResponse.responseText)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-white/80 px-2 py-0.5 rounded-lg border border-emerald-200"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Listen Audio</span>
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {assistantResponse.responseText}
            </p>

            <div className="pt-2 border-t border-emerald-200/60 text-xs text-slate-600">
              <span className="font-bold text-slate-700">English Translation: </span>
              <span>{assistantResponse.englishTranslation}</span>
            </div>

            {assistantResponse.keyHighlight && (
              <div className="p-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs flex items-center gap-2 border border-emerald-200">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{assistantResponse.keyHighlight}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
