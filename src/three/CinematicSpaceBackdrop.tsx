import React, { useRef, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { getAssetUrl } from '../utils/assetPath';

// Smooth, High-Quality Photorealistic Sun Corona (No noisy artifacts)
const SmoothSunCorona: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ camera }) => {
    if (meshRef.current) {
      // Perfect billboarding in world space
      meshRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[28, 28]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false} // Prevents any weird clipping lines
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;

void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // Sun radius in UV space
    float sunRadius = 4.5 / 28.0; // ~0.1607

    // Start the glow just outside the actual Sun.
    float edge = smoothstep(
        sunRadius - 0.005,
        sunRadius + 0.008,
        dist
    );

    // Smooth falloff from Sun edge to outer space.
    // Never creates a hard circular cutoff.
    float glowDistance = clamp(
        (dist - sunRadius) / (0.5 - sunRadius),
        0.0,
        1.0
    );

    // Very smooth falloff.
    float glow = 1.0 - smoothstep(0.0, 1.0, glowDistance);

    // Different glow strengths
    float coreGlow = pow(glow, 45.0) * 0.5;
    float midGlow   = pow(glow, 10.0) * 0.6;
    float outerGlow = pow(glow, 1.2) * 0.5;

    // Colors
    vec3 coreColor  = vec3(1.0, 0.92, 0.65);
    vec3 midColor   = vec3(1.0, 0.25, 0.02);
    vec3 outerColor = vec3(1.0, 0.25, 0.02);

    // Combine glow
    vec3 finalColor =
        midColor  * midGlow +
        outerColor * outerGlow;

    // Smooth alpha.
    // Edge prevents the glow from appearing inside the Sun.
    float alpha =
        (coreGlow + midGlow + outerGlow) *
        edge;

    // Make the very outer area completely transparent.
    alpha *= smoothstep(0.5, 0.32, dist);

    // Prevent tiny transparent fragments from producing a visible layer.
    if (alpha < 0.002) {
        discard;
    }

    gl_FragColor = vec4(finalColor, alpha);
}
        `}
      />
    </mesh>
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
      skysphereRef.current.rotation.y += delta * 0.005; // Slow rotation for dynamic real-space feel
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

      {/* Realistic 3D Parallax Stars from drei */}
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />

      {/* 3. THE PHOTOREALISTIC SUN (Sphere Surface + Hair-like Solar Flame Filaments 1:1 + Emitting Fire Sparks) */}
      <group position={sunPosition}>

        {/* 3D Photorealistic Fiery Sun Ball Mesh */}
        <group ref={sunMeshRef}>
          <mesh>
            <sphereGeometry args={[4.5, 64, 64]} />
            <meshBasicMaterial
              map={sunSurfaceTexture}
              color="#fff5cc"
              toneMapped={false}
            />
          </mesh>

          {/* Inner atmospheric intense glow hugging the sun */}
          <mesh>
            <sphereGeometry args={[4.65, 64, 64]} />
            <meshBasicMaterial
              color="#ff8800"
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Smooth, elegant glowing halo around the sun */}
        <SmoothSunCorona />

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



