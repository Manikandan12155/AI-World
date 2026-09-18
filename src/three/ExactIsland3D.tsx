import { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import type { TechNodeOverlay } from '../data/overlayData';

interface ExactIsland3DProps {
  node: TechNodeOverlay;
  worldPos: [number, number, number];
  texturePath: string;
  size: [number, number];
  isSelected: boolean;
  onSelect: (node: TechNodeOverlay) => void;
}

export const ExactIsland3D: React.FC<ExactIsland3DProps> = ({
  node,
  worldPos,
  texturePath,
  size,
  isSelected,
  onSelect
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useLoader(THREE.TextureLoader, texturePath);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const offset = (worldPos[0] * 2.5 + worldPos[1]) % 5;
      // Organic floating bob in space
      groupRef.current.position.y = worldPos[1] + Math.sin(t * 1.5 + offset) * 0.08;
      
      const targetScale = hovered || isSelected ? 1.15 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

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
      {/* 1. High-Fidelity Island Visual Plane matching reference artwork exactly */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          roughness={0.4}
          metalness={0.2}
          emissive={new THREE.Color(node.glowColor)}
          emissiveIntensity={hovered || isSelected ? 0.35 : 0.08}
        />
      </mesh>

      {/* 2. Ambient Under-Glow Halo */}
      <pointLight
        position={[0, -0.2, 0.3]}
        color={node.glowColor}
        intensity={hovered || isSelected ? 2.5 : 1.2}
        distance={2.5}
      />
    </group>
  );
};
