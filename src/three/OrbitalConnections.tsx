import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TECHNOLOGY_NODES } from '../data/technologyData';

export const OrbitalConnections: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate glowing 3D spline curves from central Earth to each island
  const { lineGeometries, particlePositions } = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    const particles: number[] = [];

    TECHNOLOGY_NODES.forEach((node, idx) => {
      const globeCenter = new THREE.Vector3(0.2, -0.1, 0);
      const targetPos = new THREE.Vector3(...node.position);

      const dir = targetPos.clone().sub(globeCenter).normalize();
      const startPoint = globeCenter.clone().add(dir.multiplyScalar(2.02));

      const midPoint = startPoint.clone().lerp(targetPos, 0.5);
      midPoint.z += 0.3;
      midPoint.y += idx % 2 === 0 ? 0.2 : -0.2;

      const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, targetPos);
      const curvePoints = curve.getPoints(32);

      const geom = new THREE.BufferGeometry().setFromPoints(curvePoints);
      lines.push(geom);

      for (let p = 0; p < 4; p++) {
        const pt = curve.getPoint((p / 4 + idx * 0.1) % 1);
        particles.push(pt.x, pt.y, pt.z);
      }
    });

    return {
      lineGeometries: lines,
      particlePositions: new Float32Array(particles)
    };
  }, []);

  const orbitRingPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 128;
    for (let i = 0; i <= count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * 3.6 + 0.2,
          Math.sin(angle) * 1.8 - 0.1,
          Math.sin(angle) * 1.2
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const secondaryRingPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 128;
    for (let i = 0; i <= count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * 2.8 + 0.2,
          Math.sin(angle) * 2.9 - 0.1,
          Math.cos(angle) * 1.5
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Primary Glowing Orbital Ellipse */}
      <primitive
        object={
          new THREE.Line(
            orbitRingPoints,
            new THREE.LineBasicMaterial({
              color: '#38bdf8',
              transparent: true,
              opacity: 0.35,
              blending: THREE.AdditiveBlending
            })
          )
        }
      />

      {/* Secondary Inclined Purple Orbit Line */}
      <primitive
        object={
          new THREE.Line(
            secondaryRingPoints,
            new THREE.LineBasicMaterial({
              color: '#818cf8',
              transparent: true,
              opacity: 0.25,
              blending: THREE.AdditiveBlending
            })
          )
        }
      />

      {/* Connection Splines from Globe to Floating Islands */}
      {lineGeometries.map((geom, idx) => (
        <primitive
          key={idx}
          object={
            new THREE.Line(
              geom,
              new THREE.LineBasicMaterial({
                color: idx % 2 === 0 ? '#38bdf8' : '#a855f7',
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
              })
            )
          }
        />
      ))}

      {/* Flowing Energy Data Photons */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#67e8f9"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
