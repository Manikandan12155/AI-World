import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { TechNodeOverlay } from '../data/overlayData';

interface RealisticTechIslandProps {
  node: TechNodeOverlay;
  worldPos: [number, number, number];
  isSelected: boolean;
  onSelect: (node: TechNodeOverlay) => void;
}

export const RealisticTechIsland: React.FC<RealisticTechIslandProps> = ({
  node,
  worldPos,
  isSelected,
  onSelect
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const offset = (worldPos[0] * 3 + worldPos[1]) % 6;
      // Organic floating bob
      groupRef.current.position.y = worldPos[1] + Math.sin(t * 1.6 + offset) * 0.09;
      // Smooth scale on hover
      const targetScale = hovered || isSelected ? 1.2 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  // Detailed 3D Architecture for each node matching the reference visual style
  const renderIslandContent = () => {
    switch (node.id) {
      case 'ai-genai':
        // Purple illuminated futuristic metropolis + AI holographic pillar
        return (
          <group ref={modelRef} position={[0, 0.35, 0]}>
            {/* Center glowing spire */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.26, 0.85, 0.26]} />
              <meshStandardMaterial
                color="#a855f7"
                emissive="#c084fc"
                emissiveIntensity={2.5}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            {/* Holographic AI symbol badge floating in front */}
            <mesh position={[0, 0.38, 0.18]}>
              <planeGeometry args={[0.18, 0.18]} />
              <meshBasicMaterial color="#f3e8ff" />
            </mesh>
            {/* Surrounding neon glass skyscrapers */}
            {[-0.22, 0.22].map((x, i) => (
              <mesh key={i} position={[x, 0.3, (i - 0.5) * 0.2]}>
                <boxGeometry args={[0.16, 0.55 + i * 0.1, 0.16]} />
                <meshStandardMaterial
                  color="#3b82f6"
                  emissive="#60a5fa"
                  emissiveIntensity={1.5}
                />
              </mesh>
            ))}
          </group>
        );

      case 'ai-agents':
        // White ceramic robot droid with glowing cyan visor
        return (
          <group ref={modelRef} position={[0, 0.35, 0]}>
            {/* Droid Head */}
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.2, 24, 24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.85} />
            </mesh>
            {/* Glowing Cyan Visor */}
            <mesh position={[0, 0.42, 0.16]}>
              <boxGeometry args={[0.24, 0.08, 0.08]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            {/* Droid Torso */}
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.14, 0.18, 0.26, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Floating Energy Hover Ring */}
            <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.28, 0.02, 12, 32]} />
              <meshBasicMaterial color="#0ea5e9" />
            </mesh>
          </group>
        );

      case 'cloud':
        // Volumetric cloud clusters + datacenter towers
        return (
          <group ref={modelRef} position={[0, 0.3, 0]}>
            {/* Stylized puffy glowing clouds */}
            <mesh position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.26, 20, 20]} />
              <meshStandardMaterial color="#e0f2fe" transparent opacity={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[-0.18, 0.38, 0.08]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.18, 0.38, -0.06]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.8} />
            </mesh>
            {/* Server Rack Monoliths */}
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.32, 0.3, 0.24]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#2563eb"
                emissiveIntensity={1.2}
                metalness={0.8}
              />
            </mesh>
          </group>
        );

      case 'cybersecurity':
        // Faceted glowing crystal shield + holographic defensive shield
        return (
          <group ref={modelRef} position={[0, 0.38, 0]}>
            <mesh position={[0, 0.3, 0]}>
              <octahedronGeometry args={[0.32, 0]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#22d3ee"
                emissiveIntensity={2.0}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
            {/* Neon Lock / Symbol */}
            <mesh position={[0, 0.3, 0.2]}>
              <boxGeometry args={[0.14, 0.14, 0.04]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Rotating defense rings */}
            <mesh position={[0, 0.3, 0]} rotation={[0.8, 0.4, 0]}>
              <torusGeometry args={[0.42, 0.015, 8, 32]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        );

      case 'development':
        // Modern Laptop Workstation & Terminal
        return (
          <group ref={modelRef} position={[0, 0.25, 0]}>
            {/* Keyboard base */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.45, 0.03, 0.32]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Angled Laptop Display */}
            <mesh position={[0, 0.28, -0.12]} rotation={[-0.25, 0, 0]}>
              <boxGeometry args={[0.45, 0.3, 0.02]} />
              <meshStandardMaterial color="#090d16" metalness={0.9} />
            </mesh>
            {/* Glowing cyan code terminal `</>` */}
            <mesh position={[0, 0.28, -0.105]} rotation={[-0.25, 0, 0]}>
              <planeGeometry args={[0.4, 0.25]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
          </group>
        );

      case 'hardware':
        // Golden GPU Silicon processor die + copper heat sinks
        return (
          <group ref={modelRef} position={[0, 0.25, 0]}>
            {/* Dark green / black PCB board */}
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.48, 0.04, 0.48]} />
              <meshStandardMaterial color="#064e3b" roughness={0.4} metalness={0.5} />
            </mesh>
            {/* Golden Processor Core die */}
            <mesh position={[0, 0.16, 0]}>
              <boxGeometry args={[0.3, 0.08, 0.3]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#d97706"
                emissiveIntensity={2.2}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            {/* Golden perimeter pins */}
            {[-0.18, 0.18].map((offset, i) => (
              <mesh key={i} position={[offset, 0.22, 0]}>
                <boxGeometry args={[0.04, 0.08, 0.36]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}
          </group>
        );

      case 'tech-jobs':
        // Glowing corporate high-rise towers with "JOBS" signage
        return (
          <group ref={modelRef} position={[0, 0.3, 0]}>
            <mesh position={[-0.12, 0.35, 0]}>
              <boxGeometry args={[0.2, 0.7, 0.2]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={1.5}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[0.12, 0.45, 0.06]}>
              <boxGeometry args={[0.18, 0.9, 0.18]} />
              <meshStandardMaterial
                color="#0ea5e9"
                emissive="#0284c7"
                emissiveIntensity={1.8}
                metalness={0.8}
              />
            </mesh>
          </group>
        );

      case 'trending':
        // Data signal beacon tower
        return (
          <group ref={modelRef} position={[0, 0.3, 0]}>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.04, 0.14, 0.8, 12]} />
              <meshStandardMaterial
                color="#0891b2"
                emissive="#06b6d4"
                emissiveIntensity={2.0}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[0, 0.82, 0]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshBasicMaterial color="#22d3ee" />
            </mesh>
          </group>
        );

      case 'research':
        // Deep space orbital satellite dish
        return (
          <group ref={modelRef} position={[0, 0.3, 0]}>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.03, 0.05, 0.4, 12]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.48, 0]} rotation={[0.45, 0.3, 0]}>
              <cylinderGeometry args={[0.32, 0.03, 0.09, 24]} />
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
      {/* 1. Sculpted Island Rock Base (Asteroid crust matching reference) */}
      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI, 0, 0]}>
        <coneGeometry args={[0.55, 0.65, 8]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.9}
          metalness={0.25}
        />
      </mesh>

      {/* 2. Platform Upper Soil with Glowing Rim */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.55, 0.48, 0.1, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.7}
          emissive={node.glowColor}
          emissiveIntensity={hovered || isSelected ? 0.6 : 0.25}
        />
      </mesh>

      {/* 3. Detailed Technology Structure */}
      {renderIslandContent()}

      {/* 4. Floating Pill Label matching reference */}
      <Html
        position={[0, 0.95, 0]}
        center
        distanceFactor={6.8}
        className="pointer-events-auto select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
            hovered || isSelected
              ? 'bg-[#09152b]/95 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.7)] scale-110'
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
