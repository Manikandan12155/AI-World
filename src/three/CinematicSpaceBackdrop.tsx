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
  const milkyWayMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // Load Photorealistic Sun Surface & Soft Solar Spark Texture
  const [sunSurfaceTexture, sparkTexture] = useLoader(THREE.TextureLoader, [
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

    if (milkyWayMaterialRef.current) {
      milkyWayMaterialRef.current.uniforms.uTime.value = time;
    }
  });

  // Sun 3D position placed in upper-right deep space matching user's visible sun location
  const sunPosition: [number, number, number] = [26, 14, 14];

  return (
    <group>
      {/* 1. Deep Void Sky-Sphere (Replaces the flat banner texture) */}
      <mesh ref={skysphereRef} rotation={[0, 0, 0]}>
        <sphereGeometry args={[160, 64, 64]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          vertexShader={`
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPosition.xyz;
              gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
          `}
          fragmentShader={`
            varying vec3 vWorldPosition;
            void main() {
              vec3 dir = normalize(vWorldPosition);
              // Create a very subtle deep space color gradient
              vec3 color = mix(vec3(0.002, 0.005, 0.015), vec3(0.001, 0.002, 0.005), abs(dir.y));
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* 2. REAL 3D Volumetric Milky Way Band (Procedural Particles - Far Background) */}
      <points ref={starfieldRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 25000 }, () => {
                  // Generate a galactic disk far outside the solar system
                  // Base radius starts at 400 and goes up to 1200
                  const r = 400 + Math.pow(Math.random(), 1.8) * 800; 
                  
                  // Limit the Milky Way to one side (the galactic center view)
                  // theta spans from -Math.PI * 0.8 to +Math.PI * 0.8 (an arc on one side)
                  const theta = (Math.random() - 0.5) * Math.PI * 1.5; 
                  
                  // Thickness of the disk
                  const thickness = Math.max(10, 150 - (r * 0.1)); 
                  const y = (Math.random() - 0.5) * (Math.random() * thickness);
                  
                  // Galactic tilt
                  const tilt = 0.5; // ~30 degrees
                  const x = r * Math.cos(theta);
                  const z = r * Math.sin(theta);
                  
                  // Apply tilt rotation around X axis
                  const tiltedY = y * Math.cos(tilt) - z * Math.sin(tilt);
                  const tiltedZ = y * Math.sin(tilt) + z * Math.cos(tilt);

                  return [x, tiltedY, tiltedZ];
                }).flat()
              ),
              3
            ]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[
              new Float32Array(
                Array.from({ length: 25000 }, () => {
                  // Mix colors for cosmic dust: deep blues, cyans, and faint purples
                  const rand = Math.random();
                  if (rand < 0.6) return [0.5, 0.8, 1.0]; // bright blue-white
                  if (rand < 0.85) return [0.2, 0.5, 0.9]; // deep blue
                  return [0.8, 0.5, 0.9]; // purple dust
                }).flat()
              ),
              3
            ]}
          />
          <bufferAttribute
            attach="attributes-sizeOffset"
            args={[
              new Float32Array(
                Array.from({ length: 25000 }, () => Math.random() * 100)
              ),
              1
            ]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={milkyWayMaterialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uPointSize: { value: 3.5 }
          }}
          vertexShader={`
            uniform float uTime;
            uniform float uPointSize;
            attribute vec3 color;
            attribute float sizeOffset;
            
            varying vec3 vColor;
            varying float vAlpha;
            
            void main() {
              vColor = color;
              
              // Twinkle effect: vary alpha based on time and random offset
              float twinkle = sin(uTime * (1.0 + mod(sizeOffset, 2.0)) + sizeOffset) * 0.5 + 0.5;
              vAlpha = mix(0.1, 0.8, twinkle);
              
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              
              // Base size with distance attenuation
              gl_PointSize = uPointSize * (200.0 / -mvPosition.z) * (0.5 + 0.5 * twinkle);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            varying float vAlpha;
            
            void main() {
              // Make particles soft circles instead of hard squares
              vec2 xy = gl_PointCoord.xy - vec2(0.5);
              float ll = length(xy);
              if (ll > 0.5) discard;
              
              // Soft glow falloff
              float glow = (0.5 - ll) * 2.0;
              gl_FragColor = vec4(vColor, vAlpha * glow);
            }
          `}
        />
      </points>

      {/* Realistic 3D Parallax Stars from drei (Ambient background stars) */}
      <Stars radius={300} depth={200} count={6000} factor={6} saturation={0.5} fade speed={1.2} />

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



