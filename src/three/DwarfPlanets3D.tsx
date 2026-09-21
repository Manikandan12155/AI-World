import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { DWARF_PLANETS_DATA } from '../data/dwarfPlanetData';
import type { DwarfPlanetData } from '../data/dwarfPlanetData';
import type { PlanetViewInfo } from './SolarSystemPlanets';
import { getAssetUrl } from '../utils/assetPath';

// Sun position matching central solar system
const SUN_POS = new THREE.Vector3(26, 14, 14);

// Orthonormal orbital plane vectors
const U = new THREE.Vector3(-0.7896, -0.4303, -0.4318);
const V = new THREE.Vector3(0.5661, -0.2512, -0.7853);

interface DwarfPlanets3DProps {
  onSelectPlanet?: (name: string) => void;
  selectedPlanetName?: string | null;
  isSolarMode?: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, PlanetViewInfo>>;
}

// Single Dwarf Planet Mesh with Photorealistic Day/Night GLSL Shader & Texture Map
const SingleDwarfPlanet: React.FC<{
  data: DwarfPlanetData;
  isSelected: boolean;
  isSolarMode: boolean;
  hasSelectedPlanet: boolean;
  onSelectPlanet?: (name: string) => void;
  planetPositionsRef?: React.MutableRefObject<Record<string, PlanetViewInfo>>;
}> = ({ data, isSelected, isSolarMode, hasSelectedPlanet, onSelectPlanet, planetPositionsRef }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Load photorealistic day texture map
  const dayTex = useLoader(THREE.TextureLoader, getAssetUrl(data.dayTexture || '/textures/Autonomous_Moon_Texture.jpg'));

  // Orbit line BufferGeometry
  const orbitLineMesh = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Apply inclination tilt offset
      const tilt = Math.sin(theta * 2) * data.incline * 8.0;

      pts.push(
        new THREE.Vector3(
          SUN_POS.x + (U.x * cosT + V.x * sinT) * data.radius,
          SUN_POS.y + (U.y * cosT + V.y * sinT) * data.radius + tilt,
          SUN_POS.z + (U.z * cosT + V.z * sinT) * data.radius
        )
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(data.color),
      transparent: true,
      opacity: isSelected ? 0.95 : (isSolarMode ? 0.45 : 0.20),
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geo, mat);
  }, [data.radius, data.color, data.incline, isSolarMode, isSelected]);

  // Custom Day/Night GLSL Shader Material with Texture
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTex },
        planetColor: { value: new THREE.Color(data.color) },
        sunPosition: { value: SUN_POS },
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
        uniform vec3 planetColor;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);

          vec4 texColor = texture2D(dayTexture, vUv);

          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.20, 0.25, NdotL);

          float dayLighting = clamp(NdotL * 0.45 + 0.65, 0.55, 1.15);
          vec3 daySide = texColor.rgb * dayLighting;
          vec3 nightSide = texColor.rgb * 0.12 + vec3(0.01, 0.02, 0.05);

          vec3 finalColor = mix(nightSide, daySide, dayFactor);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [dayTex, data.color]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Calculate fixed orbital position
      const theta = data.orbitAngleOffset;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const tilt = Math.sin(theta * 2) * data.incline * 8.0;

      groupRef.current.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * data.radius,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * data.radius + tilt,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * data.radius
      );

      if (planetPositionsRef) {
        planetPositionsRef.current[data.name] = {
          pos: groupRef.current.position.clone(),
          viewDist: data.size * 5.5 + 2.0,
        };
      }
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group>
      {/* Orbit Trajectory Line */}
      {isSolarMode && !hasSelectedPlanet && <primitive object={orbitLineMesh} />}

      {/* 3D Dwarf Planet Mesh */}
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet?.(data.name);
        }}
      >
        <mesh ref={meshRef} material={shaderMaterial}>
          <sphereGeometry
            args={[
              data.size,
              32,
              32,
              0,
              Math.PI * 2,
              0,
              Math.PI
            ]}
          />
        </mesh>

        {/* Outer subtle icy atmosphere halo */}
        <mesh scale={1.12}>
          <sphereGeometry args={[data.size, 16, 16]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Haumea Ring visualization if Haumea */}
        {data.isEllipsoid && (
          <mesh rotation={[Math.PI / 3, 0.2, 0]}>
            <ringGeometry args={[data.size * 1.4, data.size * 1.8, 64]} />
            <meshBasicMaterial
              color={data.color}
              transparent
              opacity={0.30}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Floating 3D HUD Tag */}
        <Html
          position={[0, data.size + 0.5, 0]}
          center
          distanceFactor={isSelected ? 12 : 36}
          className="pointer-events-auto select-none whitespace-nowrap"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlanet?.(data.name);
            }}
            className={`rounded-full border tracking-wider transition-all duration-300 cursor-pointer ${
              isSelected
                ? 'px-2 py-0.5 text-[8px] bg-slate-950/90 text-cyan-300 border-cyan-400/80 shadow-[0_0_8px_rgba(56,189,248,0.5)] scale-75'
                : 'px-2 py-0.5 text-[9px] bg-black/80 text-slate-300 border-slate-600/40 shadow-[0_0_8px_rgba(148,163,184,0.4)] hover:border-cyan-400 hover:scale-105'
            }`}
          >
            🔵 {data.name.toUpperCase()}
          </button>
        </Html>
      </group>
    </group>
  );
};

export const DwarfPlanets3D: React.FC<DwarfPlanets3DProps> = ({
  onSelectPlanet,
  selectedPlanetName,
  isSolarMode = false,
  planetPositionsRef,
}) => {
  return (
    <group>
      {DWARF_PLANETS_DATA.map((dwarf) => (
        <SingleDwarfPlanet
          key={dwarf.name}
          data={dwarf}
          isSelected={selectedPlanetName === dwarf.name}
          isSolarMode={isSolarMode}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
          planetPositionsRef={planetPositionsRef}
        />
      ))}
    </group>
  );
};
