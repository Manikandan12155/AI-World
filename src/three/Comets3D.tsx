import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getAssetUrl } from '../utils/assetPath';

const SUN_POS = new THREE.Vector3(26, 14, 14);

interface CometData {
  name: string;
  perihelion: number; // closest distance to Sun
  aphelion: number;   // farthest distance from Sun
  speed: number;
  color: string;
  tailLength: number;
  incline: number;
}

const COMETS: CometData[] = [
  {
    name: "Halley's Comet (1P/Halley)",
    perihelion: 18.0,
    aphelion: 125.0,
    speed: 0.04,
    color: '#ff4d00', // Fiery orange/red like ☄️
    tailLength: 12.0,
    incline: 0.35,
  },
  {
    name: 'Comet NEOWISE (C/2020 F3)',
    perihelion: 22.0,
    aphelion: 140.0,
    speed: 0.03,
    color: '#ff7700', // Fiery bright orange
    tailLength: 15.0,
    incline: -0.45,
  }
];

// Single Comet with Dynamic Solar Tail Cone pointing AWAY from SUN_POS
const SingleCometMesh: React.FC<{
  comet: CometData;
  isSolarMode: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number }>>;
  showNames?: boolean;
}> = ({ comet, isSolarMode, planetPositionsRef, showNames = true }) => {
  const cometGroupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const tailMeshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef<number>(Math.random() * Math.PI * 2);

  // Load realistic rock texture for the comet nucleus
  const cometTexture = useLoader(THREE.TextureLoader, getAssetUrl('textures/Astroids 1.png'));
  
  useMemo(() => {
    if (cometTexture) {
      cometTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [cometTexture]);

  // Dynamic Ion & Dust Tail Cone Shader
  const tailShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(comet.color) },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        uniform float uTime;

        // Simple pseudo-random noise for flame flickering
        float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          float t = uTime * 4.0;
          
          // Animate UVs backwards for the flame flow
          vec2 flameUv = vec2(vUv.x * 3.0, vUv.y - t);
          float n = noise(floor(flameUv * 8.0)) * 0.5 + 0.5;

          // Stronger alpha at the base (y=1 for the cone base) fading to the tip (y=0)
          // Actually vUv.y goes from 0 to 1 along the cone height. Let's assume vUv.y=1 is base and 0 is tip.
          float baseGlow = pow(vUv.y, 1.8);
          float flamePulse = n * 0.4 * baseGlow;
          float alpha = (baseGlow * 0.8 + flamePulse);

          vec3 fieryCore = vec3(1.0, 0.9, 0.4); // Bright yellow-white core
          vec3 flameTip = uColor * 0.6;         // Darker fiery color at tip
          
          vec3 finalColor = mix(flameTip, fieryCore, vUv.y);
          finalColor += vec3(n * 0.15); // Add subtle noise spark to color

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [comet.color]);

  useFrame((_, delta) => {
    if (tailShaderMaterial) {
      tailShaderMaterial.uniforms.uTime.value += delta;
    }

    angleRef.current += delta * comet.speed;
    const theta = angleRef.current;

    if (nucleusRef.current) {
      // Add slight tumbling rotation to the realistic comet rock
      nucleusRef.current.rotation.x += delta * 1.2;
      nucleusRef.current.rotation.y += delta * 1.15;
    }

    const a = (comet.perihelion + comet.aphelion) / 2;
    const e = (comet.aphelion - comet.perihelion) / (comet.aphelion + comet.perihelion);
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));

    const x = SUN_POS.x + Math.cos(theta) * r;
    const z = SUN_POS.z + Math.sin(theta) * r;
    const y = SUN_POS.y + Math.sin(theta * 1.5) * comet.incline * r * 0.15;

    if (cometGroupRef.current) {
      cometGroupRef.current.position.set(x, y, z);

      if (planetPositionsRef) {
        planetPositionsRef.current[comet.name] = {
          pos: cometGroupRef.current.position.clone(),
          viewDist: 6.0,
        };
      }

      const awayFromSunDir = new THREE.Vector3(x, y, z).sub(SUN_POS).normalize();

      if (tailMeshRef.current) {
        const targetPos = new THREE.Vector3(x, y, z).add(awayFromSunDir);
        tailMeshRef.current.lookAt(targetPos);
        tailMeshRef.current.rotateX(-Math.PI / 2); // Points +Y towards -Z (away from sun)
      }
    }
  });

  if (!isSolarMode) return null;

  return (
    <group ref={cometGroupRef}>
      {/* 1. Nucleus 3D Icy Rock Core (Realistic irregular shape + asteroid texture) */}
      <mesh ref={nucleusRef}>
        <icosahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial map={cometTexture} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Cometary Bright Gas Halo (Coma) */}
      <mesh scale={1.8}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color={comet.color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Dynamic Ion / Dust Tail Cone pointing away from Sun */}
      <group ref={tailMeshRef as React.Ref<THREE.Group>} position={[0, 0, 0]}>
        <mesh position={[0, comet.tailLength / 2, 0]}>
          <coneGeometry args={[0.8, comet.tailLength, 32, 1, true]} />
          <primitive object={tailShaderMaterial} attach="material" />
        </mesh>
      </group>

      {/* Floating 3D Label Tag */}
      {showNames && (
        <Html
          position={[0, 0.6, 0]}
          center
          distanceFactor={38}
          className="pointer-events-none select-none whitespace-nowrap"
        >
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_10px_rgba(56,189,248,0.6)] text-[8px] text-cyan-200 font-semibold font-['Space_Grotesk']">
            <span>☄️</span>
            <span>{comet.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

export const Comets3D: React.FC<{
  isSolarMode?: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number }>>;
  showNames?: boolean;
}> = ({ isSolarMode = false, planetPositionsRef, showNames = true }) => {
  return (
    <group>
      {COMETS.map((c) => (
        <SingleCometMesh key={c.name} comet={c} isSolarMode={isSolarMode} planetPositionsRef={planetPositionsRef} showNames={showNames} />
      ))}
    </group>
  );
};
