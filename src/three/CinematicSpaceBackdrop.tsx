import { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CinematicSpaceBackdrop: React.FC = () => {
  const skysphereRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Group>(null);

  // Load 360-degree Equirectangular Cosmic Texture (Full image + Seamless Opposite back image), Moon, and Flare
  const [spaceTexture, moonTexture, starburstTexture] = useLoader(THREE.TextureLoader, [
    '/textures/milkyway_equirectangular_360.jpg',
    '/textures/moon_1024.jpg',
    '/textures/sun_starburst_clean.png'
  ]);

  // Orbit animations
  useFrame(({ clock }, delta) => {

    // Moon orbit around Earth (realistic tilted elliptic orbit)
    if (moonRef.current) {
      const t = clock.getElapsedTime() * 0.12;
      // Moon orbit radius ~ 6.5 units around Earth
      moonRef.current.position.x = 0.4 + Math.cos(t) * 6.2;
      moonRef.current.position.z = Math.sin(t) * 5.8;
      moonRef.current.position.y = 0.05 + Math.sin(t * 1.3) * 1.4;
      moonRef.current.rotation.y += delta * 0.05;
    }
  });

  // Sun 3D position placed in upper-right deep space matching the user's visible sun location
  const sunPosition: [number, number, number] = [28, 16, 12];

  return (
    <group>
      {/* 1. Zoomed-out 360-degree Celestial Sky-Sphere (Full image front + Opposite image back) */}
      <mesh ref={skysphereRef} rotation={[0, -Math.PI * 0.5, 0]}>
        <sphereGeometry args={[140, 64, 64]} />
        <meshBasicMaterial
          map={spaceTexture}
          side={THREE.BackSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>


      {/* 2. Subtle 3D Depth Starfield layering inside the Milky Way sphere */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 750 }, () => [
                  (Math.random() - 0.5) * 75,
                  (Math.random() - 0.5) * 50,
                  (Math.random() - 0.5) * 75
                ]).flat()
              ),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#e0f2fe" transparent opacity={0.65} />
      </points>


      {/* 2. THE SUN (Pure Radiant Starburst Lens Flare matching User Reference Image - No Solid Ball) */}
      <group position={sunPosition}>
        {/* Primary Brilliant Golden Starburst Rays (Exact User Reference Image) */}
        <sprite scale={[22, 14, 1]}>
          <spriteMaterial
            map={starburstTexture}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.98}
            depthWrite={false}
          />
        </sprite>

        {/* Secondary Cross Shimmer Layer for rich multidirectional rays */}
        <sprite scale={[16, 10.5, 1]}>
          <spriteMaterial
            map={starburstTexture}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.7}
            rotation={Math.PI / 4}
            depthWrite={false}
          />
        </sprite>

        {/* Incandescent White-Hot Core Flare */}
        <sprite scale={[8, 8, 1]}>
          <spriteMaterial
            map={starburstTexture}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.95}
            color="#ffffff"
            depthWrite={false}
          />
        </sprite>

        {/* High-power radiating solar light illuminating Earth and Moon from deep space */}
        <pointLight color="#fff7e6" intensity={7} distance={250} decay={0.3} />
      </group>







      {/* 3. THE MOON (Realistic NASA Lunar Surface orbiting Earth) */}
      <group ref={moonRef} position={[4.8, 1.2, 1.8]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            map={moonTexture}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      </group>

      {/* 4. Powerful Direct Sunlight shining directly from the Sun onto Earth */}
      <directionalLight
        position={sunPosition}
        intensity={5.5}
        color="#ffffff"
      />

      {/* Subtle cosmic ambient fill */}
      <ambientLight intensity={0.25} color="#0f172a" />

      {/* Night-side subtle rim starlight */}
      <directionalLight
        position={[-sunPosition[0], -sunPosition[1] * 0.5, -sunPosition[2]]}
        intensity={0.4}
        color="#38bdf8"
      />
    </group>
  );
};



