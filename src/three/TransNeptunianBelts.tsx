import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SUN_POS = new THREE.Vector3(26, 14, 14);

// Orthonormal orbital plane vectors
const U = new THREE.Vector3(-0.7896, -0.4303, -0.4318);
const V = new THREE.Vector3(0.5661, -0.2512, -0.7853);

// ❄️ 1. Trans-Neptunian Kuiper Belt (Instanced Icy Bodies orbiting beyond Neptune R = 145 - 175)
export const KuiperBelt3D: React.FC<{ isSolarMode?: boolean }> = ({ isSolarMode = false }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const count = 180;
    return Array.from({ length: count }, () => {
      const radius = 145.0 + Math.random() * 32.0;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 8.0;
      const scale = 0.22 + Math.random() * 0.45;
      const orbitSpeed = 0.003 + Math.random() * 0.005;
      return { radius, angle, yOffset, scale, orbitSpeed };
    });
  }, []);

  const geo = useMemo(() => new THREE.DodecahedronGeometry(0.8, 0), []);

  useFrame((_, delta) => {
    if (!meshRef.current || !isSolarMode) return;

    particles.forEach((p, idx) => {
      p.angle += delta * p.orbitSpeed;
      const cosT = Math.cos(p.angle);
      const sinT = Math.sin(p.angle);

      dummy.position.set(
        SUN_POS.x + (U.x * cosT + V.x * sinT) * p.radius,
        SUN_POS.y + (U.y * cosT + V.y * sinT) * p.radius + p.yOffset,
        SUN_POS.z + (U.z * cosT + V.z * sinT) * p.radius
      );

      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!isSolarMode) return null;

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, particles.length]}>
      <meshStandardMaterial
        color="#bae6fd"
        roughness={0.4}
        metalness={0.2}
      />
    </instancedMesh>
  );
};

// ☁️ 2. Outer Oort Cloud (Spherical Icy Particle Reservoir Enveloping Deep Space Boundary R = 210)
export const OortCloud3D: React.FC<{ isSolarMode?: boolean }> = ({ isSolarMode = false }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 450;
    const pts = new Float32Array(count * 3);
    const radius = 210.0;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius + (Math.random() - 0.5) * 25.0;

      pts[i * 3] = SUN_POS.x + r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = SUN_POS.y + r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = SUN_POS.z + r * Math.cos(phi);
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.002;
    }
  });

  if (!isSolarMode) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        color="#e0f2fe"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
