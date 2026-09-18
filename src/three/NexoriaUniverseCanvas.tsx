import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Globe } from './Globe';
import { TechIsland } from './TechIsland';
import { OrbitalConnections } from './OrbitalConnections';
import { SpaceEnvironment } from './SpaceEnvironment';
import { TECHNOLOGY_NODES } from '../data/technologyData';
import type { TechnologyNode } from '../data/technologyData';
import * as THREE from 'three';

interface SceneProps {
  selectedNode: TechnologyNode | null;
  onSelectNode: (node: TechnologyNode) => void;
}

// Interactive dynamic camera controller with smooth mouse parallax & node zooming
const CameraRig: React.FC<{ selectedNode: TechnologyNode | null }> = ({ selectedNode }) => {
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (selectedNode) {
      const targetPos = new THREE.Vector3(
        selectedNode.position[0] * 0.7,
        selectedNode.position[1] * 0.7,
        selectedNode.position[2] + 4.5
      );
      state.camera.position.lerp(targetPos, 0.05);
      state.camera.lookAt(selectedNode.position[0] * 0.5, selectedNode.position[1] * 0.5, 0);
    } else {
      const defaultCamX = mouse.current.x * 0.35;
      const defaultCamY = -mouse.current.y * 0.25;
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, defaultCamX, 0.04);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, defaultCamY, 0.04);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 6.6, 0.04);
      state.camera.lookAt(0.2, 0, 0);
    }
  });

  return null;
};

export const NexoriaUniverseCanvas: React.FC<SceneProps> = ({ selectedNode, onSelectNode }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6.6], fov: 48 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true
        }}
        dpr={[1, 2]}
      >
        <CameraRig selectedNode={selectedNode} />
        <SpaceEnvironment />
        <Globe />
        <OrbitalConnections />

        {/* 10 Floating Technology Islands around Globe */}
        {TECHNOLOGY_NODES.map((node) => (
          <TechIsland
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            onSelect={onSelectNode}
          />
        ))}
      </Canvas>
    </div>
  );
};
