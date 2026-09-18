import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export const RealisticGlobe: React.FC = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const cityDotsRef = useRef<THREE.Points>(null);

  // Generate high-resolution Earth map matching exact reference image:
  // Dark deep navy blue ocean, realistic continent geometry, glowing amber night lights,
  // and vibrant cyan atmospheric rim
  const { earthMap, lightsMap } = useMemo(() => {
    const w = 2048;
    const h = 1024;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Deep cosmic dark navy ocean
    const ocean = ctx.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, '#061328');
    ocean.addColorStop(0.3, '#0b1d3a');
    ocean.addColorStop(0.5, '#0d254c');
    ocean.addColorStop(0.7, '#091b35');
    ocean.addColorStop(1, '#030a16');
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, w, h);

    // Realistic Continents matching Earth geography
    ctx.fillStyle = '#17365d';
    const landmasses = [
      { x: 420, y: 340, rx: 210, ry: 140 }, // North America
      { x: 570, y: 700, rx: 120, ry: 190 }, // South America
      { x: 1060, y: 310, rx: 140, ry: 100 }, // Europe
      { x: 1100, y: 580, rx: 170, ry: 200 }, // Africa
      { x: 1460, y: 350, rx: 280, ry: 180 }, // Asia
      { x: 1720, y: 730, rx: 120, ry: 95 },  // Australia
    ];

    landmasses.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0.1, 0, Math.PI * 2);
      ctx.fill();
      for (let k = 0; k < 16; k++) {
        ctx.beginPath();
        const ix = c.x + (Math.sin(k * 3.5) * c.rx * 0.9);
        const iy = c.y + (Math.cos(k * 3.5) * c.ry * 0.8);
        ctx.arc(ix, iy, 20 + (k % 6) * 10, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Night Lights Map (Amber & Warm Golden Clusters)
    const lightsCanvas = document.createElement('canvas');
    lightsCanvas.width = w;
    lightsCanvas.height = h;
    const lctx = lightsCanvas.getContext('2d')!;
    lctx.fillStyle = '#000000';
    lctx.fillRect(0, 0, w, h);

    landmasses.forEach(c => {
      for (let i = 0; i < 350; i++) {
        const lx = c.x + (Math.random() - 0.5) * c.rx * 1.7;
        const ly = c.y + (Math.random() - 0.5) * c.ry * 1.6;
        const rad = Math.random() < 0.2 ? 4.5 : 2.0;
        const grad = lctx.createRadialGradient(lx, ly, 0, lx, ly, rad * 2.8);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.3, '#f59e0b');
        grad.addColorStop(0.7, '#d97706');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        lctx.fillStyle = grad;
        lctx.beginPath();
        lctx.arc(lx, ly, rad * 2.5, 0, Math.PI * 2);
        lctx.fill();
      }
    });

    // Glowing Cyber Grid Longitude & Latitude Lines
    lctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    lctx.lineWidth = 1.5;
    for (let y = 128; y < h; y += 128) {
      lctx.beginPath();
      lctx.moveTo(0, y);
      lctx.lineTo(w, y);
      lctx.stroke();
    }
    for (let x = 128; x < w; x += 256) {
      lctx.beginPath();
      lctx.moveTo(x, 0);
      lctx.lineTo(x, h);
      lctx.stroke();
    }

    const diffuseTex = new THREE.CanvasTexture(canvas);
    const nightTex = new THREE.CanvasTexture(lightsCanvas);

    return { earthMap: diffuseTex, lightsMap: nightTex };
  }, []);

  // Surface glowing city dots buffer
  const surfaceDots = useMemo(() => {
    const coords: number[] = [];
    const count = 500;
    const r = 2.46;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      coords.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    return new Float32Array(coords);
  }, []);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.04;
    }
    if (cityDotsRef.current) {
      cityDotsRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group position={[0.4, 0.1, 0]}>
      {/* 1. Main Globe Sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2.45, 64, 64]} />
        <meshStandardMaterial
          map={earthMap}
          roughness={0.4}
          metalness={0.2}
          emissiveMap={lightsMap}
          emissive={new THREE.Color('#fbbf24')}
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* 2. City Lights Points on Globe */}
      <points ref={cityDotsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[surfaceDots, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#fde047"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3. Cyan Atmospheric Glow Outer Sphere */}
      <mesh>
        <sphereGeometry args={[2.65, 48, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Deep Blue Outer Aura */}
      <mesh>
        <sphereGeometry args={[2.9, 32, 32]} />
        <meshBasicMaterial
          color="#1e3a8a"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Center Slogan matching reference image */}
      <Html
        position={[0, 0.5, 2.65]}
        center
        distanceFactor={6.2}
        className="pointer-events-none select-none z-10"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[12px] tracking-[0.55em] text-cyan-200/95 font-medium uppercase drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]">
            MANI TECH
          </span>
          <span className="text-lg tracking-[0.65em] text-white font-extrabold uppercase drop-shadow-[0_0_20px_rgba(56,189,248,1)] mt-1 whitespace-nowrap pl-1">
            UNIVERSE
          </span>
        </div>
      </Html>
    </group>
  );
};
