import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { TechNodeOverlay } from '../data/overlayData';

interface HighQuality3DIslandProps {
  node: TechNodeOverlay;
  worldPos: [number, number, number];
  isSelected: boolean;
  onSelect: (node: TechNodeOverlay) => void;
}

export const HighQuality3DIsland: React.FC<HighQuality3DIslandProps> = ({
  node,
  worldPos,
  isSelected,
  onSelect
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotatingModelRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      const offset = (worldPos[0] * 3 + worldPos[1]) % 6;
      groupRef.current.position.y = worldPos[1] + Math.sin(t * 1.6 + offset) * 0.12;
      const targetScale = hovered || isSelected ? 1.25 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (rotatingModelRef.current) {
      rotatingModelRef.current.rotation.y += 0.012;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
    }
  });

  // True 3D Procedural Volumetric Modeling for each Category
  const renderTrue3DModel = () => {
    switch (node.id) {
      case 'ai-genai':
        // Purple Illuminated Cyber Metropolis
        return (
          <group ref={rotatingModelRef} position={[0, 0.4, 0]}>
            {/* Center Skyscraper */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.3, 1.0, 0.3]} />
              <meshStandardMaterial
                color="#7e22ce"
                emissive="#c084fc"
                emissiveIntensity={2.8}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            {/* Glowing AI Beacon Diamond */}
            <mesh position={[0, 1.15, 0]}>
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#e879f9"
                emissiveIntensity={3.5}
              />
            </mesh>
            {/* Flanking Towers */}
            {[-0.24, 0.24].map((x, i) => (
              <mesh key={i} position={[x, 0.35, (i - 0.5) * 0.2]}>
                <boxGeometry args={[0.2, 0.7 + i * 0.15, 0.2]} />
                <meshStandardMaterial
                  color="#2563eb"
                  emissive="#60a5fa"
                  emissiveIntensity={1.8}
                />
              </mesh>
            ))}
          </group>
        );

      case 'ai-agents':
        // 3D Autonomous Robot Droid
        return (
          <group ref={rotatingModelRef} position={[0, 0.4, 0]}>
            {/* Head */}
            <mesh position={[0, 0.52, 0]}>
              <sphereGeometry args={[0.24, 24, 24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Glowing Cyan Visor */}
            <mesh position={[0, 0.54, 0.18]}>
              <boxGeometry args={[0.28, 0.09, 0.1]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0ea5e9"
                emissiveIntensity={3.0}
              />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 0.24, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 0.32, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Glowing Levitation Ring */}
            <mesh ref={ringRef} position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.36, 0.025, 12, 32]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        );

      case 'cloud':
        // 3D Cloud Data Center
        return (
          <group ref={rotatingModelRef} position={[0, 0.35, 0]}>
            {/* Volumetric Clouds */}
            <mesh position={[0, 0.55, 0]}>
              <sphereGeometry args={[0.32, 20, 20]} />
              <meshStandardMaterial
                color="#e0f2fe"
                emissive="#38bdf8"
                emissiveIntensity={0.6}
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh position={[-0.24, 0.48, 0.1]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.85} />
            </mesh>
            <mesh position={[0.24, 0.48, -0.08]}>
              <sphereGeometry args={[0.26, 16, 16]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.85} />
            </mesh>
            {/* Server Monoliths */}
            <mesh position={[0, 0.18, 0]}>
              <boxGeometry args={[0.4, 0.38, 0.28]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#2563eb"
                emissiveIntensity={1.5}
                metalness={0.8}
              />
            </mesh>
          </group>
        );

      case 'cybersecurity':
        // 3D Crystal Defensive Shield
        return (
          <group ref={rotatingModelRef} position={[0, 0.45, 0]}>
            <mesh position={[0, 0.35, 0]}>
              <octahedronGeometry args={[0.42, 0]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#22d3ee"
                emissiveIntensity={2.5}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
            <mesh position={[0, 0.35, 0.22]}>
              <boxGeometry args={[0.18, 0.18, 0.05]} />
              <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={2.0} />
            </mesh>
            <mesh ref={ringRef} position={[0, 0.35, 0]} rotation={[0.8, 0.4, 0]}>
              <torusGeometry args={[0.55, 0.02, 12, 32]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        );

      case 'development':
        // 3D Laptop Workstation
        return (
          <group ref={rotatingModelRef} position={[0, 0.3, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.55, 0.04, 0.38]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.32, -0.15]} rotation={[-0.25, 0, 0]}>
              <boxGeometry args={[0.55, 0.38, 0.03]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.32, -0.13]} rotation={[-0.25, 0, 0]}>
              <planeGeometry args={[0.48, 0.32]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
          </group>
        );

      case 'hardware':
        // 3D Golden Silicon GPU Chip Die
        return (
          <group ref={rotatingModelRef} position={[0, 0.3, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.58, 0.06, 0.58]} />
              <meshStandardMaterial color="#064e3b" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <boxGeometry args={[0.38, 0.1, 0.38]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#d97706"
                emissiveIntensity={2.6}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            {[-0.22, 0.22].map((off, i) => (
              <mesh key={i} position={[off, 0.26, 0]}>
                <boxGeometry args={[0.05, 0.1, 0.44]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}
          </group>
        );

      case 'tech-jobs':
        // 3D Corporate Skylines
        return (
          <group ref={rotatingModelRef} position={[0, 0.35, 0]}>
            <mesh position={[-0.15, 0.4, 0]}>
              <boxGeometry args={[0.24, 0.85, 0.24]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={1.8}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[0.15, 0.55, 0.08]}>
              <boxGeometry args={[0.22, 1.1, 0.22]} />
              <meshStandardMaterial
                color="#0ea5e9"
                emissive="#0284c7"
                emissiveIntensity={2.2}
                metalness={0.8}
              />
            </mesh>
          </group>
        );

      case 'trending':
        // 3D Pulse Antenna Tower
        return (
          <group ref={rotatingModelRef} position={[0, 0.35, 0]}>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.05, 0.18, 0.95, 12]} />
              <meshStandardMaterial
                color="#0891b2"
                emissive="#06b6d4"
                emissiveIntensity={2.4}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[0, 0.98, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#67e8f9"
                emissiveIntensity={3.5}
              />
            </mesh>
          </group>
        );

      case 'research':
        // 3D Deep Space Satellite Dish
        return (
          <group ref={rotatingModelRef} position={[0, 0.35, 0]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.45, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.55, 0]} rotation={[0.45, 0.3, 0]}>
              <cylinderGeometry args={[0.42, 0.04, 0.12, 24]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <group
      ref={groupRef}
      position={worldPos}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
    >
      {/* 1. Volumetric Asteroid Crust Base (Real 3D Mesh) */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI, 0, 0]}>
        <coneGeometry args={[0.7, 0.8, 9]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.85}
          metalness={0.3}
        />
      </mesh>

      {/* 2. Platform Upper Base with Neon Rim Glow */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.7, 0.62, 0.12, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.6}
          emissive={node.glowColor}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
        />
      </mesh>

      {/* 3. True 3D Procedural Model */}
      {renderTrue3DModel()}

      {/* 4. Island Point Light */}
      <pointLight
        position={[0, 0.5, 0.5]}
        color={node.glowColor}
        intensity={hovered || isSelected ? 3.0 : 1.5}
        distance={3.5}
      />

      {/* 5. Floating Interactive Pill Label */}
      <Html
        position={[0, 1.25, 0]}
        center
        distanceFactor={7.5}
        className="pointer-events-auto select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${hovered || isSelected
              ? 'bg-[#09152b]/95 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.8)] scale-110'
              : 'bg-[#060e1d]/85 text-slate-200 border border-slate-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-cyan-400'
            }`}
        >
          <span>{node.name}</span>
          <span className="text-cyan-400 font-bold ml-0.5">›</span>
        </button>
      </Html>
    </group>
  );
};
