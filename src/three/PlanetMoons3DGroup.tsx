import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { PLANET_MOONS_DATA } from '../data/planetMoonData';
import type { MoonData } from '../data/planetMoonData';
import { getAssetUrl } from '../utils/assetPath';

export const EARTH_SUN_POSITION = new THREE.Vector3(26, 14, 14);

export interface PlanetMoons3DProps {
  planetName: string;
  isFocused?: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number; parentPos?: THREE.Vector3 }>>;
}

// Shader material for textured major moons (uses moon.dayTexture and optional nightTexture)
const TexturedMoonMesh: React.FC<{ moon: MoonData }> = ({ moon }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const [dayTex, nightTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl(moon.dayTexture!),
    moon.nightTexture ? getAssetUrl(moon.nightTexture) : getAssetUrl(moon.dayTexture!)
  ]);

  useMemo(() => {
    if (dayTex) {
      dayTex.colorSpace = THREE.SRGBColorSpace;
      dayTex.anisotropy = 16;
    }
    if (nightTex) {
      nightTex.colorSpace = THREE.SRGBColorSpace;
      nightTex.anisotropy = 16;
    }
  }, [dayTex, nightTex]);

  const moonShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTex },
        nightTexture: { value: nightTex },
        sunPosition: { value: EARTH_SUN_POSITION },
        hasNightTex: { value: !!moon.nightTexture },
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
        uniform bool hasNightTex;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.20, 0.25, NdotL);

          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightTexColor = texture2D(nightTexture, vUv);

          float dayLighting = clamp(NdotL * 0.8 + 1.2, 0.5, 2.2);
          vec3 daySide = dayColor.rgb * dayLighting;
          // Add a stark white exposure boost where the sun hits directly
          daySide += vec3(0.35, 0.35, 0.35) * pow(max(0.0, NdotL), 1.5);
          
          vec3 nightSide = hasNightTex ? nightTexColor.rgb : (dayColor.rgb * 0.08 + vec3(0.01, 0.02, 0.04));

          float twilight = clamp(1.0 - abs(NdotL) * 3.0, 0.0, 1.0);
          vec3 twilightGlow = dayColor.rgb * twilight * 0.15;

          vec3 finalColor = mix(nightSide, daySide, dayFactor) + twilightGlow;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [dayTex, nightTex, moon.nightTexture]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]} material={moonShaderMaterial}>
      <sphereGeometry args={[moon.size, 64, 64]} />
    </mesh>
  );
};

// Shader material for untextured major moons (uses moon.color with Day/Night shading)
const ColoredMoonMesh: React.FC<{ moon: MoonData }> = ({ moon }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        moonColor: { value: new THREE.Color(moon.color) },
        sunPosition: { value: EARTH_SUN_POSITION },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        uniform vec3 moonColor;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.20, 0.25, NdotL);

          float dayLighting = clamp(NdotL * 0.45 + 0.65, 0.55, 1.15);
          vec3 daySide = moonColor * dayLighting;
          vec3 nightSide = moonColor * 0.08 + vec3(0.01, 0.02, 0.04);

          vec3 finalColor = mix(nightSide, daySide, dayFactor);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [moon.color]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <sphereGeometry args={[moon.size, 32, 32]} />
    </mesh>
  );
};

const SingleMoon3DMesh: React.FC<{
  moon: MoonData;
  isFocused?: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number; parentPos?: THREE.Vector3 }>>;
  showNames?: boolean;
  showOrbits?: boolean;
}> = ({ moon, isFocused, planetPositionsRef, showNames = true, showOrbits = true }) => {
  const moonRef = useRef<THREE.Group>(null);
  const moonGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (moonRef.current) {
      // Orbital rotation around parent planet
      moonRef.current.rotation.y += delta * moon.speed;
    }

    if (moonGroupRef.current && moonRef.current && planetPositionsRef) {
      const worldPos = new THREE.Vector3();
      moonGroupRef.current.getWorldPosition(worldPos);
      
      const parentWorldPos = new THREE.Vector3();
      moonRef.current.getWorldPosition(parentWorldPos);

      planetPositionsRef.current[moon.name] = {
        pos: worldPos,
        parentPos: parentWorldPos,
        viewDist: Math.max(1.8, moon.size * 5.0 + 1.2),
      };
    }
  });

  // Create sharp glowing orbit line for the moon
  const orbitLineMesh = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * moon.radiusOffset, 0, Math.sin(theta) * moon.radiusOffset));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(moon.color),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geo, mat);
  }, [moon.radiusOffset, moon.color]);

  return (
    <group ref={moonRef} rotation={[0, 0, 0]}>
      {/* Crisp glowing orbit line (visible when planet is focused/selected) */}
      {isFocused && showOrbits && (
        <primitive object={orbitLineMesh} />
      )}

      {/* 3D Moon Mesh positioned at radiusOffset */}
      <group ref={moonGroupRef} position={[moon.radiusOffset, 0, 0]}>
        {moon.dayTexture ? (
          <TexturedMoonMesh moon={moon} />
        ) : (
          <ColoredMoonMesh moon={moon} />
        )}


        {/* Floating 3D Label Tag */}
        {showNames && (
          <Html
            position={[0, moon.size + 0.15, 0]}
            center
            distanceFactor={isFocused ? 14 : 35}
            zIndexRange={[10, 0]}
            className={`pointer-events-none select-none whitespace-nowrap transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 border border-slate-700/80 shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-[7px] text-slate-300 font-semibold tracking-wide">
              <span>{moon.name}</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

// Instanced Swarm for Autonomous / Provisional Small Outer Moons with Photorealistic Day/Night GLSL Shader
const AutonomousMoonsSwarm: React.FC<{
  count: number;
  baseRadius: number;
}> = ({ count, baseRadius }) => {
  const swarmRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const [moonTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Autonomous_Moon_Texture.jpg')
  ]);

  useMemo(() => {
    if (moonTex) {
      moonTex.colorSpace = THREE.SRGBColorSpace;
      moonTex.minFilter = THREE.LinearFilter;
    }
  }, [moonTex]);

  const swarmShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: moonTex },
        sunPosition: { value: EARTH_SUN_POSITION },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          mat4 instanceModelMatrix = modelMatrix * instanceMatrix;
          vNormal = normalize(mat3(instanceModelMatrix) * normal);
          vec4 worldPos = instanceModelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        uniform sampler2D dayTexture;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.20, 0.25, NdotL);

          vec4 dayColor = texture2D(dayTexture, vUv);
          float dayLighting = clamp(NdotL * 0.45 + 0.65, 0.55, 1.15);

          vec3 daySide = dayColor.rgb * dayLighting;
          vec3 nightSide = dayColor.rgb * 0.08 + vec3(0.01, 0.02, 0.04);

          vec3 finalColor = mix(nightSide, daySide, dayFactor);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [moonTex]);

  const swarmParticles = useMemo(() => {
    return Array.from({ length: count }, () => {
      const radius = baseRadius + (Math.random() - 0.2) * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.004 + Math.random() * 0.008) * (Math.random() > 0.4 ? 1 : -1);
      const scale = 0.09 + Math.random() * 0.08;
      return { radius, angle, speed, scale };
    });
  }, [count, baseRadius]);

  const geo = useMemo(() => new THREE.SphereGeometry(1.0, 32, 32), []);

  useFrame((_, delta) => {
    if (!swarmRef.current) return;
    swarmParticles.forEach((p, idx) => {
      p.angle += delta * p.speed;
      const cosT = Math.cos(p.angle);
      const sinT = Math.sin(p.angle);

      dummy.position.set(cosT * p.radius, 0, sinT * p.radius);
      dummy.rotation.y += delta * 0.03;
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();

      swarmRef.current?.setMatrixAt(idx, dummy.matrix);
    });
    swarmRef.current.instanceMatrix.needsUpdate = true;
  });

  if (count <= 0) return null;

  return (
    <instancedMesh ref={swarmRef} args={[geo, undefined, count]} material={swarmShaderMaterial} />
  );
};

export const PlanetMoons3DGroup: React.FC<{
  planetName: string;
  isFocused?: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, { pos: THREE.Vector3; viewDist: number; parentPos?: THREE.Vector3 }>>;
  showNames?: boolean;
  showOrbits?: boolean;
}> = ({ planetName, isFocused = false, planetPositionsRef, showNames = true, showOrbits = true }) => {
  const data = PLANET_MOONS_DATA[planetName];
  if (!data || data.totalMoons === 0) return null;

  return (
    <group>
      {/* 1. Major Named Moons */}
      {data.majorMoons.map((moon) => (
        <SingleMoon3DMesh
          key={moon.name}
          moon={moon}
          isFocused={isFocused}
          planetPositionsRef={planetPositionsRef}
          showNames={showNames}
          showOrbits={showOrbits}
        />
      ))}

      {/* 2. Autonomous / Provisional Small Outer Moons Swarm */}
      {(data.remainingMoonsCount || 0) > 0 && (
        <AutonomousMoonsSwarm
          count={data.remainingMoonsCount}
          baseRadius={data.majorMoons.length > 0 ? data.majorMoons[data.majorMoons.length - 1].radiusOffset + 0.8 : 2.5}
        />
      )}
    </group>
  );
};

