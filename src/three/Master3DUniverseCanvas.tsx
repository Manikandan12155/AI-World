import React, { useRef, Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, useProgress } from '@react-three/drei';

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#030a16]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_50px_rgba(56,189,248,0.4)] text-center min-w-[260px] pointer-events-none">
        <div className="relative w-14 h-14 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="w-8 h-8 rounded-full bg-cyan-400/20 animate-ping" />
          <span className="text-cyan-400 font-bold text-xs font-['Space_Grotesk']">3D</span>
        </div>
        <div className="text-cyan-300 font-bold text-sm tracking-wider uppercase mb-1 font-['Space_Grotesk']">
          Loading Universe
        </div>
        <div className="text-slate-400 text-xs mb-3 font-medium">
          Initializing 3D Shaders & Textures...
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-2 p-0.5 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
            style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
          />
        </div>
        <div className="text-cyan-400 font-mono text-[11px] mt-2 font-semibold">
          {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PhotorealisticEarth } from './PhotorealisticEarth';
import { RealisticOrbitalBeams } from './RealisticOrbitalBeams';
import { CinematicSpaceBackdrop } from './CinematicSpaceBackdrop';
import { SolarSystemPlanets } from './SolarSystemPlanets';
import { DwarfPlanets3D } from './DwarfPlanets3D';
import { Comets3D } from './Comets3D';
import { KuiperBelt3D, OortCloud3D } from './TransNeptunianBelts';
import { TECH_NODES_OVERLAY } from '../data/overlayData';
import type { TechNodeOverlay } from '../data/overlayData';
import * as THREE from 'three';

import { getAssetUrl } from '../utils/assetPath';

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

// Controller to smoothly animate OrbitControls target when a node or planet is clicked
const SceneCameraController: React.FC<{
  selectedNode: TechNodeOverlay | null;
  selectedPlanetName: string | null;
  viewMode: 'earth' | 'solarsystem';
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  planetPositionsRef: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number }>>;
}> = ({ selectedNode, selectedPlanetName, viewMode, controlsRef, planetPositionsRef }) => {
  const prevTargetPlanetRef = useRef<string | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Trigger smooth one-time camera entry flight whenever a new planet is selected
  useMemo(() => {
    if (selectedPlanetName !== prevTargetPlanetRef.current) {
      prevTargetPlanetRef.current = selectedPlanetName;
      isTransitioningRef.current = true;
    }
  }, [selectedPlanetName]);

  useFrame(({ camera }) => {
    if (controlsRef.current) {
      if (selectedPlanetName && planetPositionsRef.current[selectedPlanetName]) {
        let { pos: planetPos, viewDist } = planetPositionsRef.current[selectedPlanetName];

        // Mobile responsiveness adjustment:
        const isMobile = window.innerWidth < 640;
        if (isMobile) {
          if (selectedPlanetName === 'Sun') {
            viewDist *= 1.75;
          } else {
            viewDist *= 1.25;
          }
        }

        // 1. Keep orbit pivot target locked to the selected planet's center
        controlsRef.current.target.lerp(planetPos, 0.1);

        // 2. Smooth entry flight on selection, then release camera control to allow 100% free Mouse Wheel Zoom In / Out!
        if (isTransitioningRef.current) {
          const camOffset = camera.position.clone().sub(planetPos);
          const currentDist = camOffset.length();
          if (Math.abs(currentDist - viewDist) > 0.4) {
            if (currentDist < 0.1) camOffset.set(0, 1, 2);
            const desiredCamPos = planetPos.clone().add(camOffset.normalize().multiplyScalar(viewDist));
            camera.position.lerp(desiredCamPos, 0.1);
          } else {
            // Arrived! Give user 100% free control for Zoom In / Zoom Out and 360° Orbiting
            isTransitioningRef.current = false;
          }
        }
      } else if (viewMode === 'solarsystem') {
        const targetPos = new THREE.Vector3(12, 0, 0);
        controlsRef.current.target.lerp(targetPos, 0.05);

        if (isTransitioningRef.current) {
          const camOffset = camera.position.clone().sub(targetPos);
          const currentDist = camOffset.length();
          if (Math.abs(currentDist - 110) > 6.0) {
            if (currentDist < 0.1) camOffset.set(0, 50, 100);
            const desiredCamPos = targetPos.clone().add(camOffset.normalize().multiplyScalar(110));
            camera.position.lerp(desiredCamPos, 0.05);
          } else {
            isTransitioningRef.current = false;
          }
        }
      } else if (selectedNode && ISLAND_3D_COORDS[selectedNode.id]) {
        const pos = ISLAND_3D_COORDS[selectedNode.id];
        controlsRef.current.target.lerp(new THREE.Vector3(pos[0] * 0.6, pos[1] * 0.6, 0), 0.05);
      } else {
        // Return smoothly to Earth center
        controlsRef.current.target.lerp(new THREE.Vector3(0.35, 0.05, 0), 0.04);
        if (!selectedNode && viewMode === 'earth' && !selectedPlanetName && camera.position.length() > 25) {
          camera.position.lerp(new THREE.Vector3(0, 0, 13.2), 0.04);
        }
      }
      controlsRef.current.update();
    }
  });

  return null;
};

// Realistic Procedural 3D Satellite Component with Solar Panels, Dish Antenna & HUD Tag
// ============================================================================
// 4 DISTINCT SCI-FI AEROSPACE SATELLITE DESIGNS (Exact Sketchfab Reference)
// ============================================================================

// Type 1: Deep Space 4-Wing X-Array Explorer (Models 3 & 5 in Sketchfab)
// Used for: 'ai-genai', 'ai-agents', 'trending'
const DeepSpaceXExplorer: React.FC<{
  solarTexture: THREE.Texture;
  goldFoilTexture: THREE.Texture;
  glowColor: string;
}> = ({ solarTexture, goldFoilTexture, glowColor }) => (
  <group rotation={[0.25, 0.4, 0.15]}>
    {/* Central Fuselage & Nose Probe */}
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.72, 32]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.084, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.005, 0.003, 0.36, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
      {/* Gold MLI Blanket */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 32]} />
        <meshStandardMaterial map={goldFoilTexture} metalness={0.9} roughness={0.25} color="#ffe58f" />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <torusGeometry args={[0.092, 0.01, 12, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.19, 0]}>
        <torusGeometry args={[0.092, 0.01, 12, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Ion Thruster Bell */}
      <group position={[0, -0.42, 0]} rotation={[Math.PI, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.082, 0.13, 24, 1, true]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
        </mesh>
        <pointLight color="#38bdf8" intensity={1.5} distance={1.2} />
      </group>
    </group>
    {/* Communications Dish */}
    <group position={[-0.11, 0.14, 0.12]} rotation={[0.45, -0.6, 0.2]}>
      <mesh position={[0, 0, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.009, 0.15, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.16, 0.02, 0.065, 32, 1, true]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
    </group>
    {/* 4 Angled X-Wings */}
    <group position={[0, 0, 0]}>
      {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((angle, idx) => (
        <group key={idx} rotation={[0, 0, angle]}>
          <mesh position={[0, 0.20, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <group position={[0, 0.44, 0]}>
            <mesh>
              <boxGeometry args={[0.20, 0.40, 0.012]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.008]}>
              <planeGeometry args={[0.185, 0.38]} />
              <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
            </mesh>
            <mesh position={[0, 0, -0.008]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.185, 0.38]} />
              <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
    <mesh position={[0, -0.2, 0.11]}>
      <sphereGeometry args={[0.03, 12, 12]} />
      <meshBasicMaterial color={glowColor} />
    </mesh>
    <pointLight color={glowColor} intensity={2.0} distance={2.5} />
  </group>
);

// Type 2: Starlink Phased-Array Flat Satellite (Model 1 in Sketchfab)
// Used for: 'cloud', 'cybersecurity'
const StarlinkCommsSat: React.FC<{
  solarTexture: THREE.Texture;
  goldFoilTexture: THREE.Texture;
  glowColor: string;
}> = ({ solarTexture, goldFoilTexture, glowColor }) => (
  <group rotation={[0.4, -0.3, 0.1]}>
    {/* Flat Compact Avionics Chassis Bus */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.56, 0.28, 0.06]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
    </mesh>
    {/* Underside Gold Thermal Blanket */}
    <mesh position={[0, 0, -0.032]}>
      <planeGeometry args={[0.54, 0.26]} />
      <meshStandardMaterial map={goldFoilTexture} metalness={0.9} roughness={0.25} />
    </mesh>
    {/* Flat Phased Array Antenna Grid on Top */}
    <mesh position={[0.12, 0, 0.032]}>
      <cylinderGeometry args={[0.10, 0.10, 0.008, 24]} />
      <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.2} />
    </mesh>
    <mesh position={[-0.14, 0, 0.032]}>
      <cylinderGeometry args={[0.08, 0.08, 0.008, 24]} />
      <meshStandardMaterial color="#38bdf8" metalness={0.6} roughness={0.2} />
    </mesh>
    {/* Star Tracker Optics & Laser Comm Optical Head */}
    <mesh position={[0.24, 0.11, 0.03]}>
      <boxGeometry args={[0.05, 0.05, 0.04]} />
      <meshStandardMaterial color="#0f172a" metalness={0.9} />
    </mesh>
    <mesh position={[0.24, 0.11, 0.052]}>
      <sphereGeometry args={[0.018, 12, 12]} />
      <meshBasicMaterial color={glowColor} />
    </mesh>
    {/* Single Large Accordion Deployable Solar Wing */}
    <group position={[-0.28, 0, 0]}>
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
      <group position={[-0.56, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.68, 0.36, 0.012]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.008]}>
          <planeGeometry args={[0.66, 0.34]} />
          <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0, -0.008]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.66, 0.34]} />
          <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
        </mesh>
      </group>
    </group>
    {/* Krypton Hall-Effect Thruster at Aft */}
    <mesh position={[0.28, 0, 0]}>
      <boxGeometry args={[0.04, 0.08, 0.03]} />
      <meshStandardMaterial color="#475569" metalness={0.9} />
    </mesh>
    <mesh position={[0.305, 0, 0]}>
      <sphereGeometry args={[0.02, 12, 12]} />
      <meshBasicMaterial color="#38bdf8" />
    </mesh>
    <pointLight color={glowColor} intensity={2.0} distance={2.5} position={[0.24, 0.11, 0.06]} />
  </group>
);

// Type 3: Orbital Space Station / Modular ISS Science Lab (Models 2 & 4 in Sketchfab)
// Used for: 'research', 'development'
const OrbitalStationLab: React.FC<{
  solarTexture: THREE.Texture;
  goldFoilTexture: THREE.Texture;
  glowColor: string;
}> = ({ solarTexture, goldFoilTexture, glowColor }) => (
  <group rotation={[0.15, 0.6, -0.2]}>
    {/* Central Cylindrical Habitat Module */}
    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.11, 0.11, 0.52, 24]} />
      <meshStandardMaterial color="#f1f5f9" metalness={0.65} roughness={0.3} />
    </mesh>
    {/* Transverse Cross Science Module */}
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.09, 0.09, 0.38, 24]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.25} />
    </mesh>
    {/* Gold MLI Thermal Collar */}
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.115, 0.115, 0.12, 24]} />
      <meshStandardMaterial map={goldFoilTexture} metalness={0.9} roughness={0.25} color="#ffe58f" />
    </mesh>
    {/* Docking Node Port Ring */}
    <mesh position={[0, 0.20, 0]}>
      <torusGeometry args={[0.06, 0.015, 8, 24]} />
      <meshStandardMaterial color="#64748b" metalness={0.9} />
    </mesh>
    {/* Long Carbon Structural Truss Girder Beams extending Left & Right */}
    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.012, 0.012, 1.25, 8]} />
      <meshStandardMaterial color="#1e293b" metalness={0.9} />
    </mesh>
    {/* Dual Large Solar Array Wings (Left Twin Panels) */}
    <group position={[-0.78, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.42, 0.28, 0.012]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[0.40, 0.26]} />
        <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, -0.008]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.40, 0.26]} />
        <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
      </mesh>
    </group>
    {/* Dual Large Solar Array Wings (Right Twin Panels) */}
    <group position={[0.78, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.42, 0.28, 0.012]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[0.40, 0.26]} />
        <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, -0.008]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.40, 0.26]} />
        <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
      </mesh>
    </group>
    {/* Heat Dissipation Radiator Fins */}
    <mesh position={[0, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.22, 0.16]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} side={THREE.DoubleSide} />
    </mesh>
    {/* Observation Cupola Window Dome */}
    <mesh position={[0, 0, 0.14]}>
      <sphereGeometry args={[0.04, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial color={glowColor} />
    </mesh>
    <pointLight color={glowColor} intensity={2.0} distance={2.5} position={[0, 0, 0.16]} />
  </group>
);

// Type 4: Telecom Heavy Relay Satellite (Model 6 in Sketchfab)
// Used for: 'hardware', 'tech-jobs'
const TelecomHeavyRelay: React.FC<{
  solarTexture: THREE.Texture;
  goldFoilTexture: THREE.Texture;
  glowColor: string;
}> = ({ solarTexture, goldFoilTexture, glowColor }) => (
  <group rotation={[-0.3, 0.5, 0.2]}>
    {/* Hexagonal Central Avionics Core */}
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
      <cylinderGeometry args={[0.13, 0.13, 0.38, 6]} />
      <meshStandardMaterial map={goldFoilTexture} metalness={0.9} roughness={0.25} color="#ffe58f" />
    </mesh>
    {/* Top & Bottom Structural Caps */}
    <mesh position={[0, 0.20, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 0.03, 6]} />
      <meshStandardMaterial color="#334155" metalness={0.9} />
    </mesh>
    <mesh position={[0, -0.20, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 0.03, 6]} />
      <meshStandardMaterial color="#334155" metalness={0.9} />
    </mesh>
    {/* Dual Large Parabolic Comms Dishes (Left & Right) */}
    <group position={[-0.18, 0, 0.12]} rotation={[0.3, -0.8, 0]}>
      <mesh>
        <cylinderGeometry args={[0.16, 0.02, 0.05, 24, 1, true]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
    <group position={[0.18, 0, 0.12]} rotation={[0.3, 0.8, 0]}>
      <mesh>
        <cylinderGeometry args={[0.16, 0.02, 0.05, 24, 1, true]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
    {/* Twin Articulated Solar Array Wings (Angled Outward) */}
    <group position={[-0.56, 0, 0]} rotation={[0, 0.2, 0]}>
      <mesh>
        <boxGeometry args={[0.48, 0.24, 0.012]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[0.46, 0.22]} />
        <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, -0.008]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.46, 0.22]} />
        <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
      </mesh>
    </group>
    <group position={[0.56, 0, 0]} rotation={[0, -0.2, 0]}>
      <mesh>
        <boxGeometry args={[0.48, 0.24, 0.012]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[0.46, 0.22]} />
        <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, -0.008]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.46, 0.22]} />
        <meshStandardMaterial map={solarTexture} metalness={0.8} roughness={0.18} />
      </mesh>
    </group>
    {/* Dual Aft Thruster Nozzles */}
    <group position={[0, -0.24, 0]}>
      <mesh position={[-0.05, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.04, 0.06, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} />
      </mesh>
      <mesh position={[0.05, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.04, 0.06, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
    </group>
    <pointLight color={glowColor} intensity={2.0} distance={2.5} position={[0, 0, 0.12]} />
  </group>
);


// Master Satellite Component Dispatcher
const Realistic3DSatellite: React.FC<{
  node: TechNodeOverlay;
  pos: [number, number, number];
  isSelected: boolean;
  onSelect: (node: TechNodeOverlay) => void;
}> = ({ node, pos, isSelected, onSelect }) => {
  const satelliteRef = useRef<THREE.Group>(null);

  // Load Aerospace Satellite Textures: Photovoltaic Solar Array & Gold MLI Thermal Foil
  const [solarTexture, goldFoilTexture] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/satellite_solar_cells.jpg'),
    getAssetUrl('/textures/satellite_gold_foil.jpg')
  ]);

  useMemo(() => {
    if (solarTexture) solarTexture.colorSpace = THREE.SRGBColorSpace;
    if (goldFoilTexture) goldFoilTexture.colorSpace = THREE.SRGBColorSpace;
  }, [solarTexture, goldFoilTexture]);

  // Unique orbital rotation speed and drift for each satellite
  const rotSpeed = useMemo(() => {
    switch (node.id) {
      case 'ai-genai':
      case 'ai-agents':
        return 0.32;
      case 'cloud':
      case 'cybersecurity':
        return 0.22;
      case 'research':
      case 'development':
        return 0.18;
      default:
        return 0.26;
    }
  }, [node.id]);

  useFrame(({ clock }, delta) => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += delta * rotSpeed;
      satelliteRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.35 + node.name.length) * 0.07;
    }
  });

  // Select which architecture to render based on tech category
  const renderSatelliteModel = () => {
    switch (node.id) {
      case 'ai-genai':
      case 'ai-agents':
      case 'trending':
        return (
          <DeepSpaceXExplorer
            solarTexture={solarTexture}
            goldFoilTexture={goldFoilTexture}
            glowColor={node.glowColor}
          />
        );
      case 'cloud':
      case 'cybersecurity':
        return (
          <StarlinkCommsSat
            solarTexture={solarTexture}
            goldFoilTexture={goldFoilTexture}
            glowColor={node.glowColor}
          />
        );
      case 'research':
      case 'development':
        return (
          <OrbitalStationLab
            solarTexture={solarTexture}
            goldFoilTexture={goldFoilTexture}
            glowColor={node.glowColor}
          />
        );
      case 'hardware':
      case 'tech-jobs':
      default:
        return (
          <TelecomHeavyRelay
            solarTexture={solarTexture}
            goldFoilTexture={goldFoilTexture}
            glowColor={node.glowColor}
          />
        );
    }
  };

  return (
    <group position={pos}>
      {/* 3D Satellite Mesh with Unique Architecture (Compact & Sleek Scale) */}
      <group
        ref={satelliteRef}
        scale={isSelected ? 0.95 : 0.72}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
      >
        {renderSatelliteModel()}
      </group>

      {/* Floating HUD Satellite Tag Label */}
      <Html
        position={[0, 0.36, 0]}
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
  const planetPositionsRef = useRef<Record<string, { pos: THREE.Vector3; viewDist: number }>>({});
  const [selectedPlanetName, setSelectedPlanetName] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'earth' | 'solarsystem'>('earth');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<'planets' | 'moons' | 'dwarfs' | 'comets' | null>(null);

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
        <Suspense fallback={<CanvasLoader />}>
          <SceneCameraController
            selectedNode={selectedNode}
            selectedPlanetName={selectedPlanetName}
            viewMode={viewMode}
            controlsRef={controlsRef}
            planetPositionsRef={planetPositionsRef}
          />

          {/* Interactive 360-degree OrbitControls allowing smooth zoom between Earth and Solar System */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.9}
            panSpeed={0.8}
            minDistance={2.5}
            maxDistance={180}
            enablePan={true}
          />

          <CinematicSpaceBackdrop />
          <PhotorealisticEarth isFocused={selectedPlanetName === 'Earth' || (!selectedPlanetName && viewMode === 'earth')} planetPositionsRef={planetPositionsRef} />
          <RealisticOrbitalBeams nodePositions={ISLAND_3D_COORDS} />

          {/* Real Distant Solar System Planets (Click planet or its orbit to fly right up close!) */}
          <SolarSystemPlanets
            onSelectPlanet={(name) => {
              setSelectedPlanetName(name);
              setViewMode('earth');
            }}
            selectedPlanetName={selectedPlanetName}
            isSolarMode={viewMode === 'solarsystem'}
            planetPositionsRef={planetPositionsRef}
          />

          {/* 3D Dwarf Planets (Pluto, Ceres, Eris, Haumea, Makemake) */}
          <DwarfPlanets3D
            onSelectPlanet={(name) => {
              setSelectedPlanetName(name);
              setViewMode('earth');
            }}
            selectedPlanetName={selectedPlanetName}
            isSolarMode={viewMode === 'solarsystem'}
            planetPositionsRef={planetPositionsRef}
          />

          {/* 3D Comets with Solar Dust/Ion Tails (Halley's Comet, NEOWISE) */}
          <Comets3D isSolarMode={viewMode === 'solarsystem'} planetPositionsRef={planetPositionsRef} />

          {/* 3D Trans-Neptunian Kuiper Belt & Outer Oort Cloud Shell */}
          <KuiperBelt3D isSolarMode={viewMode === 'solarsystem'} />
          <OortCloud3D isSolarMode={viewMode === 'solarsystem'} />

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
                onSelect={(n) => {
                  setSelectedPlanetName(null);
                  onSelectNode(n);
                }}
              />
            );
          })}

        </Suspense>
      </Canvas>

      {/* MOBILE-ONLY SIDE FLOATING FAB & EXPANDABLE VERTICAL MENU */}
      <div className="sm:hidden absolute top-20 left-4 z-40 pointer-events-auto flex flex-col items-start gap-2">
        {/* Toggle FAB Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#050d1d]/95 border border-cyan-500/50 shadow-[0_0_20px_rgba(56,189,248,0.4)] text-xs font-semibold text-cyan-300 backdrop-blur-xl cursor-pointer transition-all active:scale-95"
        >
          <span className="text-base">{isMobileMenuOpen ? '✕' : '🪐'}</span>
          <span>{isMobileMenuOpen ? 'Close Menu' : (selectedPlanetName || (viewMode === 'earth' ? 'Earth' : 'Solar System'))}</span>
          <span className="text-[10px] text-cyan-400">▼</span>
        </button>

        {/* Expandable Collapsible Side Drawer */}
        {isMobileMenuOpen && (
          <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl bg-[#030914]/95 border border-slate-700/80 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-xs max-h-[60vh] overflow-y-auto no-scrollbar w-44 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-2 py-1 border-b border-slate-800 flex items-center justify-between">
              <span>Explore Views</span>
            </div>

            <button
              onClick={() => {
                setSelectedPlanetName(null);
                setViewMode('earth');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                viewMode === 'earth' && !selectedPlanetName
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(56,189,248,0.8)]'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>🌍</span>
              <span>Earth View</span>
            </button>

            <button
              onClick={() => {
                setSelectedPlanetName(null);
                setViewMode('solarsystem');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer text-left ${
                viewMode === 'solarsystem' && !selectedPlanetName
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>🪐</span>
              <span>Solar System</span>
            </button>

            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-2 pt-2 pb-1 border-t border-slate-800">
              Select Planet
            </div>

            {(['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] as const).map((pName) => {
              const isCurrent = selectedPlanetName === pName;
              return (
                <button
                  key={pName}
                  onClick={() => {
                    setSelectedPlanetName(pName);
                    setViewMode('earth');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                    isCurrent
                      ? pName === 'Sun'
                        ? 'bg-amber-400 text-black font-bold shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                        : 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.9)]'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-amber-300'
                  }`}
                >
                  <span>
                    {pName === 'Sun' && '☀️'}
                    {pName === 'Mercury' && '☿'}
                    {pName === 'Venus' && '♀'}
                    {pName === 'Mars' && '♂'}
                    {pName === 'Jupiter' && '♃'}
                    {pName === 'Saturn' && '♄'}
                    {pName === 'Uranus' && '♅'}
                    {pName === 'Neptune' && '♆'}
                  </span>
                  <span>{pName}</span>
                </button>
              );
            })}

            <div className="pt-1 border-t border-slate-800">
              <button
                onClick={() => {
                  const event = new CustomEvent('toggle-ai-assistant');
                  window.dispatchEvent(event);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Ask Intelligence</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE & DESKTOP CATEGORIZED FLOATING NAVIGATION HUD */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-2 max-w-[95vw]">
        {/* Active Category Dropdown Drawer (visible when user opens Planets, Moons, Dwarf Planets, or Comets menu) */}
        {activeMenuTab === 'planets' && (
          <div className="flex flex-wrap items-center justify-center gap-2 p-3 rounded-2xl bg-[#030914]/95 border border-cyan-500/50 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-xs max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-full text-[10px] uppercase font-bold tracking-widest text-cyan-400 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>🪐 8 Solar Planets</span>
              <button onClick={() => setActiveMenuTab(null)} className="text-slate-400 hover:text-white px-1 font-mono">✕ Close</button>
            </div>
            {[
              { name: 'Mercury', symbol: '☿', color: 'from-amber-600 to-yellow-500' },
              { name: 'Venus', symbol: '♀', color: 'from-orange-500 to-amber-400' },
              { name: 'Earth', symbol: '🌍', color: 'from-blue-600 to-cyan-400' },
              { name: 'Mars', symbol: '♂', color: 'from-red-600 to-rose-400' },
              { name: 'Jupiter', symbol: '♃', color: 'from-amber-700 to-orange-400' },
              { name: 'Saturn', symbol: '♄', color: 'from-yellow-600 to-amber-300' },
              { name: 'Uranus', symbol: '♅', color: 'from-cyan-600 to-teal-300' },
              { name: 'Neptune', symbol: '♆', color: 'from-blue-700 to-indigo-400' },
            ].map((p) => {
              const isCurrent = selectedPlanetName === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    setSelectedPlanetName(p.name);
                    setViewMode('earth');
                    setActiveMenuTab(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.9)] scale-105'
                      : 'bg-slate-900/90 text-slate-200 hover:bg-cyan-950 hover:text-cyan-300 border-slate-700/60'
                  }`}
                >
                  <span className="text-sm">{p.symbol}</span>
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeMenuTab === 'moons' && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#030914]/95 border border-cyan-500/50 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-xs max-w-2xl max-h-[45vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-full text-[10px] uppercase font-bold tracking-widest text-cyan-400 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>🌙 Major Moons Selection</span>
              <button onClick={() => setActiveMenuTab(null)} className="text-slate-400 hover:text-white px-1 font-mono">✕ Close</button>
            </div>

            {/* Moons grouped by planet */}
            {[
              { planet: 'Earth 🌍', moons: ['The Moon (Luna)'] },
              { planet: 'Mars ♂', moons: ['Phobos', 'Deimos'] },
              { planet: 'Jupiter ♃', moons: ['Ganymede', 'Callisto', 'Io', 'Europa', 'Amalthea'] },
              { planet: 'Saturn ♄', moons: ['Titan', 'Rhea', 'Iapetus', 'Dione', 'Tethys', 'Enceladus', 'Mimas', 'Hyperion'] },
              { planet: 'Uranus ♅', moons: ['Titania', 'Oberon', 'Ariel', 'Umbriel', 'Miranda'] },
              { planet: 'Neptune ♆', moons: ['Triton', 'Nereid', 'Proteus'] },
            ].map((group) => (
              <div key={group.planet} className="w-full flex items-center gap-1 py-1 border-b border-slate-800/60 last:border-0">
                <span className="text-[10px] font-semibold text-slate-400 min-w-[70px] shrink-0">{group.planet}:</span>
                <div className="flex flex-wrap items-center gap-1">
                  {group.moons.map((mName) => (
                    <button
                      key={mName}
                      onClick={() => {
                        setSelectedPlanetName(mName);
                        setViewMode('earth');
                        setActiveMenuTab(null);
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                        selectedPlanetName === mName
                          ? 'bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(56,189,248,0.9)]'
                          : 'bg-slate-800/80 text-slate-200 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/50 border border-slate-700/50'
                      }`}
                    >
                      {mName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMenuTab === 'dwarfs' && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#030914]/95 border border-cyan-500/50 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-xs max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-full text-[10px] uppercase font-bold tracking-widest text-cyan-400 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>🔵 Dwarf Planets</span>
              <button onClick={() => setActiveMenuTab(null)} className="text-slate-400 hover:text-white px-1 font-mono">✕ Close</button>
            </div>
            {['Pluto', 'Ceres', 'Eris', 'Haumea', 'Makemake'].map((dName) => (
              <button
                key={dName}
                onClick={() => {
                  setSelectedPlanetName(dName);
                  setViewMode('earth');
                  setActiveMenuTab(null);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  selectedPlanetName === dName
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.9)] scale-105'
                    : 'bg-slate-800/80 text-slate-200 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/50'
                }`}
              >
                🔵 {dName}
              </button>
            ))}
          </div>
        )}

        {activeMenuTab === 'comets' && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 rounded-2xl bg-[#030914]/95 border border-cyan-500/50 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-xs max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-full text-[10px] uppercase font-bold tracking-widest text-cyan-400 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>☄️ Comets</span>
              <button onClick={() => setActiveMenuTab(null)} className="text-slate-400 hover:text-white px-1 font-mono">✕ Close</button>
            </div>
            {["Halley's Comet (1P/Halley)", 'Comet NEOWISE (C/2020 F3)'].map((cName) => (
              <button
                key={cName}
                onClick={() => {
                  setSelectedPlanetName(cName);
                  setViewMode('solarsystem');
                  setActiveMenuTab(null);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  selectedPlanetName === cName
                    ? 'bg-sky-400 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.9)] scale-105'
                    : 'bg-slate-800/80 text-slate-200 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/50'
                }`}
              >
                ☄️ {cName}
              </button>
            ))}
          </div>
        )}

        {/* MAIN CATEGORY NAVIGATION BAR */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#050d1d]/95 backdrop-blur-md border border-slate-700/80 shadow-[0_10px_35px_rgba(0,0,0,0.85)] text-xs flex-wrap justify-center">
          {/* Solar Overview Button */}
          <button
            onClick={() => {
              setSelectedPlanetName(null);
              setViewMode('solarsystem');
              setActiveMenuTab(null);
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              viewMode === 'solarsystem' && !selectedPlanetName
                ? 'bg-amber-400 text-black shadow-[0_0_16px_rgba(251,191,36,0.8)] scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            🪐 Solar Overview
          </button>

          {/* Star Sun Button */}
          <button
            onClick={() => {
              setSelectedPlanetName('Sun');
              setViewMode('earth');
              setActiveMenuTab(null);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              selectedPlanetName === 'Sun'
                ? 'bg-amber-400 text-black font-bold shadow-[0_0_14px_rgba(251,191,36,0.95)] scale-105'
                : 'text-amber-300 hover:bg-amber-950/50'
            }`}
          >
            ☀️ Sun
          </button>

          {/* 8 Planets Category Menu Toggle */}
          <button
            onClick={() => setActiveMenuTab(activeMenuTab === 'planets' ? null : 'planets')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
              activeMenuTab === 'planets'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_14px_rgba(56,189,248,0.8)]'
                : 'bg-slate-800/60 text-slate-300 hover:text-cyan-300 border-slate-700/60'
            }`}
          >
            <span>🪐 Planets</span>
            <span className="text-[9px]">▼</span>
          </button>

          {/* Moons Category Menu Toggle */}
          <button
            onClick={() => setActiveMenuTab(activeMenuTab === 'moons' ? null : 'moons')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
              activeMenuTab === 'moons'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_14px_rgba(56,189,248,0.8)]'
                : 'bg-slate-800/60 text-slate-300 hover:text-cyan-300 border-slate-700/60'
            }`}
          >
            <span>🌙 Moons</span>
            <span className="text-[9px]">▼</span>
          </button>

          {/* Dwarf Planets Category Menu Toggle */}
          <button
            onClick={() => setActiveMenuTab(activeMenuTab === 'dwarfs' ? null : 'dwarfs')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
              activeMenuTab === 'dwarfs'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_14px_rgba(56,189,248,0.8)]'
                : 'bg-slate-800/60 text-slate-300 hover:text-cyan-300 border-slate-700/60'
            }`}
          >
            <span>🔵 Dwarf Planets</span>
            <span className="text-[9px]">▼</span>
          </button>

          {/* Comets Category Menu Toggle */}
          <button
            onClick={() => setActiveMenuTab(activeMenuTab === 'comets' ? null : 'comets')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
              activeMenuTab === 'comets'
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_14px_rgba(56,189,248,0.8)]'
                : 'bg-slate-800/60 text-slate-300 hover:text-cyan-300 border-slate-700/60'
            }`}
          >
            <span>☄️ Comets</span>
            <span className="text-[9px]">▼</span>
          </button>

          {selectedPlanetName && (
            <button
              onClick={() => {
                setSelectedPlanetName(null);
                setViewMode('solarsystem');
                setActiveMenuTab(null);
              }}
              className="text-slate-400 hover:text-rose-400 ml-1 text-xs font-bold cursor-pointer transition-colors px-2 py-0.5 rounded-full bg-slate-800/60"
              title="Return to Solar Overview"
            >
              ✕ Close Target
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

