import React, { useRef, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAssetUrl } from '../utils/assetPath';

// Photorealistic Hair-like Solar Flare Prominences & Wispy Ray Filaments (Matching Reference Image 1:1)
const SolarHairFlamesProminences: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const flareCount = 60; // 60 fine hair-like solar flame tendrils sprouting around Sun limb

  // Generate hair-like organic curved filament lines radiating outward from Sun limb
  const hairFilaments = useMemo(() => {
    const filaments: THREE.Line[] = [];
    const sunRadius = 4.5;

    for (let i = 0; i < flareCount; i++) {
      const angle = (i / flareCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8; // Spread across equator & poles

      const dirX = Math.cos(angle) * Math.cos(phi);
      const dirY = Math.sin(angle) * Math.cos(phi);
      const dirZ = Math.sin(phi);

      const basePos = new THREE.Vector3(dirX * sunRadius, dirY * sunRadius, dirZ * sunRadius);
      const normal = basePos.clone().normalize();

      // Create hair-like wavy curve extending into space
      const points: THREE.Vector3[] = [];
      const segments = 24;
      const height = 0.8 + Math.random() * 2.8; // Length of hair-like flame stream
      const curveFactor = (Math.random() - 0.5) * 1.4;

      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const dist = sunRadius + t * height;

        // Tangent deflection for hair-like curl/loop curvature
        const wave = Math.sin(t * Math.PI * 2.5 + i) * 0.25 * t;
        const sideOffset = new THREE.Vector3(-normal.y, normal.x, 0).multiplyScalar(wave + t * curveFactor * 0.6);

        const p = normal.clone().multiplyScalar(dist).add(sideOffset);
        points.push(p);
      }

      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(i % 3 === 0 ? '#ffea70' : i % 2 === 0 ? '#ff7700' : '#ff3300'),
        transparent: true,
        opacity: 0.65 + Math.random() * 0.3,
        blending: THREE.AdditiveBlending,
      });

      filaments.push(new THREE.Line(geo, mat));
    }

    return filaments;
  }, [flareCount]);

  // Animate wispy hair-like flame movement & slow solar rotation
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
      groupRef.current.rotation.z = Math.sin(time * 0.4) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {hairFilaments.map((line, idx) => (
        <primitive key={idx} object={line} />
      ))}
    </group>
  );
};

// Dynamic 3D Solar Fire Plasma Sparks Emitter (Radiating soft glowing fire sparks & embers from Sun surface)
const SolarFireSparksEmitter: React.FC<{ sparkTexture?: THREE.Texture }> = ({ sparkTexture }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 220;

  // Generate initial positions, directions, speeds and sizes for 220 kutty fire sparks
  const [positions, initialDirections, speeds] = useMemo(() => {
    const posArr = new Float32Array(particleCount * 3);
    const dirs: THREE.Vector3[] = [];
    const spds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      const dirX = Math.sin(phi) * Math.cos(theta);
      const dirY = Math.sin(phi) * Math.sin(theta);
      const dirZ = Math.cos(phi);

      const dirVec = new THREE.Vector3(dirX, dirY, dirZ).normalize();
      dirs.push(dirVec);

      const dist = 4.52 + Math.random() * 2.2;
      posArr[i * 3] = dirVec.x * dist;
      posArr[i * 3 + 1] = dirVec.y * dist;
      posArr[i * 3 + 2] = dirVec.z * dist;

      spds.push(0.018 + Math.random() * 0.042);
    }

    return [posArr, dirs, spds];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < particleCount; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      const dir = initialDirections[i];
      const speed = speeds[i];

      x += dir.x * speed * (delta * 60);
      y += dir.y * speed * (delta * 60);
      z += dir.z * speed * (delta * 60);

      const currentDist = Math.sqrt(x * x + y * y + z * z);

      if (currentDist > 7.8) {
        const newDist = 4.52 + Math.random() * 0.2;
        x = dir.x * newDist;
        y = dir.y * newDist;
        z = dir.z * newDist;
      }

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.45}
        map={sparkTexture}
        color="#ffaa00"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const CinematicSpaceBackdrop: React.FC = () => {
  const skysphereRef = useRef<THREE.Mesh>(null);
  const starfieldRef = useRef<THREE.Points>(null);
  const moonRef = useRef<THREE.Group>(null);
  const sunMeshRef = useRef<THREE.Group>(null);

  // Load 360-degree Equirectangular Cosmic Texture, Photorealistic Sun Surface & Soft Solar Spark Texture
  const [spaceTexture, sunSurfaceTexture, sparkTexture] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/milkyway_equirectangular_360.jpg'),
    getAssetUrl('/textures/sun_photorealistic.jpg'),
    getAssetUrl('/textures/solar_spark.jpg'),
  ]);

  useMemo(() => {
    if (sunSurfaceTexture) {
      sunSurfaceTexture.colorSpace = THREE.SRGBColorSpace;
      sunSurfaceTexture.wrapS = THREE.RepeatWrapping;
      sunSurfaceTexture.wrapT = THREE.RepeatWrapping;
    }
    if (sparkTexture) {
      sparkTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [sunSurfaceTexture, sparkTexture]);

  // Orbit, Sun spin & Camera-following infinite Skybox animations
  useFrame(({ clock, camera }, delta) => {
    const time = clock.getElapsedTime();

    if (skysphereRef.current) {
      skysphereRef.current.position.copy(camera.position);
    }
    if (starfieldRef.current) {
      starfieldRef.current.position.copy(camera.position);
    }

    // Sun axis spin animation
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.04;
    }

    // Moon orbit around Earth
    if (moonRef.current) {
      const t = time * 0.12;
      moonRef.current.position.x = 0.4 + Math.cos(t) * 6.2;
      moonRef.current.position.z = Math.sin(t) * 5.8;
      moonRef.current.position.y = 0.05 + Math.sin(t * 1.3) * 1.4;
      moonRef.current.rotation.y += delta * 0.05;
    }
  });

  // Sun 3D position placed in upper-right deep space matching user's visible sun location
  const sunPosition: [number, number, number] = [26, 14, 14];

  return (
    <group>
      {/* 1. Zoomed-out 360-degree Celestial Sky-Sphere */}
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
      <points ref={starfieldRef}>
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

      {/* 3. THE PHOTOREALISTIC SUN (Sphere Surface + Hair-like Solar Flame Filaments 1:1 + Emitting Fire Sparks) */}
      <group position={sunPosition}>
        {/* 3D Photorealistic Fiery Sun Ball Mesh */}
        <group ref={sunMeshRef}>
          <mesh>
            <sphereGeometry args={[4.5, 64, 64]} />
            <meshBasicMaterial
              map={sunSurfaceTexture}
              color="#ffe082"
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* 1:1 Hair-like Wispy Solar Flame Prominences & Ray Filaments */}
        <SolarHairFlamesProminences />

        {/* Kutty Kutty Erupting Fire Sparks & Embers Radiating Outward into Space */}
        <SolarFireSparksEmitter sparkTexture={sparkTexture} />

        {/* High-power radiating solar light illuminating planets from deep space */}
        <pointLight color="#fff7e6" intensity={8.0} distance={280} decay={0.3} />
      </group>

      {/* 4. Powerful Direct Sunlight shining directly from the Sun */}
      <directionalLight
        position={sunPosition}
        intensity={5.2}
        color="#fffcf2"
      />

      {/* 5. Cosmic ambient fill */}
      <ambientLight intensity={0.4} color="#0f1b2e" />

      {/* 6. Subtle night-side rim starlight */}
      <directionalLight
        position={[-sunPosition[0], -sunPosition[1] * 0.5, -sunPosition[2]]}
        intensity={0.35}
        color="#38bdf8"
      />
    </group>
  );
};



