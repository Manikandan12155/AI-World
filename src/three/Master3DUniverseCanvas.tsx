import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PhotorealisticEarth } from './PhotorealisticEarth';
import { RealisticOrbitalBeams } from './RealisticOrbitalBeams';
import { CinematicSpaceBackdrop } from './CinematicSpaceBackdrop';
import { TECH_NODES_OVERLAY } from '../data/overlayData';
import type { TechNodeOverlay } from '../data/overlayData';
import * as THREE from 'three';

// 3D coordinates around Earth for the clean interactive labels
export const ISLAND_3D_COORDS: Record<string, [number, number, number]> = {
  'ai-genai': [0.4, 3.4, 0.4],
  'research': [-2.7, 2.7, 0.2],
  'ai-agents': [3.4, 2.7, 0.7],
  'trending': [-3.7, 0.7, 0.5],
  'cloud': [4.6, 1.4, -0.2],
  'cybersecurity': [4.2, -0.9, 0.6],
  'development': [3.0, -2.5, 1.2],
  'hardware': [-0.4, -3.6, 0.8],
  'tech-jobs': [-3.0, -2.3, 1.0],
};

interface MasterUniverseProps {
  selectedNode: TechNodeOverlay | null;
  onSelectNode: (node: TechNodeOverlay) => void;
}

// Controller to smoothly animate OrbitControls target when a node is clicked
const SceneCameraController: React.FC<{
  selectedNode: TechNodeOverlay | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}> = ({ selectedNode, controlsRef }) => {
  useFrame(() => {
    if (controlsRef.current) {
      if (selectedNode && ISLAND_3D_COORDS[selectedNode.id]) {
        const pos = ISLAND_3D_COORDS[selectedNode.id];
        // Smoothly target the selected node
        controlsRef.current.target.lerp(new THREE.Vector3(pos[0] * 0.6, pos[1] * 0.6, 0), 0.05);
      } else {
        // Return smoothly to Earth center
        controlsRef.current.target.lerp(new THREE.Vector3(0.35, 0.05, 0), 0.04);
      }
      controlsRef.current.update();
    }
  });

  return null;
};

// Realistic Procedural 3D Satellite Component with Solar Panels, Dish Antenna & HUD Tag
const Realistic3DSatellite: React.FC<{
  node: TechNodeOverlay;
  pos: [number, number, number];
  isSelected: boolean;
  onSelect: (node: TechNodeOverlay) => void;
}> = ({ node, pos, isSelected, onSelect }) => {
  const satelliteRef = useRef<THREE.Group>(null);

  // Load Aerospace Satellite Textures: Photovoltaic Solar Array & Gold MLI Thermal Foil
  const [solarTexture, goldFoilTexture] = useLoader(THREE.TextureLoader, [
    '/textures/satellite_solar_cells.jpg',
    '/textures/satellite_gold_foil.jpg'
  ]);

  // Subtle satellite orbital orientation/drift
  useFrame(({ clock }, delta) => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += delta * 0.35;
      satelliteRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.4) * 0.12;
    }
  });

  return (
    <group position={pos}>
      {/* 3D Real Satellite Mesh Group */}
      <group
        ref={satelliteRef}
        scale={isSelected ? 1.4 : 1.0}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
      >
        {/* 1. Main Satellite Bus / Body (NASA Kapton Gold Thermal Foil Texture) */}
        <mesh>
          <boxGeometry args={[0.26, 0.32, 0.26]} />
          <meshStandardMaterial
            map={goldFoilTexture}
            roughness={0.3}
            metalness={0.85}
            color="#fff0bd"
          />
        </mesh>

        {/* 2. Top Sensor / Optics Tracking Cylinder */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.12, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* 3. Parabolic High-Gain Communications Dish Antenna */}
        <group position={[0, 0, 0.22]} rotation={[0.4, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.18, 0.02, 0.06, 24, 1, true]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.6} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          {/* Feed horn */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.09, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* 4. Left Solar Array Wing (Silicon Photovoltaic Texture) */}
        <group position={[-0.52, 0, 0]}>
          {/* Solar Panel Connecting Carbon Mast */}
          <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.26, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
          {/* Photovoltaic Solar Array Panel */}
          <mesh>
            <boxGeometry args={[0.48, 0.24, 0.018]} />
            <meshStandardMaterial
              map={solarTexture}
              metalness={0.65}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* 5. Right Solar Array Wing (Silicon Photovoltaic Texture) */}
        <group position={[0.52, 0, 0]}>
          {/* Solar Panel Connecting Carbon Mast */}
          <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.26, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
          {/* Photovoltaic Solar Array Panel */}
          <mesh>
            <boxGeometry args={[0.48, 0.24, 0.018]} />
            <meshStandardMaterial
              map={solarTexture}
              metalness={0.65}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* 6. Active Telemetry Beacon Strobe Light */}
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshBasicMaterial color={node.glowColor} />
        </mesh>
        <pointLight color={node.glowColor} intensity={2.2} distance={2.5} />
      </group>


      {/* Floating HUD Satellite Tag Label */}
      <Html
        position={[0, 0.42, 0]}
        center
        distanceFactor={7.2}
        className="pointer-events-auto select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${isSelected
              ? 'bg-[#09152b]/95 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.8)] scale-110'
              : 'bg-[#060e1d]/85 text-slate-200 border border-slate-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:border-cyan-400 hover:scale-105'
            }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
          <span>{node.name}</span>
          <span className="text-cyan-400 font-bold ml-0.5">›</span>
        </button>
      </Html>
    </group>
  );
};


export const Master3DUniverseCanvas: React.FC<MasterUniverseProps> = ({
  selectedNode,
  onSelectNode
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 13.2], fov: 50 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneCameraController selectedNode={selectedNode} controlsRef={controlsRef} />

          {/* Interactive 360-degree OrbitControls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.9}
            panSpeed={0.8}
            minDistance={4.5}
            maxDistance={25}
            enablePan={true}
          />

          <CinematicSpaceBackdrop />
          <PhotorealisticEarth />
          <RealisticOrbitalBeams nodePositions={ISLAND_3D_COORDS} />

          {/* Realistic 3D Satellites orbiting Earth with Solar Panels & HUD tags */}
          {TECH_NODES_OVERLAY.map((node) => {
            const pos = ISLAND_3D_COORDS[node.id];
            if (!pos) return null;
            return (
              <Realistic3DSatellite
                key={node.id}
                node={node}
                pos={pos}
                isSelected={selectedNode?.id === node.id}
                onSelect={onSelectNode}
              />
            );
          })}

        </Suspense>
      </Canvas>
    </div>
  );
};

