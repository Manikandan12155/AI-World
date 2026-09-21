import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

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
    color: '#38bdf8',
    tailLength: 12.0,
    incline: 0.35,
  },
  {
    name: 'Comet NEOWISE (C/2020 F3)',
    perihelion: 22.0,
    aphelion: 140.0,
    speed: 0.03,
    color: '#e0f2fe',
    tailLength: 15.0,
    incline: -0.45,
  }
];

// Single Comet with Dynamic Solar Tail Cone pointing AWAY from SUN_POS
const SingleCometMesh: React.FC<{
  comet: CometData;
  isSolarMode: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number }>>;
}> = ({ comet, isSolarMode, planetPositionsRef }) => {
  const cometGroupRef = useRef<THREE.Group>(null);
  const tailMeshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef<number>(Math.random() * Math.PI * 2);

  // Dynamic Ion & Dust Tail Cone Shader
  const tailShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(comet.color) },
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

        void main() {
          float alpha = pow(vUv.y, 2.2) * 0.75;
          vec3 tailGlow = mix(vec3(1.0, 1.0, 1.0), uColor, 1.0 - vUv.y);
          gl_FragColor = vec4(tailGlow, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [comet.color]);

  useFrame((_, delta) => {
    angleRef.current += delta * comet.speed;
    const theta = angleRef.current;

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
        tailMeshRef.current.rotateX(Math.PI / 2);
      }
    }
  });

  if (!isSolarMode) return null;

  return (
    <group ref={cometGroupRef}>
      {/* 1. Nucleus 3D Icy Rock Core */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
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
      <mesh ref={tailMeshRef} position={[0, 0, 0]}>
        <coneGeometry args={[0.8, comet.tailLength, 32, 1, true]} />
        <primitive object={tailShaderMaterial} attach="material" />
      </mesh>

      {/* Floating 3D Label Tag */}
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
    </group>
  );
};

export const Comets3D: React.FC<{
  isSolarMode?: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number }>>;
}> = ({ isSolarMode = false, planetPositionsRef }) => {
  return (
    <group>
      {COMETS.map((c) => (
        <SingleCometMesh key={c.name} comet={c} isSolarMode={isSolarMode} planetPositionsRef={planetPositionsRef} />
      ))}
    </group>
  );
};
