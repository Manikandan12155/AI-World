import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export const Globe: React.FC = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const cityDotsRef = useRef<THREE.Points>(null);

  // Procedural Earth surface canvas texture
  const { earthTexture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Deep cosmic ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#061325');
    oceanGrad.addColorStop(0.3, '#0b1d3a');
    oceanGrad.addColorStop(0.5, '#0d254c');
    oceanGrad.addColorStop(0.7, '#081730');
    oceanGrad.addColorStop(1, '#040b17');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Procedural continents & landmasses
    ctx.fillStyle = '#1e3a5f';
    for (let i = 0; i < 90; i++) {
      const cx = (i * 97 + (i % 7) * 40) % 1024;
      const cy = 60 + ((i * 47) % 380);
      const rad = 25 + ((i * 13) % 65);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rad * 1.5, rad * 0.9, (i % 6) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing city light clusters (night lights)
    ctx.fillStyle = 'rgba(255, 215, 130, 0.9)';
    for (let c = 0; c < 350; c++) {
      const px = (c * 73) % 1024;
      const py = 70 + ((c * 31) % 360);
      const size = Math.random() < 0.2 ? 2.5 : 1.2;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cyber-grid luminous latitude & longitude lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let y = 64; y < 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    for (let x = 64; x < 1024; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    const earthTex = new THREE.CanvasTexture(canvas);
    earthTex.wrapS = THREE.RepeatWrapping;
    earthTex.wrapT = THREE.ClampToEdgeWrapping;

    return { earthTexture: earthTex };
  }, []);

  const cityPositions = useMemo(() => {
    const coords: number[] = [];
    const count = 400;
    const radius = 2.01;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      coords.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    return new Float32Array(coords);
  }, []);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.04;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.055;
    }
    if (cityDotsRef.current) {
      cityDotsRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group position={[0.2, -0.1, 0]}>
      {/* Main Dark Blue Earth */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.5}
          metalness={0.2}
          emissive={new THREE.Color('#0a192f')}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Cloud & Atmosphere Shroud */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.02, 48, 48]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          wireframe={false}
        />
      </mesh>

      {/* Glowing City Night Lights on Sphere */}
      <points ref={cityDotsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cityPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#fdba74"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Outer Atmosphere Glow Halo */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.22, 48, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Secondary Cosmic Glow */}
      <mesh>
        <sphereGeometry args={[2.45, 32, 32]} />
        <meshBasicMaterial
          color="#1e3a8a"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* "Mani Tech UNIVERSE" Slogan Centered in Front of Globe */}
      <Html
        position={[0, 0.45, 2.22]}
        center
        distanceFactor={6}
        className="pointer-events-none select-none z-10"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] tracking-[0.45em] text-cyan-200/90 font-medium uppercase drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]">
            Mani Tech
          </span>
          <span className="text-sm md:text-base tracking-[0.55em] text-white font-bold uppercase drop-shadow-[0_0_16px_rgba(56,189,248,0.9)] mt-0.5 whitespace-nowrap pl-1">
            Uviverse
          </span>
        </div>
      </Html>
    </group>
  );
};
