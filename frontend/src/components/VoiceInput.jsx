import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

const VoiceInput = ({ onTranscript, language = 'en' }) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Map i18n language codes to BCP-47 speech recognition codes
  const getLangTag = useCallback((lang) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'kn': return 'kn-IN';
      case 'en':
      default: return 'en-US';
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = getLangTag(language);

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.results[0].isFinal) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
      }
    };
  }, [language, getLangTag, onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = getLangTag(language);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
        <AlertCircle className="w-4 h-4" />
        <span>Voice input not supported in this browser. Please use Chrome or Edge.</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      aria-label={isListening ? t('intake.stopListening') : t('intake.startListening')}
    >
      {isListening ? (
        <>
          <MicOff className="w-5 h-5" />
          <span className="text-sm">{t('intake.stopListening')}</span>
        </>
      ) : (
        <>
          <Mic className="w-5 h-5" />
          <span className="text-sm">{t('intake.startListening')}</span>
        </>
      )}
    </button>
  );
};

export default VoiceInput;
