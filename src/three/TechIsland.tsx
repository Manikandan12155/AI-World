import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { TechnologyNode } from '../data/technologyData';

interface TechIslandProps {
  node: TechnologyNode;
  isSelected: boolean;
  onSelect: (node: TechnologyNode) => void;
}

export const TechIsland: React.FC<TechIslandProps> = ({ node, isSelected, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Floating bobbing motion & continuous subtle rotation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const offset = (node.position[0] * 2 + node.position[1]) % 5;
      groupRef.current.position.y = node.position[1] + Math.sin(t * 1.5 + offset) * 0.08;
      if (hovered) {
        groupRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.015;
    }
  });

  const renderIslandVisual = () => {
    switch (node.type) {
      case 'ai':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh ref={coreRef} position={[0, 0.35, 0]}>
              <boxGeometry args={[0.22, 0.38, 0.22]} />
              <meshStandardMaterial
                color="#c084fc"
                emissive="#9333ea"
                emissiveIntensity={1.8}
              />
            </mesh>
            <mesh position={[-0.18, 0.15, 0.1]}>
              <boxGeometry args={[0.08, 0.3, 0.08]} />
              <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0.18, 0.2, -0.08]}>
              <boxGeometry args={[0.08, 0.4, 0.08]} />
              <meshStandardMaterial color="#818cf8" emissive="#6366f1" emissiveIntensity={0.9} />
            </mesh>
            <mesh position={[0.1, 0.1, 0.18]}>
              <boxGeometry args={[0.07, 0.2, 0.07]} />
              <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={0.8} />
            </mesh>
          </group>
        );

      case 'agents':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh ref={coreRef} position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#e0f2fe" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.3, 0.12]}>
              <boxGeometry args={[0.16, 0.05, 0.06]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.22, 0.015, 8, 24]} />
              <meshBasicMaterial color="#0ea5e9" />
            </mesh>
          </group>
        );

      case 'cloud':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[-0.14, 0.3, 0.05]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="#93c5fd" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.14, 0.3, -0.05]}>
              <sphereGeometry args={[0.17, 16, 16]} />
              <meshStandardMaterial color="#93c5fd" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.26, 0.22, 0.2]} />
              <meshStandardMaterial color="#1e293b" emissive="#3b82f6" emissiveIntensity={0.6} />
            </mesh>
          </group>
        );

      case 'security':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh ref={coreRef} position={[0, 0.26, 0]}>
              <octahedronGeometry args={[0.24, 0]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#0891b2"
                emissiveIntensity={1.4}
              />
            </mesh>
            <mesh position={[0, 0.26, 0]} rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[0.3, 0.012, 8, 24]} />
              <meshBasicMaterial color="#22d3ee" />
            </mesh>
          </group>
        );

      case 'dev':
        return (
          <group position={[0, 0.18, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.34, 0.02, 0.24]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.22, -0.1]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.34, 0.22, 0.02]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0.22, -0.088]} rotation={[-0.2, 0, 0]}>
              <planeGeometry args={[0.3, 0.18]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
          </group>
        );

      case 'hardware':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.36, 0.05, 0.36]} />
              <meshStandardMaterial color="#78350f" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh ref={coreRef} position={[0, 0.14, 0]}>
              <boxGeometry args={[0.22, 0.07, 0.22]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#d97706"
                emissiveIntensity={1.5}
                metalness={0.9}
              />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
          </group>
        );

      case 'jobs':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh position={[-0.1, 0.25, 0]}>
              <boxGeometry args={[0.14, 0.45, 0.14]} />
              <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0.1, 0.32, 0.05]}>
              <boxGeometry args={[0.12, 0.58, 0.12]} />
              <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.8} />
            </mesh>
          </group>
        );

      case 'trending':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.03, 0.12, 0.55, 8]} />
              <meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={0.9} />
            </mesh>
            <mesh position={[0, 0.58, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#22d3ee" />
            </mesh>
          </group>
        );

      case 'research':
        return (
          <group position={[0, 0.2, 0]}>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.02, 0.04, 0.28, 8]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[0, 0.34, 0]} rotation={[0.4, 0.3, 0]}>
              <cylinderGeometry args={[0.22, 0.02, 0.08, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
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
      position={node.position}
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
      {/* Island Floating Asteroid Rock Base */}
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI, 0, 0]}>
        <coneGeometry args={[0.42, 0.5, 7]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.85}
          metalness={0.2}
        />
      </mesh>

      {/* Flat Island Top Soil / Platform */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.38, 0.08, 12]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.6}
          emissive={node.glowColor}
          emissiveIntensity={hovered || isSelected ? 0.35 : 0.15}
        />
      </mesh>

      {/* Island Specific 3D Object */}
      {renderIslandVisual()}

      {/* Floating Island Glowing Label */}
      <Html
        position={[0, 0.72, 0]}
        center
        distanceFactor={6.8}
        className="pointer-events-auto select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
            hovered || isSelected
              ? 'bg-[#0b1528]/95 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.6)] scale-105'
              : 'bg-[#070e1c]/85 text-slate-200 border border-slate-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:border-cyan-400/80'
          }`}
        >
          <span>{node.name}</span>
          <span className="text-cyan-400 font-bold ml-0.5">›</span>
        </button>
      </Html>
    </group>
  );
};
