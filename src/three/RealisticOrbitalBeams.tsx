import { useMemo } from 'react';
import * as THREE from 'three';
import { TECH_NODES_OVERLAY } from '../data/overlayData';

interface RealisticOrbitProps {
  nodePositions: Record<string, [number, number, number]>;
}

export const RealisticOrbitalBeams: React.FC<RealisticOrbitProps> = ({ nodePositions }) => {
  const { lineGeometries } = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];


    const globeCenter = new THREE.Vector3(0.4, 0.1, 0);

    TECH_NODES_OVERLAY.forEach((node, idx) => {
      const targetPosArr = nodePositions[node.id];
      if (!targetPosArr) return;

      const targetPos = new THREE.Vector3(...targetPosArr);
      const dir = targetPos.clone().sub(globeCenter).normalize();
      const startPoint = globeCenter.clone().add(dir.multiplyScalar(2.48));

      const midPoint = startPoint.clone().lerp(targetPos, 0.5);
      midPoint.z += 0.45;
      midPoint.y += idx % 2 === 0 ? 0.3 : -0.3;

      const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, targetPos);
      const curvePoints = curve.getPoints(40);

      const geom = new THREE.BufferGeometry().setFromPoints(curvePoints);
      lines.push(geom);
    });

    return {
      lineGeometries: lines
    };
  }, [nodePositions]);



  // Major Celestial Orbit Ring 1 (Cyan)
  const ringGeom1 = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 160;
    for (let i = 0; i <= count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * 4.3 + 0.4,
          Math.sin(a) * 2.2 + 0.1,
          Math.sin(a) * 1.5
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Major Celestial Orbit Ring 2 (Purple)
  const ringGeom2 = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 160;
    for (let i = 0; i <= count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * 3.4 + 0.4,
          Math.sin(a) * 3.6 + 0.1,
          Math.cos(a) * 1.8
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);


  return (
    <group>

      <primitive
        object={
          new THREE.Line(
            ringGeom1,
            new THREE.LineBasicMaterial({
              color: '#38bdf8',
              transparent: true,
              opacity: 0.45,
              blending: THREE.AdditiveBlending
            })
          )
        }
      />

      <primitive
        object={
          new THREE.Line(
            ringGeom2,
            new THREE.LineBasicMaterial({
              color: '#c084fc',
              transparent: true,
              opacity: 0.35,
              blending: THREE.AdditiveBlending
            })
          )
        }
      />

      {lineGeometries.map((geom, idx) => (
        <primitive
          key={idx}
          object={
            new THREE.Line(
              geom,
              new THREE.LineBasicMaterial({
                color: idx % 2 === 0 ? '#38bdf8' : '#a855f7',
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending
              })
            )
          }
        />
      ))}
    </group>
  );
};

