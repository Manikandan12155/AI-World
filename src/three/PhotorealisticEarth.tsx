import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getAssetUrl } from '../utils/assetPath';

// Standard Sun 3D coordinate in deep space matching the lens flare
export const EARTH_SUN_POSITION = new THREE.Vector3(26, 14, 14);

import { PlanetMoons3DGroup } from './PlanetMoons3DGroup';

export const PhotorealisticEarth: React.FC<{
  isFocused?: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number }>>;
}> = ({ isFocused = true, planetPositionsRef }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Load user-specified high-resolution Daytime and Night time textures
  const [dayTexture, nightTexture] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Daytime.png'),
    getAssetUrl('/textures/Night time.png')
  ]);

  // Configure high-clarity color space
  useMemo(() => {
    if (dayTexture) dayTexture.colorSpace = THREE.SRGBColorSpace;
    if (nightTexture) nightTexture.colorSpace = THREE.SRGBColorSpace;
  }, [dayTexture, nightTexture]);

  // Photorealistic Day/Night Transition Shader blending Daytime.png and Night time.png
  const earthShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        sunPosition: { value: EARTH_SUN_POSITION },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Sunlight incidence angle
          float NdotL = dot(normal, sunDir);

          // Smooth transition factor between night and day (-0.16 night, +0.20 day)
          float dayFactor = smoothstep(-0.16, 0.20, NdotL);

          // Sample user textures
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Direct day illumination modulation (gentle daylight shading)
          float dayLighting = clamp(NdotL * 0.45 + 0.65, 0.55, 1.05);
          vec3 daySide = dayColor.rgb * dayLighting;

          // Night side texture with glowing cities
          vec3 nightSide = nightColor.rgb;

          // Natural twilight sunset/sunrise glow along the terminator
          float twilight = clamp(1.0 - abs(NdotL) * 3.5, 0.0, 1.0);
          vec3 sunsetGlow = vec3(0.95, 0.45, 0.12) * twilight * 0.28 * (1.0 - dayFactor * 0.5);

          // Atmospheric Fresnel limb haze
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.2);
          vec3 atmoHaze = mix(vec3(0.04, 0.15, 0.35), vec3(0.18, 0.55, 0.95), dayFactor) * fresnel * 0.35;

          // Seamless Day/Night blend
          vec3 finalColor = mix(nightSide, daySide, dayFactor) + sunsetGlow + atmoHaze;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [dayTexture, nightTexture]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.035;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group position={[0.4, 0.05, 0]}>
      {/* 1. Main Realistic Earth Sphere with Day & Night Shading */}
      <mesh ref={earthRef} material={earthShaderMaterial}>
        <sphereGeometry args={[2.42, 64, 64]} />
      </mesh>

      {/* 2. Soft Cyan Atmospheric Outer Corona */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.58, 48, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Deep Space Outer Aura */}
      <mesh>
        <sphereGeometry args={[2.82, 32, 32]} />
        <meshBasicMaterial
          color="#0284c7"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Earth's Moon (Luna) Orbit Group */}
      <PlanetMoons3DGroup planetName="Earth" isFocused={isFocused} planetPositionsRef={planetPositionsRef} />

      {/* 5. Exact Center Slogan: "Mani Tech UNIVERSE" */}
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
