import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getAssetUrl } from '../utils/assetPath';
import { PlanetMoons3DGroup } from './PlanetMoons3DGroup';

export interface PlanetViewInfo {
  pos: THREE.Vector3;
  viewDist: number;
}

interface SolarSystemProps {
  onSelectPlanet?: (planetName: string) => void;
  selectedPlanetName?: string | null;
  isSolarMode?: boolean;
  planetPositionsRef?: React.MutableRefObject<Record<string, PlanetViewInfo>>;
  showMoons?: boolean;
}

// Fixed Sun position in space
const SUN_POS = new THREE.Vector3(26, 14, 14);

// Orthonormal basis vectors for the planetary ecliptic orbital plane
const U = new THREE.Vector3(-0.7896, -0.4303, -0.4318);
const V = new THREE.Vector3(0.5661, -0.2512, -0.7853);

// Helper to generate closed 3D elliptical orbital trajectory line points
function createOrbitPoints(radius: number, segments = 128): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    pts.push(
      new THREE.Vector3(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * radius,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * radius,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * radius
      )
    );
  }
  return pts;
}

// Single Orbit Path Line Component (Uses THREE.Line via primitive to avoid SVG line collision)
const OrbitTrajectoryLine: React.FC<{
  planetName: string;
  radius: number;
  color: string;
  isSolarMode: boolean;
  isSelected: boolean;
  hasSelectedPlanet: boolean;
  onSelectPlanet?: (name: string) => void;
}> = ({ planetName, radius, color, isSolarMode, isSelected, hasSelectedPlanet, onSelectPlanet }) => {
  const lineMesh = useMemo(() => {
    const pts = createOrbitPoints(radius, 128);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: isSelected ? 0.95 : (isSolarMode ? 0.75 : 0.28),
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geo, mat);
  }, [radius, color, isSolarMode, isSelected]);

  // STRICT RULE:
  // Orbit trajectory lines should ONLY show when user explicitly clicks "Solar System" mode!
  // When in "Earth" mode OR when a specific planet is selected, completely hide the orbit lines.
  if (!isSolarMode || hasSelectedPlanet) {
    return null;
  }

  return (
    <primitive
      object={lineMesh}
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onSelectPlanet?.(planetName);
      }}
    />
  );
};

// Realistic 3D Procedural Asteroid Belt Component (High Performance 60FPS Instanced Space Rocks)
export const ProceduralAsteroidBelt: React.FC = () => {
  const meshRef1 = useRef<THREE.InstancedMesh>(null);
  const meshRef2 = useRef<THREE.InstancedMesh>(null);
  const meshRef3 = useRef<THREE.InstancedMesh>(null);

  const [astTex1, astTex2, astTex3] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Astroids 1.png'),
    getAssetUrl('/textures/Astroids 2.png'),
    getAssetUrl('/textures/Astroids 3.png'),
  ]);

  useMemo(() => {
    [astTex1, astTex2, astTex3].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
      }
    });
  }, [astTex1, astTex2, astTex3]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Optimized asteroid counts (240 total asteroids - smooth 60 FPS without GPU lag)
  const asteroidGroups = useMemo(() => {
    const createGroup = (count: number) => {
      return Array.from({ length: count }, () => {
        const radius = 50.0 + Math.random() * 10.5;
        const angle = Math.random() * Math.PI * 2;
        const yOffset = (Math.random() - 0.5) * 4.5;
        const scale = 0.16 + Math.random() * 0.45;
        const orbitSpeed = 0.015 + Math.random() * 0.035;
        const rotSpeedX = (Math.random() - 0.5) * 1.5;
        const rotSpeedY = (Math.random() - 0.5) * 1.5;

        return {
          radius,
          angle,
          yOffset,
          scale,
          orbitSpeed,
          rotSpeedX,
          rotSpeedY,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
        };
      });
    };

    return [createGroup(80), createGroup(80), createGroup(80)];
  }, []);

  // Optimized lightweight 3D rock geometry (Detail = 1 for high frame-rate rendering)
  const [geo1, geo2, geo3] = useMemo(() => {
    const createCraggyGeo = (seed: number) => {
      const geo = new THREE.DodecahedronGeometry(1.0, 1);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const noise = 0.72 + Math.sin(x * 3.0 + seed) * Math.cos(y * 3.0 + seed) * 0.35;
        pos.setXYZ(i, x * noise, y * noise, z * noise);
      }
      geo.computeVertexNormals();
      return geo;
    };
    return [createCraggyGeo(1.0), createCraggyGeo(2.5), createCraggyGeo(4.2)];
  }, []);

  // 60FPS Optimized frame updates
  useFrame((_, delta) => {
    const refs = [meshRef1, meshRef2, meshRef3];
    asteroidGroups.forEach((group, gIdx) => {
      const mesh = refs[gIdx].current;
      if (!mesh) return;

      group.forEach((ast, idx) => {
        ast.angle += delta * ast.orbitSpeed;
        ast.rotX += delta * ast.rotSpeedX;
        ast.rotY += delta * ast.rotSpeedY;

        const cosT = Math.cos(ast.angle);
        const sinT = Math.sin(ast.angle);

        dummy.position.set(
          SUN_POS.x + (U.x * cosT + V.x * sinT) * ast.radius,
          SUN_POS.y + (U.y * cosT + V.y * sinT) * ast.radius + ast.yOffset,
          SUN_POS.z + (U.z * cosT + V.z * sinT) * ast.radius
        );

        dummy.rotation.set(ast.rotX, ast.rotY, 0);
        dummy.scale.set(ast.scale, ast.scale, ast.scale);
        dummy.updateMatrix();

        mesh.setMatrixAt(idx, dummy.matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      <instancedMesh ref={meshRef1} args={[geo1, undefined, asteroidGroups[0].length]}>
        <meshStandardMaterial
          map={astTex1}
          roughness={0.8}
          metalness={0.2}
        />
      </instancedMesh>
      <instancedMesh ref={meshRef2} args={[geo2, undefined, asteroidGroups[1].length]}>
        <meshStandardMaterial
          map={astTex2}
          roughness={0.8}
          metalness={0.2}
        />
      </instancedMesh>
      <instancedMesh ref={meshRef3} args={[geo3, undefined, asteroidGroups[3]?.length || 80]}>
        <meshStandardMaterial
          map={astTex3}
          roughness={0.8}
          metalness={0.2}
        />
      </instancedMesh>
    </group>
  );
};

export const SolarSystemPlanets: React.FC<SolarSystemProps & { showNames?: boolean; showOrbits?: boolean }> = ({
  onSelectPlanet,
  selectedPlanetName,
  isSolarMode = true,
  planetPositionsRef,
  showMoons = true,
  showNames = true,
  showOrbits = true,
}) => {
  const mercuryRef = useRef<THREE.Group>(null);
  const venusRef = useRef<THREE.Group>(null);
  const marsRef = useRef<THREE.Group>(null);
  const jupiterRef = useRef<THREE.Group>(null);
  const saturnRef = useRef<THREE.Group>(null);
  const uranusRef = useRef<THREE.Group>(null);
  const neptuneRef = useRef<THREE.Group>(null);

  // Load high-resolution Mars Daytime & Nighttime textures provided by user
  const [marsDayTex, marsNightTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Mars Day.png'),
    getAssetUrl('/textures/Mars night.png')
  ]);

  // Load high-resolution Mercury Daytime & Nighttime textures provided by user
  const [mercuryDayTex, mercuryNightTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Mercury_Day.png'),
    getAssetUrl('/textures/Mercury_Night.png')
  ]);

  // Load high-resolution Venus Daytime & Nighttime textures provided by user
  const [venusDayTex, venusNightTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Venus Day.png'),
    getAssetUrl('/textures/Venus night.png')
  ]);

  // Load high-resolution Jupiter Daytime & Nighttime textures provided by user
  const [jupiterDayTex, jupiterNightTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Jupitor Day.png'),
    getAssetUrl('/textures/Jupitor Night.png')
  ]);

  // Load high-resolution Saturn Daytime & Nighttime textures provided by user
  const [saturnDayTex, saturnNightTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Saturn Day.png'),
    getAssetUrl('/textures/Saturn Night.png')
  ]);

  // Load high-resolution Saturn Intricate Rings & Alpha Mask textures provided by user
  const [saturnRingTex, saturnRingAlphaTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Saturn Intricate Rings Against Black.png'),
    getAssetUrl('/textures/Monochrome Saturn Ring Alpha Mask.png')
  ]);

  // Load high-resolution Uranus Daytime & Nighttime textures provided by user
  const [uranusDayTex, uranusNightTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Uranus Day.png'),
    getAssetUrl('/textures/Uranus Night.png')
  ]);

  // Load high-resolution Neptune Daytime & Nighttime textures provided by user
  const [neptuneDayTex, neptuneNightTex] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/Neptune Day.png'),
    getAssetUrl('/textures/Neptune Night.png')
  ]);

  useMemo(() => {
    if (marsDayTex) marsDayTex.colorSpace = THREE.SRGBColorSpace;
    if (marsNightTex) marsNightTex.colorSpace = THREE.SRGBColorSpace;
    if (mercuryDayTex) mercuryDayTex.colorSpace = THREE.SRGBColorSpace;
    if (mercuryNightTex) mercuryNightTex.colorSpace = THREE.SRGBColorSpace;
    if (venusDayTex) venusDayTex.colorSpace = THREE.SRGBColorSpace;
    if (venusNightTex) venusNightTex.colorSpace = THREE.SRGBColorSpace;
    if (jupiterDayTex) jupiterDayTex.colorSpace = THREE.SRGBColorSpace;
    if (jupiterNightTex) jupiterNightTex.colorSpace = THREE.SRGBColorSpace;
    if (saturnDayTex) saturnDayTex.colorSpace = THREE.SRGBColorSpace;
    if (saturnNightTex) saturnNightTex.colorSpace = THREE.SRGBColorSpace;
    if (saturnRingTex) saturnRingTex.colorSpace = THREE.SRGBColorSpace;
    if (uranusDayTex) uranusDayTex.colorSpace = THREE.SRGBColorSpace;
    if (uranusNightTex) uranusNightTex.colorSpace = THREE.SRGBColorSpace;
    if (neptuneDayTex) neptuneDayTex.colorSpace = THREE.SRGBColorSpace;
    if (neptuneNightTex) neptuneNightTex.colorSpace = THREE.SRGBColorSpace;
  }, [marsDayTex, marsNightTex, mercuryDayTex, mercuryNightTex, venusDayTex, venusNightTex, jupiterDayTex, jupiterNightTex, saturnDayTex, saturnNightTex, saturnRingTex, saturnRingAlphaTex, uranusDayTex, uranusNightTex, neptuneDayTex, neptuneNightTex]);

  // Photorealistic Day/Night transition shader for Mars illuminated by the Sun
  const marsShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: marsDayTex },
        nightTexture: { value: marsNightTex },
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
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.18, 0.22, NdotL);

          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Sunlight incidence lighting
          float dayLighting = clamp(NdotL * 0.45 + 0.65, 0.5, 1.08);
          vec3 daySide = dayColor.rgb * dayLighting;
          vec3 nightSide = nightColor.rgb;

          // Mars rust-orange twilight terminator glow
          float twilight = clamp(1.0 - abs(NdotL) * 3.2, 0.0, 1.0);
          vec3 sunsetGlow = vec3(0.85, 0.28, 0.08) * twilight * 0.25 * (1.0 - dayFactor * 0.5);

          // Thin Martian atmosphere limb haze
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.5);
          vec3 marsHaze = vec3(0.82, 0.35, 0.15) * fresnel * 0.32;

          vec3 finalColor = mix(nightSide, daySide, dayFactor) + sunsetGlow + marsHaze;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [marsDayTex, marsNightTex]);

  // Photorealistic Day/Night transition shader for Mercury illuminated by the Sun
  const mercuryShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: mercuryDayTex },
        nightTexture: { value: mercuryNightTex },
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
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);
          // Mercury has a very sharp terminator (no atmosphere to scatter light)
          float dayFactor = smoothstep(-0.05, 0.12, NdotL);

          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Strong direct sunlight on Mercury (closest to Sun)
          float dayLighting = clamp(NdotL * 0.55 + 0.65, 0.45, 1.2);
          vec3 daySide = dayColor.rgb * dayLighting;
          vec3 nightSide = nightColor.rgb * 0.85;

          // Very faint limb haze (Mercury has almost no atmosphere)
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.0);
          vec3 mercuryRim = vec3(0.55, 0.45, 0.30) * fresnel * 0.18;

          vec3 finalColor = mix(nightSide, daySide, dayFactor) + mercuryRim;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [mercuryDayTex, mercuryNightTex]);

  // Photorealistic Day/Night transition shader for Venus illuminated by the Sun
  const venusShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: venusDayTex },
        nightTexture: { value: venusNightTex },
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
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);
          // Venus has a thick atmosphere — very soft, wide terminator
          float dayFactor = smoothstep(-0.30, 0.38, NdotL);

          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Diffuse sunlight modulation through thick cloud layers
          float dayLighting = clamp(NdotL * 0.40 + 0.68, 0.52, 1.1);
          vec3 daySide = dayColor.rgb * dayLighting;
          vec3 nightSide = nightColor.rgb;

          // Venus has a bright golden twilight glow along terminator
          float twilight = clamp(1.0 - abs(NdotL) * 2.2, 0.0, 1.0);
          vec3 venusGlow = vec3(0.92, 0.72, 0.20) * twilight * 0.30 * (1.0 - dayFactor * 0.6);

          // Very thick atmospheric Fresnel limb — bright golden haze
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);
          vec3 venusAtmo = vec3(0.88, 0.68, 0.22) * fresnel * 0.55;

          vec3 finalColor = mix(nightSide, daySide, dayFactor) + venusGlow + venusAtmo;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [venusDayTex, venusNightTex]);

  // Photorealistic Day/Night transition shader for Jupiter illuminated by the Sun
  const jupiterShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: jupiterDayTex },
        nightTexture: { value: jupiterNightTex },
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
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);
          // Jupiter has banded atmosphere — moderate terminator
          float dayFactor = smoothstep(-0.20, 0.28, NdotL);

          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Jupiter is far from Sun — softer lighting
          float dayLighting = clamp(NdotL * 0.35 + 0.72, 0.58, 1.05);
          vec3 daySide = dayColor.rgb * dayLighting;
          vec3 nightSide = nightColor.rgb;

          // Warm amber twilight glow along the terminator bands
          float twilight = clamp(1.0 - abs(NdotL) * 2.8, 0.0, 1.0);
          vec3 jupiterGlow = vec3(0.80, 0.52, 0.18) * twilight * 0.22;

          // Subtle atmospheric Fresnel limb haze
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
          vec3 jupiterAtmo = vec3(0.75, 0.55, 0.28) * fresnel * 0.28;

          vec3 finalColor = mix(nightSide, daySide, dayFactor) + jupiterGlow + jupiterAtmo;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [jupiterDayTex, jupiterNightTex]);

  // Photorealistic Day/Night transition shader for Saturn illuminated by the Sun
  const saturnShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: saturnDayTex },
        nightTexture: { value: saturnNightTex },
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
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);
          // Saturn is very far from Sun — wide soft terminator
          float dayFactor = smoothstep(-0.22, 0.30, NdotL);

          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);

          // Soft distant sunlight on Saturn
          float dayLighting = clamp(NdotL * 0.32 + 0.70, 0.55, 1.02);
          vec3 daySide = dayColor.rgb * dayLighting;
          vec3 nightSide = nightColor.rgb;

          // Warm golden-yellow twilight glow (Saturn's banded clouds)
          float twilight = clamp(1.0 - abs(NdotL) * 2.5, 0.0, 1.0);
          vec3 saturnGlow = vec3(0.92, 0.78, 0.30) * twilight * 0.20;

          // Golden atmospheric Fresnel limb haze for gas giant
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);
          vec3 saturnAtmo = vec3(0.88, 0.72, 0.35) * fresnel * 0.32;

          vec3 finalColor = mix(nightSide, daySide, dayFactor) + saturnGlow + saturnAtmo;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [saturnDayTex, saturnNightTex]);

  // Photorealistic Day/Night transition shader for Neptune illuminated by the Sun
  const neptuneShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: neptuneDayTex },
        nightTexture: { value: neptuneNightTex },
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
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);

          // Deep distant ice giant smooth transition
          float dayFactor = smoothstep(-0.25, 0.35, NdotL);

          vec4 dayTexColor = texture2D(dayTexture, vUv);
          vec4 nightTexColor = texture2D(nightTexture, vUv);

          // Soft ambient sunlight on distant ice giant
          float dayLighting = clamp(NdotL * 0.40 + 0.65, 0.45, 1.10);
          vec3 daySide = dayTexColor.rgb * dayLighting;

          // Deep blue twilight glow
          float twilight = clamp(1.0 - abs(NdotL) * 2.5, 0.0, 1.0);
          vec3 neptuneGlow = vec3(0.15, 0.40, 0.88) * twilight * 0.20;

          // Deep royal blue atmospheric Fresnel limb haze
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);
          vec3 neptuneAtmo = vec3(0.10, 0.35, 0.82) * fresnel * 0.38;

          vec3 finalColor = mix(nightTexColor.rgb * 0.70, daySide, dayFactor) + neptuneGlow + neptuneAtmo;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [neptuneDayTex, neptuneNightTex]);

  // Photorealistic Day/Night transition shader for Uranus illuminated by the Sun
  const uranusShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: uranusDayTex },
        nightTexture: { value: uranusNightTex },
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
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunPosition;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(sunPosition - vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          float NdotL = dot(normal, sunDir);

          // Smooth distant ice giant terminator transition matching Jupiter
          float dayFactor = smoothstep(-0.25, 0.35, NdotL);

          vec4 dayTexColor = texture2D(dayTexture, vUv);
          vec4 nightTexColor = texture2D(nightTexture, vUv);

          // Soft ambient lighting for Uranus facing Sun
          float dayLighting = clamp(NdotL * 0.42 + 0.65, 0.45, 1.10);
          vec3 daySide = dayTexColor.rgb * dayLighting;

          // Cyan / Teal ice twilight glow
          float twilight = clamp(1.0 - abs(NdotL) * 2.5, 0.0, 1.0);
          vec3 uranusGlow = vec3(0.20, 0.65, 0.85) * twilight * 0.22;

          // Cyan atmospheric Fresnel limb haze
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);
          vec3 uranusAtmo = vec3(0.18, 0.70, 0.90) * fresnel * 0.36;

          vec3 finalColor = mix(nightTexColor.rgb * 0.70, daySide, dayFactor) + uranusGlow + uranusAtmo;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [uranusDayTex, uranusNightTex]);



  // Stable & fixed orbital coordinates:
  // Just like Earth is stable in its place, all planets stay in fixed orbital positions!
  // They only spin on their own axis (axial rotation), giving a completely stable 360-degree viewing experience.
  useFrame((_, delta) => {
    // Mercury (Stable on Orbit R = 8.5)
    if (mercuryRef.current) {
      const cosT = Math.cos(1.4);
      const sinT = Math.sin(1.4);
      mercuryRef.current.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * 8.5,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * 8.5,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * 8.5
      );
      mercuryRef.current.rotation.y += delta * 0.12;
      if (planetPositionsRef) {
        planetPositionsRef.current['Mercury'] = {
          pos: mercuryRef.current.position.clone(),
          viewDist: 2.8
        };
      }
    }

    // Venus (Stable on Orbit R = 16.5)
    if (venusRef.current) {
      const cosT = Math.cos(3.2);
      const sinT = Math.sin(3.2);
      venusRef.current.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * 16.5,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * 16.5,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * 16.5
      );
      venusRef.current.rotation.y += delta * 0.10;
      if (planetPositionsRef) {
        planetPositionsRef.current['Venus'] = {
          pos: venusRef.current.position.clone(),
          viewDist: 3.8
        };
      }
    }

    // Sun (Position [26, 14, 14])
    if (planetPositionsRef) {
      planetPositionsRef.current['Sun'] = {
        pos: SUN_POS.clone(),
        viewDist: 16.5
      };
    }

    // Earth (Stable at [0.4, 0.05, 0])
    if (planetPositionsRef) {
      planetPositionsRef.current['Earth'] = {
        pos: new THREE.Vector3(0.4, 0.05, 0),
        viewDist: 13.2
      };
    }

    // Mars (Stable on Orbit R = 45.0)
    if (marsRef.current) {
      const cosT = Math.cos(0.8);
      const sinT = Math.sin(0.8);
      marsRef.current.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * 45.0,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * 45.0,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * 45.0
      );
      marsRef.current.rotation.y += delta * 0.15;
      if (planetPositionsRef) {
        planetPositionsRef.current['Mars'] = {
          pos: marsRef.current.position.clone(),
          viewDist: 4.6
        };
      }
    }

    // Jupiter (Stable on Orbit R = 66.0)
    if (jupiterRef.current) {
      const cosT = Math.cos(4.6);
      const sinT = Math.sin(4.6);
      jupiterRef.current.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * 66.0,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * 66.0,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * 66.0
      );
      jupiterRef.current.rotation.y += delta * 0.18;
      if (planetPositionsRef) {
        planetPositionsRef.current['Jupiter'] = {
          pos: jupiterRef.current.position.clone(),
          viewDist: 10.5
        };
      }
    }

    // Saturn (Stable on Orbit R = 88.0)
    if (saturnRef.current) {
      const cosT = Math.cos(2.4);
      const sinT = Math.sin(2.4);
      saturnRef.current.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * 88.0,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * 88.0,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * 88.0
      );
      saturnRef.current.rotation.y += delta * 0.15;
      if (planetPositionsRef) {
        planetPositionsRef.current['Saturn'] = {
          pos: saturnRef.current.position.clone(),
          viewDist: 9.0
        };
      }
    }

    // Uranus (Stable on Orbit R = 108.0)
    if (uranusRef.current) {
      const cosT = Math.cos(3.8);
      const sinT = Math.sin(3.8);
      uranusRef.current.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * 108.0,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * 108.0,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * 108.0
      );
      uranusRef.current.rotation.y += delta * 0.14;
      if (planetPositionsRef) {
        planetPositionsRef.current['Uranus'] = {
          pos: uranusRef.current.position.clone(),
          viewDist: 7.2
        };
      }
    }

    // Neptune (Stable on Orbit R = 128.0)
    if (neptuneRef.current) {
      const cosT = Math.cos(5.2);
      const sinT = Math.sin(5.2);
      neptuneRef.current.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * 128.0,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * 128.0,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * 128.0
      );
      neptuneRef.current.rotation.y += delta * 0.12;
      if (planetPositionsRef) {
        planetPositionsRef.current['Neptune'] = {
          pos: neptuneRef.current.position.clone(),
          viewDist: 6.8
        };
      }
    }
  });

  return (
    <group>
      {/* ================================================================= */}
      {/* GLOWING PLANETARY ORBITAL TRAJECTORY LINES CIRCLING AROUND SUN    */}
      {/* ================================================================= */}
      {/* 1. Mercury Orbit Line */}
      {showOrbits && (
        <OrbitTrajectoryLine
          planetName="Mercury"
          radius={8.5}
          color="#94a3b8"
          isSolarMode={isSolarMode}
          isSelected={selectedPlanetName === 'Mercury'}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
        />
      )}
      {/* 2. Venus Orbit Line */}
      {showOrbits && (
        <OrbitTrajectoryLine
          planetName="Venus"
          radius={16.5}
          color="#fde047"
          isSolarMode={isSolarMode}
          isSelected={selectedPlanetName === 'Venus'}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
        />
      )}
      {/* 3. Earth Orbit Line */}
      {showOrbits && (
        <OrbitTrajectoryLine
          planetName="Earth"
          radius={22.5}
          color="#38bdf8"
          isSolarMode={isSolarMode}
          isSelected={selectedPlanetName === 'Earth'}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
        />
      )}
      {/* 4. Mars Orbit Line */}
      {showOrbits && (
        <OrbitTrajectoryLine
          planetName="Mars"
          radius={30.0}
          color="#ef4444"
          isSolarMode={isSolarMode}
          isSelected={selectedPlanetName === 'Mars'}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
        />
      )}
      {/* 5. Jupiter Orbit Line */}
      {showOrbits && (
        <OrbitTrajectoryLine
          planetName="Jupiter"
          radius={55.0}
          color="#f59e0b"
          isSolarMode={isSolarMode}
          isSelected={selectedPlanetName === 'Jupiter'}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
        />
      )}
      {/* 6. Saturn Orbit Line */}
      {showOrbits && (
        <OrbitTrajectoryLine
          planetName="Saturn"
          radius={85.0}
          color="#eab308"
          isSolarMode={isSolarMode}
          isSelected={selectedPlanetName === 'Saturn'}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
        />
      )}
      {/* 7. Uranus Orbit Line */}
      {showOrbits && (
        <OrbitTrajectoryLine
          planetName="Uranus"
          radius={110.0}
          color="#06b6d4"
          isSolarMode={isSolarMode}
          isSelected={selectedPlanetName === 'Uranus'}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
        />
      )}
      {/* 8. Neptune Orbit Line */}
      {showOrbits && (
        <OrbitTrajectoryLine
          planetName="Neptune"
          radius={128.0}
          color="#0284c7"
          isSolarMode={isSolarMode}
          isSelected={selectedPlanetName === 'Neptune'}
          hasSelectedPlanet={!!selectedPlanetName}
          onSelectPlanet={onSelectPlanet}
        />
      )}


      {/* ================================================================= */}
      {/* 3D PLANET MESHES TRAVELING PRECISELY ALONG THEIR ORBIT LINES       */}
      {/* ================================================================= */}

      {/* 1. MERCURY */}
      <group
        ref={mercuryRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet?.('Mercury');
        }}
      >
        <mesh>
          <sphereGeometry args={[0.45, 64, 64]} />
          <primitive object={mercuryShaderMaterial} attach="material" />
        </mesh>
        {showNames && (
          <Html position={[0, 0.7, 0]} center distanceFactor={selectedPlanetName === 'Mercury' ? 12 : 28} className="pointer-events-auto select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet?.('Mercury');
              }}
              className={`rounded-full border tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedPlanetName === 'Mercury'
                  ? 'px-2 py-0.5 text-[8px] bg-slate-900/90 text-cyan-300 border-cyan-400/80 shadow-[0_0_8px_rgba(56,189,248,0.5)] scale-75'
                  : 'px-2 py-0.5 text-[9px] bg-black/80 text-slate-300 border-slate-500/40 shadow-[0_0_8px_rgba(148,163,184,0.4)] hover:border-cyan-400 hover:scale-105'
              }`}
            >
              ☿ MERCURY
            </button>
          </Html>
        )}
      </group>

      {/* 2. VENUS */}
      <group
        ref={venusRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet?.('Venus');
        }}
      >
        <mesh>
          <sphereGeometry args={[0.7, 64, 64]} />
          <primitive object={venusShaderMaterial} attach="material" />
        </mesh>

        {showNames && (
          <Html position={[0, 1.0, 0]} center distanceFactor={selectedPlanetName === 'Venus' ? 12 : 30} className="pointer-events-auto select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet?.('Venus');
              }}
              className={`rounded-full border tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedPlanetName === 'Venus'
                  ? 'px-2 py-0.5 text-[8px] bg-yellow-950/90 text-yellow-200 border-yellow-400/80 shadow-[0_0_8px_rgba(253,224,71,0.5)] scale-75'
                  : 'px-2 py-0.5 text-[10px] bg-black/80 text-yellow-200 border-yellow-400/40 shadow-[0_0_10px_rgba(253,224,71,0.4)] hover:border-yellow-400 hover:scale-105'
              }`}
            >
              ♀ VENUS
            </button>
          </Html>
        )}
      </group>

      {/* 3. MARS (Red Planet) */}
      <group
        ref={marsRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet?.('Mars');
        }}
      >
        <mesh>
          <sphereGeometry args={[0.78, 64, 64]} />
          <primitive object={marsShaderMaterial} attach="material" />
        </mesh>


        {/* 3D Moons of Mars (Phobos & Deimos) */}
        {showMoons && (
          <PlanetMoons3DGroup planetName="Mars" isFocused={selectedPlanetName === 'Mars'} planetPositionsRef={planetPositionsRef as any} showNames={showNames} showOrbits={showOrbits} />
        )}

        {showNames && (
          <Html position={[0, 1.15, 0]} center distanceFactor={selectedPlanetName === 'Mars' ? 13 : 32} className="pointer-events-auto select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet?.('Mars');
              }}
              className={`rounded-full border tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedPlanetName === 'Mars'
                  ? 'px-2 py-0.5 text-[8px] bg-red-950/90 text-red-200 border-red-400/80 shadow-[0_0_8px_rgba(239,68,68,0.5)] scale-75'
                  : 'px-2 py-0.5 text-[10px] bg-black/80 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:border-red-400 hover:scale-105'
              }`}
            >
              ♂ MARS
            </button>
          </Html>
        )}
      </group>

      {/* 4. JUPITER (Gas Giant) */}
      <group
        ref={jupiterRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet?.('Jupiter');
        }}
      >
        <mesh>
          <sphereGeometry args={[2.2, 64, 64]} />
          <primitive object={jupiterShaderMaterial} attach="material" />
        </mesh>


        {/* 3D Moons of Jupiter (Ganymede, Callisto, Io, Europa, Amalthea + 58 Swarm Moons) */}
        {showMoons && (
          <PlanetMoons3DGroup planetName="Jupiter" isFocused={selectedPlanetName === 'Jupiter'} planetPositionsRef={planetPositionsRef as any} showNames={showNames} showOrbits={showOrbits} />
        )}

        {showNames && (
          <Html position={[0, 2.7, 0]} center distanceFactor={selectedPlanetName === 'Jupiter' ? 14 : 38} className="pointer-events-auto select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet?.('Jupiter');
              }}
              className={`rounded-full border tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedPlanetName === 'Jupiter'
                  ? 'px-2.5 py-0.5 text-[9px] bg-amber-950/90 text-amber-200 border-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.5)] scale-75'
                  : 'px-2 py-0.5 text-[11px] bg-black/80 text-amber-300 border-amber-500/40 shadow-[0_0_14px_rgba(245,158,11,0.6)] hover:border-amber-400 hover:scale-105'
              }`}
            >
              ♃ JUPITER
            </button>
          </Html>
        )}
      </group>

      {/* 5. SATURN (With Tilted Rings) */}
      <group
        ref={saturnRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet?.('Saturn');
        }}
      >
        <mesh>
          <sphereGeometry args={[1.65, 64, 64]} />
          <primitive object={saturnShaderMaterial} attach="material" />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.2, -0.15]}>
          <ringGeometry args={[2.1, 4.6, 128]} />
          <meshStandardMaterial
            map={saturnRingTex}
            alphaMap={saturnRingAlphaTex}
            side={THREE.DoubleSide}
            transparent
            opacity={0.96}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>

        {/* 3D Moons of Saturn (Titan, Enceladus, Mimas, Rhea, Iapetus + 229 Swarm Moons) */}
        {showMoons && (
          <PlanetMoons3DGroup planetName="Saturn" isFocused={selectedPlanetName === 'Saturn'} planetPositionsRef={planetPositionsRef as any} showNames={showNames} showOrbits={showOrbits} />
        )}

        {showNames && (
          <Html position={[0, 2.4, 0]} center distanceFactor={selectedPlanetName === 'Saturn' ? 14 : 44} className="pointer-events-auto select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet?.('Saturn');
              }}
              className={`rounded-full border tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedPlanetName === 'Saturn'
                  ? 'px-2.5 py-0.5 text-[9px] bg-yellow-950/90 text-yellow-200 border-yellow-400/80 shadow-[0_0_8px_rgba(234,179,8,0.5)] scale-75'
                  : 'px-2 py-0.5 text-[11px] bg-black/80 text-yellow-200 border-yellow-500/40 shadow-[0_0_14px_rgba(234,179,8,0.6)] hover:border-yellow-400 hover:scale-105'
              }`}
            >
              ♄ SATURN
            </button>
          </Html>
        )}
      </group>

      {/* 6. URANUS (Cyan Ice Giant) */}
      <group
        ref={uranusRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet?.('Uranus');
        }}
      >
        <mesh>
          <sphereGeometry args={[1.35, 64, 64]} />
          <primitive object={uranusShaderMaterial} attach="material" />
        </mesh>


        {/* Uranus Vertical Tilted 3D Ring System */}
        <mesh rotation={[Math.PI / 2.2, 0.4, 0]}>
          <ringGeometry args={[1.7, 2.8, 64]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* 3D Moons of Uranus (Titania, Oberon, Ariel, Umbriel, Miranda + Swarm) */}
        {showMoons && (
          <PlanetMoons3DGroup planetName="Uranus" isFocused={selectedPlanetName === 'Uranus'} planetPositionsRef={planetPositionsRef as any} showNames={showNames} showOrbits={showOrbits} />
        )}

        {showNames && (
          <Html position={[0, 1.8, 0]} center distanceFactor={selectedPlanetName === 'Uranus' ? 13 : 48} className="pointer-events-auto select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet?.('Uranus');
              }}
              className={`rounded-full border tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedPlanetName === 'Uranus'
                  ? 'px-2.5 py-0.5 text-[8px] bg-cyan-950/90 text-cyan-200 border-cyan-400/80 shadow-[0_0_8px_rgba(6,182,212,0.5)] scale-75'
                  : 'px-2 py-0.5 text-[11px] bg-black/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_14px_rgba(6,182,212,0.6)] hover:border-cyan-400 hover:scale-105'
              }`}
            >
              ♅ URANUS
            </button>
          </Html>
        )}
      </group>

      {/* 7. NEPTUNE (Ice Giant) */}
      <group
        ref={neptuneRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet?.('Neptune');
        }}
      >
        <mesh>
          <sphereGeometry args={[1.2, 64, 64]} />
          <primitive object={neptuneShaderMaterial} attach="material" />
        </mesh>


        {/* Neptune Faint Icy 3D Ring System */}
        <mesh rotation={[Math.PI / 3, 0.1, 0]}>
          <ringGeometry args={[1.5, 2.4, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* 3D Moons of Neptune (Triton, Nereid, Proteus + Swarm) */}
        {showMoons && (
          <PlanetMoons3DGroup planetName="Neptune" isFocused={selectedPlanetName === 'Neptune'} planetPositionsRef={planetPositionsRef as any} showNames={showNames} showOrbits={showOrbits} />
        )}

        {showNames && (
          <Html position={[0, 1.6, 0]} center distanceFactor={selectedPlanetName === 'Neptune' ? 13 : 50} className="pointer-events-auto select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet?.('Neptune');
              }}
              className={`rounded-full border tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                selectedPlanetName === 'Neptune'
                  ? 'px-2.5 py-0.5 text-[8px] bg-sky-950/90 text-sky-200 border-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.5)] scale-75'
                  : 'px-2 py-0.5 text-[11px] bg-black/80 text-sky-300 border-sky-500/40 shadow-[0_0_14px_rgba(56,189,248,0.6)] hover:border-sky-400 hover:scale-105'
              }`}
            >
              ♆ NEPTUNE
            </button>
          </Html>
        )}
      </group>
    </group>
  );
};
