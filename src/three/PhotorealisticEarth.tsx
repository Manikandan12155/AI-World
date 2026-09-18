import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export const PhotorealisticEarth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const lightsMeshRef = useRef<THREE.Mesh>(null);

  // Load official NASA photorealistic Earth textures
  const [diffuseMap, lightsMap, cloudsMap, specularMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth_diffuse.jpg',
    '/textures/earth_lights.png',
    '/textures/earth_clouds.jpg',
    '/textures/earth_specular.jpg'
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.035;
    }
    if (lightsMeshRef.current) {
      lightsMeshRef.current.rotation.y += delta * 0.035;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.045;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group position={[0.4, 0.05, 0]}>
      {/* 1. Main Realistic Earth Sphere with Specular Oceans & Diffuse Continents */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.42, 64, 64]} />
        <meshStandardMaterial
          map={diffuseMap}
          roughnessMap={specularMap}
          roughness={0.35}
          metalness={0.1}
          color="#ffffff"
        />
      </mesh>


      {/* 2. City Night Lights Layer (Glowing Warm Amber on dark side) */}
      <mesh ref={lightsMeshRef}>
        <sphereGeometry args={[2.425, 64, 64]} />
        <meshBasicMaterial
          map={lightsMap}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.85}
          color="#ffdd77"
        />
      </mesh>

      {/* 3. Volumetric Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.44, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          color="#dbeafe"
        />
      </mesh>

      {/* 4. Glowing Blue Atmospheric Corona Halo */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.68, 48, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Deep Space Outer Aura */}
      <mesh>
        <sphereGeometry args={[2.95, 32, 32]} />
        <meshBasicMaterial
          color="#1e3a8a"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 6. Exact Center Slogan: "Mani Tech UNIVERSE" */}
      <Html
        position={[0, 0.45, 2.65]}
        center
        distanceFactor={6.5}
        className="pointer-events-none select-none z-10"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[12px] tracking-[0.55em] text-cyan-200 font-medium uppercase drop-shadow-[0_0_15px_rgba(56,189,248,0.9)]">
            Mani Tech
          </span>
          <span className="text-lg md:text-xl tracking-[0.65em] text-white font-extrabold uppercase drop-shadow-[0_0_24px_rgba(56,189,248,1)] mt-1 whitespace-nowrap pl-1">
            UNIVERSE
          </span>
        </div>
      </Html>
    </group>
  );
};
