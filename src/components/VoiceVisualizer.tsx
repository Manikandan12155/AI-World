import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { X, Square } from 'lucide-react';

interface VoiceSphereThreeProps {
  state: "listening" | "processing" | "speaking" | "interrupted" | "idle";
  speechRate?: number;
  isVoiceActive?: boolean;
}

const VoiceSphereThree: React.FC<VoiceSphereThreeProps> = ({ state, speechRate = 1, isVoiceActive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep references to state and speechRate to avoid destroying/rebuilding scene on changes
  const stateRef = useRef(state);
  const speechRateRef = useRef(speechRate);
  const isVoiceActiveRef = useRef(isVoiceActive);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  useEffect(() => {
    isVoiceActiveRef.current = isVoiceActive;
  }, [isVoiceActive]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const w = 200;
    const h = 200;

    const noiseShaderSource = `
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
    `;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 2.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    const radius = 1.25;
    const detail = 35;
    const geometry = new THREE.IcosahedronGeometry(1, detail);

    const canvasSize = 32;
    const canvasH = canvasSize * 0.5;
    const drawCanvas = document.createElement("canvas");
    drawCanvas.width = drawCanvas.height = canvasSize;
    const ctx = drawCanvas.getContext("2d")!;
    const circle = new Path2D();
    circle.arc(canvasH, canvasH, canvasH - 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill(circle);
    const texture = new THREE.CanvasTexture(drawCanvas);

    // Initial color
    let dotColor = 0x009dff;
    if (stateRef.current === "processing") dotColor = 0xec4899;
    else if (stateRef.current === "interrupted") dotColor = 0xef4444;
    else if (stateRef.current === "speaking") dotColor = 0x10b981;

    const material = new THREE.PointsMaterial({
      map: texture,
      blending: THREE.NormalBlending,
      color: dotColor,
      depthTest: false,
      transparent: true,
    });

    let sizeMin = 0.015;
    let sizeMax = 0.08;

    if (stateRef.current === "speaking") {
      sizeMin = 0.03;
      sizeMax = 0.14;
    } else if (stateRef.current === "processing") {
      sizeMin = 0.01;
      sizeMax = 0.05;
    }

    material.onBeforeCompile = (shader: any) => {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.radius = { value: radius };
      shader.uniforms.particleSizeMin = { value: sizeMin };
      shader.uniforms.particleSizeMax = { value: sizeMax };
      shader.uniforms.noiseStrength = { value: 0.45 };

      shader.vertexShader = `
        uniform float particleSizeMax;
        uniform float particleSizeMin;
        uniform float radius;
        uniform float time;
        uniform float noiseStrength;
        ${noiseShaderSource}
        ${shader.vertexShader}
      `;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
          vec3 p = position;
          float n = snoise( vec3( p.x * 0.8 + time * 0.4, p.y * 0.6 + time * 0.5, p.z * 0.4 + time * 0.3) );
          p += n * noiseStrength;
          float l = radius / length(p);
          p *= l;
          float s = mix(particleSizeMin, particleSizeMax, n);
          vec3 transformed = vec3( p.x, p.y, p.z );
        `,
      );

      shader.vertexShader = shader.vertexShader.replace(
        "gl_PointSize = size;",
        "gl_PointSize = s;",
      );

      material.userData.shader = shader;
    };

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      const currentState = stateRef.current;
      const currentSpeechRate = speechRateRef.current;
      const voiceActive = isVoiceActiveRef.current;

      // Update color based on current state
      let targetColor = 0x009dff;
      if (currentState === "processing") targetColor = 0xec4899;
      else if (currentState === "interrupted") targetColor = 0xef4444;
      else if (currentState === "speaking") targetColor = 0x10b981;
      material.color.setHex(targetColor);

      // Update size uniforms based on current state
      let currentSizeMin = 0.015;
      let currentSizeMax = 0.08;
      if (currentState === "speaking") {
        currentSizeMin = 0.03;
        currentSizeMax = 0.14;
      } else if (currentState === "processing") {
        currentSizeMin = 0.01;
        currentSizeMax = 0.05;
      } else if (currentState === "listening" && voiceActive) {
        currentSizeMin = 0.035;
        currentSizeMax = 0.15;
      }

      let currentNoiseStrength = 0.45;
      if (currentState === "listening" && voiceActive) {
        currentNoiseStrength = 0.95; // organic wobble/deformation
      } else if (currentState === "processing") {
        currentNoiseStrength = 0.2;
      }

      if (material.userData.shader) {
        material.userData.shader.uniforms.particleSizeMin.value = currentSizeMin;
        material.userData.shader.uniforms.particleSizeMax.value = currentSizeMax;
        material.userData.shader.uniforms.noiseStrength.value = currentNoiseStrength;
      }

      let rotationSpeed = 0.15;
      if (currentState === "processing") rotationSpeed = 0.5;
      else if (currentState === "speaking") rotationSpeed = 0.25 * currentSpeechRate;
      else if (currentState === "listening" && voiceActive) rotationSpeed = 0.65;

      mesh.rotation.y = time * rotationSpeed;
      mesh.rotation.x = time * (rotationSpeed * 0.5);

      if (material.userData.shader) {
        let timeScale = 1;
        if (currentState === "speaking") timeScale = 2.2 * currentSpeechRate;
        else if (currentState === "processing") timeScale = 1.8;
        else if (currentState === "listening" && voiceActive) timeScale = 4.2;
        material.userData.shader.uniforms.time.value = time * timeScale;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        renderer.domElement.remove();
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: 200,
        height: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 2,
      }}
    />
  );
};

const TypewriterText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 25); // 25ms per character typing speed
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse text-cyan-400">|</span>
    </span>
  );
};

interface VoiceVisualizerProps {
  isListening: boolean;
  onStopListening: () => void;
  onInterrupt?: () => void;
  audioPulse: number; 
  statusText: string;
  captionText?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ 
  isListening, 
  onStopListening,
  onInterrupt,
  audioPulse,
  statusText,
  captionText
}) => {
  // Determine state mapping for VoiceSphereThree
  const getSphereState = () => {
    if (statusText === "Speaking...") return "speaking";
    if (isListening && audioPulse > 0) return "listening";
    if (isListening) return "idle";
    return "idle";
  };

  const isSpeaking = statusText === "Speaking...";

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm overflow-hidden rounded-xl">
      
      {/* Close Button to return to Chat Mode */}
      <button 
        onClick={onStopListening}
        className="absolute top-3 right-3 p-2 rounded-full bg-slate-800/60 hover:bg-rose-500/80 text-slate-400 hover:text-white border border-slate-700 hover:border-rose-400 transition-all cursor-pointer z-[60]"
        title="Close Voice Mode"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Subtle glowing orb behind the sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-56 h-56 bg-cyan-500/10 rounded-full blur-[50px] pointer-events-none" />

      {/* 3D Sphere Container & Status Text */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full -mt-6">
        <VoiceSphereThree 
          state={getSphereState()} 
          isVoiceActive={audioPulse > 0} 
        />
        <h2 className="text-cyan-400 text-sm font-bold tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] mt-3">
          {statusText || (isListening ? "Listening..." : "Standby...")}
        </h2>

        {/* Tap to Interrupt Button when AI is speaking */}
        {isSpeaking && onInterrupt && (
          <button
            onClick={onInterrupt}
            className="mt-4 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs tracking-wider flex items-center gap-2 border border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.8)] animate-pulse cursor-pointer transition-all hover:scale-105"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>TAP TO INTERRUPT AI</span>
          </button>
        )}
      </div>

      {/* Caption overlay at the absolute bottom */}
      {captionText && (
        <div className="absolute bottom-0 left-0 w-full p-2 pointer-events-none z-20">
          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 shadow-lg backdrop-blur-md">
            <p className="text-slate-300 text-[11px] font-mono leading-relaxed line-clamp-3">
              <TypewriterText text={captionText} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
