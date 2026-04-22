import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgriVaaniProps {
  language: 'en' | 'hi' | 'mr';
}

const AgriVaani: React.FC<AgriVaaniProps> = ({ language }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState('');
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'mr' ? 'mr-IN' : (language === 'hi' ? 'hi-IN' : 'en-US');

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processWithGemini(text);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      stopSpeaking();
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      stopSpeaking();
      setTranscript('');
      setResponse('');
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const stopSpeaking = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    setIsSpeaking(false);
  };

  const processWithGemini = async (userText: string) => {
    setIsProcessing(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');

      const ai = new GoogleGenAI({ apiKey });
      
      // Step 1: Get Text Response
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `You are Agri-Vaani, a friendly voice assistant for rural farmers in India. 
          Respond in ${language === 'mr' ? 'Marathi' : (language === 'hi' ? 'Hindi' : 'English')}. 
          Keep your answer very short (max 2 sentences) because it will be spoken out loud. 
          Use simple words. Do not use markdown.`,
        }
      });

      const textOutput = textResponse.text || '';
      setResponse(textOutput);

      // Step 2: Convert to Speech
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: textOutput }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: language === 'en' ? 'Puck' : 'Kore' },
            },
          },
        },
      });

      const base64Audio = (ttsResponse as any).candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        playAudio(base64Audio);
      }
    } catch (error) {
      console.error('AgriVaani Error:', error);
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = async (base64Data: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Gemini TTS returns raw PCM 16-bit at 24kHz
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert Uint8Array (PCM 16-bit) to Float32Array for AudioBuffer
      const int16Data = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16Data.length);
      
      for (let i = 0; i < int16Data.length; i++) {
        // Normalize Int16 [-32768, 32767] to Float32 [-1.0, 1.0]
        float32Data[i] = int16Data[i] / 32768.0;
      }

      const audioBuffer = audioContextRef.current.createBuffer(
        1, // Mono
        float32Data.length,
        24000 // Sample rate for Gemini TTS
      );
      audioBuffer.getChannelData(0).set(float32Data);

      stopSpeaking();
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      
      sourceRef.current = source;
      setIsSpeaking(true);
      source.start(0);
    } catch (error) {
      console.error('Audio Playback Error:', error);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex flex-col items-start gap-4">
        <AnimatePresence>
          {(transcript || response || isProcessing) && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-emerald-100 max-w-xs md:max-w-md"
            >
              {transcript && (
                <div className="mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">You said</span>
                  <p className="text-slate-600 text-sm italic">"{transcript}"</p>
                </div>
              )}
              {isProcessing ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-medium">Thinking...</span>
                </div>
              ) : response && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">Agri-Vaani</span>
                  <p className="text-slate-800 text-sm font-medium leading-relaxed">{response}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </motion.button>

          {isSpeaking && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={stopSpeaking}
              className="w-10 h-10 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-md"
            >
              <VolumeX size={18} />
            </motion.button>
          )}

          <div className="bg-emerald-900/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-white text-xs font-medium border border-white/10 shadow-lg">
            <Sparkles size={14} className="text-emerald-300" />
            <span>Agri-Vaani Voice Assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriVaani;
