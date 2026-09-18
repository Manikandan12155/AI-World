import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RealisticGlobe } from './RealisticGlobe';
import { RealisticTechIsland } from './RealisticTechIsland';
import { RealisticOrbitalBeams } from './RealisticOrbitalBeams';
import { CinematicSpaceBackdrop } from './CinematicSpaceBackdrop';
import { TECH_NODES_OVERLAY } from '../data/overlayData';
import type { TechNodeOverlay } from '../data/overlayData';
import * as THREE from 'three';

// 3D coordinates aligned with reference image composition
export const NODE_3D_POSITIONS: Record<string, [number, number, number]> = {
  'ai-genai': [0.4, 3.4, 0.4],
  'research': [-2.7, 2.8, 0.2],
  'ai-agents': [3.6, 2.9, 0.7],
  'trending': [-3.8, 0.8, 0.5],
  'cloud': [4.9, 1.4, -0.2],
  'cybersecurity': [4.4, -1.0, 0.6],
  'development': [3.1, -2.6, 1.2],
  'hardware': [-0.4, -3.7, 0.8],
  'tech-jobs': [-3.2, -2.4, 1.0],
};

interface SceneProps {
  selectedNode: TechNodeOverlay | null;
  onSelectNode: (node: TechNodeOverlay) => void;
}

const CameraParallax: React.FC<{ selectedNode: TechNodeOverlay | null }> = ({ selectedNode }) => {
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    if (selectedNode) {
      const pos = NODE_3D_POSITIONS[selectedNode.id] || [0, 0, 0];
      const targetPos = new THREE.Vector3(pos[0] * 0.7, pos[1] * 0.7, pos[2] + 4.5);
      state.camera.position.lerp(targetPos, 0.05);
      state.camera.lookAt(pos[0] * 0.5, pos[1] * 0.5, 0);
    } else {
      const targetX = mouse.current.x * 0.35;
      const targetY = -mouse.current.y * 0.25;
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 7.8, 0.04);
      state.camera.lookAt(0.3, 0.0, 0);
    }
  });

  return null;
};

export const Pure3DUniverseCanvas: React.FC<SceneProps> = ({ selectedNode, onSelectNode }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 46 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true
        }}
        dpr={[1, 2]}
      >
        <CameraParallax selectedNode={selectedNode} />
        <CinematicSpaceBackdrop />
        <RealisticGlobe />
        <RealisticOrbitalBeams nodePositions={NODE_3D_POSITIONS} />

        {/* 3D Floating Technology Islands */}
        {TECH_NODES_OVERLAY.map((node) => {
          const pos = NODE_3D_POSITIONS[node.id] || [0, 0, 0];
          return (
            <RealisticTechIsland
              key={node.id}
              node={node}
              worldPos={pos}
              isSelected={selectedNode?.id === node.id}
              onSelect={onSelectNode}
            />
          );
        })}
      </Canvas>
    </div>
  );
};
