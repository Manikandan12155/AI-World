import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Bot, Sparkles, Radio, RotateCw } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

// ============================================================================
// FULL-BODY 3D CYBERNETIC ASTRONAUT MODEL (360° ROTATABLE THREE.JS R3F)
// ============================================================================
const TexturedAstronautMesh: React.FC<{ isSpeaking: boolean; speakingPulse: number }> = ({
  isSpeaking,
  speakingPulse
}) => {
  const suitGroupRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const chestLightRef = useRef<THREE.PointLight>(null);

  // Load Real Photorealistic Texture Maps
  const [earthTex, goldFoilTex, logoTex] = useTexture([
    getAssetUrl('/textures/Daytime.png'),
    getAssetUrl('/textures/satellite_gold_foil.jpg'),
    getAssetUrl('/logo/alien_logo.jpg')
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (visorRef.current && isSpeaking) {
      // Visor light pulse when speaking
      (visorRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(t * 14) * 0.6 * speakingPulse;
    }
    if (chestLightRef.current) {
      chestLightRef.current.intensity = isSpeaking ? 3.5 + speakingPulse * 4.0 : 1.5;
    }
  });

  return (
    <group ref={suitGroupRef} position={[0, -0.6, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* 1. HELMET HEAD ASSEMBLY */}
      <group position={[0, 1.8, 0]}>
        {/* Outer Helmet Shell */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.75, 48, 48]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.7} />
        </mesh>

        {/* Helmet Collar Ring */}
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.08, 16, 48]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Visor Shield (Glowing Curved Convex Glass with Earth Environment Reflection) */}
        <mesh ref={visorRef} position={[0, 0.05, 0.3]} rotation={[0.08, 0, 0]}>
          <sphereGeometry args={[0.66, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial
            map={earthTex}
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={isSpeaking ? 1.2 : 0.4}
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.92}
          />
        </mesh>

        {/* Left/Right Comm Pods */}
        <mesh position={[-0.78, 0.02, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 24]} />
          <meshStandardMaterial color="#38bdf8" emissive="#06b6d4" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.78, 0.02, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.2, 24]} />
          <meshStandardMaterial color="#38bdf8" emissive="#06b6d4" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 2. TORSO & CHEST CONTROL UNIT */}
      <group position={[0, 0.5, 0]}>
        {/* Upper Chest Suit Body */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.3, 1.1, 0.9]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Chest Telemetry Computer Box with NEXORIA Alien Emblem Texture */}
        <mesh position={[0, 0.35, 0.48]}>
          <boxGeometry args={[0.7, 0.65, 0.22]} />
          <meshStandardMaterial map={logoTex} color="#ffffff" roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Chest Status Light Indicators */}
        <mesh position={[-0.2, 0.45, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#4ade80" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, 0.45, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.2, 0.45, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          <meshStandardMaterial color="#f43f5e" emissive="#fb7185" emissiveIntensity={1.2} />
        </mesh>

        {/* Lower Waist Belt */}
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[1.25, 0.25, 0.85]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
        </mesh>
      </group>

      {/* 3. PLSS LIFE-SUPPORT BACKPACK */}
      <group position={[0, 0.7, -0.6]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.25, 1.45, 0.45]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Oxygen Tank Cylinders with Gold Foil Satellite Thermal Insulation Texture */}
        <mesh position={[-0.35, 0.1, -0.28]}>
          <cylinderGeometry args={[0.15, 0.15, 1.1, 24]} />
          <meshStandardMaterial map={goldFoilTex} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.35, 0.1, -0.28]}>
          <cylinderGeometry args={[0.15, 0.15, 1.1, 24]} />
          <meshStandardMaterial map={goldFoilTex} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 4. ARMS & SHOULDER PADS */}
      {/* Left Arm */}
      <group position={[-0.85, 0.7, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} />
        </mesh>
        <mesh position={[-0.15, -0.45, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.75, 24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
        {/* Glove */}
        <mesh position={[-0.22, -0.9, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.85, 0.7, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.8} />
        </mesh>
        <mesh position={[0.15, -0.45, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.75, 24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
        {/* Glove */}
        <mesh position={[0.22, -0.9, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      </group>

      {/* 5. LEGS & THRUSTER BOOTS */}
      {/* Left Leg */}
      <group position={[-0.35, -0.6, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.85, 24]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.95, 0.1]}>
          <boxGeometry args={[0.35, 0.3, 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.35, -0.6, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.85, 24]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.95, 0.1]}>
          <boxGeometry args={[0.35, 0.3, 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
        </mesh>
      </group>

      {/* Chest Ambient Light */}
      <pointLight ref={chestLightRef} position={[0, 0.8, 0.8]} color="#38bdf8" intensity={2.5} distance={5} />
    </group>
  );
};

const FullBodyAstronaut3D: React.FC<{ isSpeaking: boolean; speakingPulse: number }> = (props) => (
  <Suspense fallback={null}>
    <TexturedAstronautMesh {...props} />
  </Suspense>
);


// ============================================================================
// KNOWLEDGE RESPONSES FOR ASTRA AI
// ============================================================================
const ASTRA_KNOWLEDGE: Record<string, string> = {
  gaganyaan: "Gaganyaan is ISRO's human spaceflight mission designed to send a 3-member crew into a 400 km orbit for 3 days and safely return them to Earth.",
  orbit: "Planetary orbits follow Kepler's laws of motion. In NEXORIA, Earth orbits the Sun at 29.78 km/s while satellites circle Earth in Low Earth Orbit.",
  ai: "NEXORIA AI Synapse tracks state-of-the-art LLMs, multi-modal neural architectures, GPU cluster momentum, and autonomous agent frameworks.",
  mars: "Mars is the fourth planet from the Sun, featuring Olympus Mons—the largest volcano in the Solar System—and two moons, Phobos and Deimos.",
  sun: "The Sun is a G-type main-sequence star containing 99.86% of the Solar System's total mass, generating energy via nuclear fusion of hydrogen into helium.",
  blackhole: "A black hole is a region of spacetime where gravity is so strong that nothing—not even light—can escape its event horizon.",
  default: "I am ASTRA, your 3D Cybernetic Astronaut Assistant. I process real-time telemetry, orbital trajectory math, and emerging AI intelligence."
};

interface AIAstronautAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAstronautAssistant: React.FC<AIAstronautAssistantProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'astra'; text: string }>>([
    { sender: 'astra', text: "Greetings! I am ASTRA, your 3D Cybernetic Astronaut Co-Pilot. Ask me anything about space missions, planetary orbits, or AI intelligence." }
  ]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [captionText, setCaptionText] = useState("ASTRA: Ready for telemetry queries...");
  const [speakingPulse, setSpeakingPulse] = useState(0);
  const [viewMode, setViewMode] = useState<'portrait' | '3d'>('portrait');
  const [voiceEngine, setVoiceEngine] = useState<'openai' | 'system'>('openai');
  const [voicePersona, setVoicePersona] = useState<'alloy' | 'shimmer' | 'nova' | 'echo' | 'onyx'>('alloy');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typewriter caption utility
  const startTypewriterCaption = (text: string) => {
    let currentIdx = 0;
    const captionInterval = setInterval(() => {
      if (currentIdx <= text.length) {
        setCaptionText(`ASTRA: ${text.slice(0, currentIdx)}`);
        currentIdx += 3;
      } else {
        clearInterval(captionInterval);
      }
    }, 35);
  };

  // Clean text by stripping emojis for smooth speech synthesis
  const cleanSpeechText = (inputStr: string) => {
    return inputStr
      .replace(/\p{Extended_Pictographic}/gu, '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Fallback Web Speech Synthesis with best Natural/Neural voice filter
  const fallbackWebSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const spokenText = cleanSpeechText(text);
    if (!spokenText) return;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural/online human voices over robotic ones
    const humanVoice = voices.find(
      (v) =>
        v.lang.includes('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Online') ||
          v.name.includes('Neural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Alex'))
    ) || voices.find((v) => v.lang.includes('en'));

    if (humanVoice) utterance.voice = humanVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingPulse(1);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingPulse(0);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingPulse(0);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    startTypewriterCaption(text);
  };

  // Handle Speech Synthesis (OpenAI Real Human Voice HD vs System Neural Voice)
  const speakText = async (text: string) => {
    if (isMuted) {
      setCaptionText(`ASTRA: ${text}`);
      return;
    }

    // Stop previous audio/speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const spokenText = cleanSpeechText(text);
    if (!spokenText) return;

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

    // Primary: OpenAI High-Definition Real Human Voice API (tts-1-hd)
    if (voiceEngine === 'openai' && apiKey && apiKey.startsWith('sk-')) {
      try {
        setIsSpeaking(true);
        setSpeakingPulse(1);
        setCaptionText("ASTRA: Synthesizing Gemini HD Human Voice...");

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'tts-1-hd',
            input: spokenText,
            voice: voicePersona,
            speed: 1.0
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          audio.onplay = () => {
            setIsSpeaking(true);
            setSpeakingPulse(1);
            startTypewriterCaption(text);
          };

          audio.onended = () => {
            setIsSpeaking(false);
            setSpeakingPulse(0);
          };

          audio.onerror = () => {
            setIsSpeaking(false);
            setSpeakingPulse(0);
            fallbackWebSpeech(text);
          };

          await audio.play();
          return;
        } else {
          console.warn('OpenAI TTS API error, falling back to Web Speech');
        }
      } catch (err) {
        console.warn('OpenAI TTS connection error, falling back to Web Speech:', err);
      }
    }

    // Fallback: System Natural Voice
    fallbackWebSpeech(text);
  };

  // Process User Query (Powered by Python FastAPI AI Backend)
  const handleSend = async (customText?: string) => {
    const query = (customText || input).trim();
    if (!query) return;

    const newMessages = [...messages, { sender: 'user' as const, text: query }];
    setMessages(newMessages);
    if (!customText) setInput('');
    setCaptionText("ASTRA: Querying Python AI Backend...");

    let responseText = '';

    // Primary: Vercel Serverless / Python Backend (/api/astra-chat)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api/astra-chat';
      let res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, voice_persona: voicePersona })
      });
      if (!res.ok && !import.meta.env.VITE_BACKEND_URL) {
        res = await fetch('http://127.0.0.1:8001/api/astra-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, voice_persona: voicePersona })
        });
      }
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          responseText = data.reply;
        }
      }
    } catch (err) {
      console.warn('Backend fetch error:', err);
    }

    // Secondary: Gemini Direct API if Python backend offline
    if (!responseText) {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      if (geminiKey && geminiKey.startsWith('AIzaSy')) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `You are ASTRA, a 3D Cybernetic Astronaut Co-Pilot on NEXORIA space station. Answer concisely in 2 clear scifi sentences: ${query}`
                      }
                    ]
                  }
                ]
              })
            }
          );
          if (res.ok) {
            const data = await res.json();
            responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          }
        } catch (err) {
          console.warn('Gemini API call error:', err);
        }
      }
    }

    // Fallback Knowledge Base if all API calls fail
    if (!responseText) {
      const qLower = query.toLowerCase();
      if (qLower.includes('gaganyaan') || qLower.includes('isro') || qLower.includes('india')) {
        responseText = ASTRA_KNOWLEDGE.gaganyaan;
      } else if (qLower.includes('orbit') || qLower.includes('earth') || qLower.includes('satellite')) {
        responseText = ASTRA_KNOWLEDGE.orbit;
      } else if (qLower.includes('ai') || qLower.includes('model') || qLower.includes('llm')) {
        responseText = ASTRA_KNOWLEDGE.ai;
      } else if (qLower.includes('mars')) {
        responseText = ASTRA_KNOWLEDGE.mars;
      } else if (qLower.includes('sun')) {
        responseText = ASTRA_KNOWLEDGE.sun;
      } else if (qLower.includes('black hole') || qLower.includes('hole')) {
        responseText = ASTRA_KNOWLEDGE.blackhole;
      } else {
        responseText = `ASTRA telemetry link active for '${query}': NEXORIA orbital sensors are online and monitoring all vector parameters.`;
      }
    }

    setMessages((prev) => [...prev, { sender: 'astra', text: responseText }]);
    speakText(responseText);
  };

  // Toggle Microphone Input (Speech-to-Text)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please use Chrome or Edge.');
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
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setCaptionText("ASTRA: Listening to your voice command...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Outer Holographic Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#09152a] via-[#050e1d] to-[#020710] border-2 border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden text-slate-100 font-sans">
        
        {/* Top Glowing Cyan Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 shadow-[0_0_12px_#22d3ee]" />

        {/* 1. HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-wider text-white font-['Space_Grotesk']">
                  NEXORIA ASTRA // 3D ASTRONAUT CO-PILOT
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  VOICE AI V9.4
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
                <span>STATUS: {isSpeaking ? 'TRANSMITTING VOICE' : 'STANDBY // READY'}</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-300">AUDIO-REACTIVE SYNAPSE</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Engine & Persona Selector */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono">
              <span className="text-slate-400 font-bold mr-1">HUMAN VOICE:</span>
              <button
                onClick={() => { setVoiceEngine('openai'); setVoicePersona('alloy'); }}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  voiceEngine === 'openai' && voicePersona === 'alloy'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Alloy: Gemini Natural Conversational Voice"
              >
                ALLOY (GEMINI)
              </button>
              <button
                onClick={() => { setVoiceEngine('openai'); setVoicePersona('shimmer'); }}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  voiceEngine === 'openai' && voicePersona === 'shimmer'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Shimmer: Expressive Female Conversational Voice"
              >
                SHIMMER (FEMALE)
              </button>
              <button
                onClick={() => { setVoiceEngine('openai'); setVoicePersona('nova'); }}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  voiceEngine === 'openai' && voicePersona === 'nova'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Nova: Friendly Female Voice"
              >
                NOVA
              </button>
              <button
                onClick={() => { setVoiceEngine('openai'); setVoicePersona('echo'); }}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  voiceEngine === 'openai' && voicePersona === 'echo'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Echo: Warm Male Voice"
              >
                ECHO
              </button>
              <button
                onClick={() => { setVoiceEngine('openai'); setVoicePersona('onyx'); }}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  voiceEngine === 'openai' && voicePersona === 'onyx'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Onyx: Deep Male Voice"
              >
                ONYX
              </button>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900 border-slate-700 text-cyan-300 hover:border-cyan-400'
              }`}
              title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Close Assistant (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. BODY GRID (LEFT: 3D ASTRONAUT CANVAS, RIGHT: CHAT LOG) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 overflow-y-auto max-h-[calc(92vh-140px)] custom-scrollbar bg-[#030812]">
          
          {/* LEFT COLUMN: 3D ASTRONAUT CANVAS DISPLAY */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-gradient-to-b from-[#08172e] via-[#040d1a] to-[#020610] border border-cyan-500/40 p-4 relative overflow-hidden shadow-inner space-y-4">
            
            {/* 3D / Holographic Astronaut Box */}
            <div className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-950/90 flex items-center justify-center group">
              
              {/* Sci-Fi Grid & Radial Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.25)_0%,transparent_75%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {/* View Mode Content */}
              {viewMode === 'portrait' ? (
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  {/* Floating Hologram Glow Behind Suit */}
                  <div
                    className={`absolute w-48 h-64 rounded-full blur-2xl transition-all duration-300 ${
                      isSpeaking ? 'bg-cyan-400/40 scale-110' : 'bg-sky-500/20'
                    }`}
                  />
                  
                  {/* Full Suit Astronaut Avatar Image */}
                  <img
                    src={getAssetUrl('/Voiceassistent/ChatGPT Image Sep 22, 2026, 02_26_01 PM.png')}
                    alt="NEXORIA AI World Astronaut Suit"
                    className={`h-full max-h-[340px] object-contain relative z-10 transition-transform duration-700 hover:scale-105 ${
                      isSpeaking ? 'drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] animate-pulse' : 'drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    }`}
                  />

                  {/* Vertical HUD Scanning Laser Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-cyan-400/80 shadow-[0_0_12px_#22d3ee] animate-[bounce_4s_infinite] pointer-events-none z-20" />
                </div>
              ) : (
                <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 5, 5]} intensity={1.8} color="#38bdf8" />
                  <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#06b6d4" />
                  <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={2.0} enablePan={false} />
                  <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.3}>
                    <FullBodyAstronaut3D isSpeaking={isSpeaking} speakingPulse={speakingPulse} />
                  </Float>
                </Canvas>
              )}

              {/* Holographic HUD Header Badge & Mode Switcher */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto z-30">
                <div className="px-2.5 py-1 rounded text-[9px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>{viewMode === 'portrait' ? 'NEXORIA SUIT // AVATAR' : '3D 360° INTERACTIVE ASTRONAUT'}</span>
                </div>

                <button
                  onClick={() => setViewMode(v => v === 'portrait' ? '3d' : 'portrait')}
                  className="px-2.5 py-1 rounded text-[9px] font-mono font-bold bg-slate-900/90 hover:bg-cyan-950 text-cyan-300 hover:text-white border border-cyan-500/40 transition-all shadow-md cursor-pointer flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span>{viewMode === 'portrait' ? '3D 360° MODEL' : 'SUIT AVATAR'}</span>
                </button>
              </div>

              {/* Speaking Audio Wave Visualizer Bars Overlay */}
              {isSpeaking && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1 pointer-events-none z-30 bg-slate-950/70 py-1.5 rounded-lg border border-cyan-500/30">
                  <span className="text-[9px] font-mono text-cyan-300 mr-2">VOICE FREQUENCY:</span>
                  {[40, 70, 100, 60, 90, 50, 80, 30, 90, 60].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full animate-pulse"
                      style={{ height: `${h * 0.22}px`, animationDelay: `${i * 0.07}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Sci-Fi Prompts */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                // QUICK TELEMETRY PROMPTS
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => handleSend('Explain Gaganyaan Mission')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-all text-left truncate cursor-pointer"
                >
                  🚀 Gaganyaan Mission
                </button>

                <button
                  onClick={() => handleSend('Show Solar System Orbits')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-all text-left truncate cursor-pointer"
                >
                  🪐 Solar System Orbits
                </button>

                <button
                  onClick={() => handleSend('Latest AI Model Momentum')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-all text-left truncate cursor-pointer"
                >
                  🤖 Latest AI Models
                </button>

                <button
                  onClick={() => handleSend('What is a Black Hole?')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-all text-left truncate cursor-pointer"
                >
                  🌌 What is Black Hole?
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CHAT MESSAGES LOG */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-slate-950/60 border border-slate-800/90 p-4 space-y-4">
            
            {/* Chat History */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-72 p-2 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-mono'
                    }`}
                  >
                    {msg.sender === 'astra' && (
                      <div className="text-[10px] font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>NEXORIA ASTRA</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse border-rose-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-cyan-300 hover:border-cyan-500/60'
                }`}
                title={isListening ? 'Listening... Click to stop' : 'Click to speak via Microphone'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                placeholder="Ask ASTRA about space missions, orbits, AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* 3. BOTTOM LIVE CAPTIONS & SUBTITLES BAR */}
        <div className="px-6 py-2.5 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
            <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
            <span className="text-[11px] truncate text-slate-200 font-semibold">{captionText}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
            <span>PRESS [ESC] TO CLOSE</span>
          </div>
        </div>

      </div>
    </div>
  );
};
