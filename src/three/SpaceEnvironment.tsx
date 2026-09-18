import { useMemo } from 'react';

export const SpaceEnvironment: React.FC = () => {
  // Floating background space asteroids / rocks
  const asteroids = useMemo(() => {
    return [
      // Left side asteroids
      { pos: [-4.8, -1.8, -1.5], scale: 0.42, rot: [0.3, 0.4, 0.1] },
      { pos: [-4.2, -2.8, -0.8], scale: 0.32, rot: [0.8, 0.2, 0.5] },
      { pos: [-3.8, 2.8, -2.0], scale: 0.28, rot: [0.1, 0.6, 0.2] },
      { pos: [-2.6, 3.2, -1.8], scale: 0.22, rot: [0.5, 0.1, 0.4] },
      // Right side space rocks
      { pos: [5.2, 1.8, -1.2], scale: 0.55, rot: [0.4, 0.8, 0.3] },
      { pos: [4.9, -1.5, -0.8], scale: 0.38, rot: [0.2, 0.3, 0.7] },
      { pos: [4.4, -2.7, -1.4], scale: 0.48, rot: [0.6, 0.5, 0.2] },
      // Distant celestial moon sphere
      { pos: [3.2, -1.8, -3.5], scale: 0.6, rot: [0, 0, 0], isMoon: true },
      { pos: [-2.8, -1.4, -3.2], scale: 0.5, rot: [0, 0, 0], isMoon: true }
    ];
  }, []);

  const starPositions = useMemo(() => {
    const coords: number[] = [];
    const count = 900;
    for (let i = 0; i < count; i++) {
      coords.push(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 20,
        -5 - Math.random() * 12
      );
    }
    return new Float32Array(coords);
  }, []);

  return (
    <group>
      {/* Distant Deep Space Starfield */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#e2e8f0"
          transparent
          opacity={0.8}
        />
      </points>

      {/* Floating Space Asteroids / Planetary Objects matching reference */}
      {asteroids.map((ast, idx) => (
        <group key={idx} position={ast.pos as [number, number, number]}>
          <mesh rotation={ast.rot as [number, number, number]}>
            {ast.isMoon ? (
              <sphereGeometry args={[ast.scale, 24, 24]} />
            ) : (
              <dodecahedronGeometry args={[ast.scale, 1]} />
            )}
            <meshStandardMaterial
              color={ast.isMoon ? '#1e293b' : '#334155'}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Ambient & Directional Lighting matching reference image */}
      <ambientLight intensity={0.4} color="#0d1b2a" />
      <directionalLight
        position={[-6, 5, 6]}
        intensity={2.6}
        color="#e0f2fe"
      />
      <directionalLight
        position={[6, -4, -4]}
        intensity={1.2}
        color="#c084fc"
      />
      <pointLight position={[0, -5, 2]} intensity={1.8} color="#0284c7" distance={15} />
    </group>
  );
};
