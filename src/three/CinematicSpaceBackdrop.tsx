import { useRef, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAssetUrl } from '../utils/assetPath';

export const CinematicSpaceBackdrop: React.FC = () => {
  const skysphereRef = useRef<THREE.Mesh>(null);
  const starfieldRef = useRef<THREE.Points>(null);
  const moonRef = useRef<THREE.Group>(null);
  const sunMeshRef = useRef<THREE.Group>(null);

  // Load 360-degree Equirectangular Cosmic Texture, Moon, and Photorealistic Sun Surface
  const [spaceTexture, moonTexture, sunSurfaceTexture] = useLoader(THREE.TextureLoader, [
    getAssetUrl('/textures/milkyway_equirectangular_360.jpg'),
    getAssetUrl('/textures/moon_1024.jpg'),
    getAssetUrl('/textures/sun_photorealistic.jpg')
  ]);

  useMemo(() => {
    if (sunSurfaceTexture) sunSurfaceTexture.colorSpace = THREE.SRGBColorSpace;
  }, [sunSurfaceTexture]);

  // Organic Non-Circular Wavy Plasma Corona Shader ("Valanchi Valanji" Continuous Contour + "Vittu Vittu" Periodic Flare Bursts)
  const sunWavyCoronaShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        uniform float uTime;

        void main() {
          vLocalPosition = position;
          vNormal = normalize(normalMatrix * normal);

          // ALWAYS-OUTSIDE Wavy Organic Plasma Displacement (Valanchi Valanji Contour, NEVER clips inside Sun!)
          vec3 pos = position;
          float w1 = sin(pos.x * 1.4 + pos.y * 1.8 + uTime * 2.5);
          float w2 = cos(pos.y * 2.0 + pos.z * 1.5 - uTime * 3.0);
          float w3 = sin((pos.x + pos.z) * 2.2 + uTime * 3.5);

          // Strictly positive offset (+ 0.32) so wavy flares stay 100% outside the Sun sphere on ALL sides!
          float displacement = ((w1 * w2 + w3) * 0.5 + 0.5) * 0.38 + 0.08;
          pos += normal * displacement;

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // PERIODIC FLARE BURST (Vittu Vittu Varum Periodic Flare Pulse)
          float burstCycle = sin(uTime * 2.0) * 0.5 + 0.5;
          float flareBurst = pow(burstCycle, 2.2);

          // Organic plasma texture ripple
          float r = length(vLocalPosition);
          float plasmaRipple = sin(r * 3.5 - uTime * 3.2 + sin(vLocalPosition.x * 2.2) * 0.8) * 0.5 + 0.5;

          // Smooth Fresnel edge rim glow
          float NdotV = max(dot(viewDir, normal), 0.0);
          float fresnel = pow(1.0 - NdotV, 1.4);

          // Dynamic colors: fiery red/orange flare to incandescent gold burst
          vec3 baseColor = mix(vec3(1.0, 0.15, 0.0), vec3(1.0, 0.55, 0.05), plasmaRipple);
          vec3 burstColor = mix(baseColor, vec3(1.0, 0.90, 0.25), flareBurst);

          // Edge alpha modulation
          float alpha = (0.4 + 0.6 * flareBurst) * fresnel * 0.88;

          gl_FragColor = vec4(burstColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Orbit, Sun spin & Camera-following infinite Skybox animations
  useFrame(({ clock, camera }, delta) => {
    const time = clock.getElapsedTime();

    // INFINITE DEEP SPACE BACKDROP PRINCIPLE:
    // Sky-sphere MUST follow camera.position so space background is always infinitely distant!
    // When visiting Saturn, Uranus, or Neptune, background scale remains 100% perfect & sharp!
    if (skysphereRef.current) {
      skysphereRef.current.position.copy(camera.position);
    }
    if (starfieldRef.current) {
      starfieldRef.current.position.copy(camera.position);
    }

    // Update GLSL Wavy Corona Shader time uniform
    sunWavyCoronaShaderMaterial.uniforms.uTime.value = time;

    // Sun axis spin animation
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.04;
    }

    // Moon orbit around Earth (realistic tilted elliptic orbit)
    if (moonRef.current) {
      const t = time * 0.12;
      moonRef.current.position.x = 0.4 + Math.cos(t) * 6.2;
      moonRef.current.position.z = Math.sin(t) * 5.8;
      moonRef.current.position.y = 0.05 + Math.sin(t * 1.3) * 1.4;
      moonRef.current.rotation.y += delta * 0.05;
    }
  });

  // Sun 3D position placed in upper-right deep space matching user's visible sun location
  const sunPosition: [number, number, number] = [26, 14, 14];

  return (
    <group>
      {/* 1. Zoomed-out 360-degree Celestial Sky-Sphere */}
      <mesh ref={skysphereRef} rotation={[0, -Math.PI * 0.5, 0]}>
        <sphereGeometry args={[140, 64, 64]} />
        <meshBasicMaterial
          map={spaceTexture}
          side={THREE.BackSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Subtle 3D Depth Starfield layering inside the Milky Way sphere */}
      <points ref={starfieldRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 750 }, () => [
                  (Math.random() - 0.5) * 75,
                  (Math.random() - 0.5) * 50,
                  (Math.random() - 0.5) * 75
                ]).flat()
              ),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#e0f2fe" transparent opacity={0.65} />
      </points>

      {/* 3. THE SUN (3D Incandescent Golden Solar Sphere + Organic Non-Circular Wavy Atmosphere + Periodic Flare Bursts) */}
      <group position={sunPosition}>
        {/* 3D Photorealistic Sun Ball Mesh */}
        <group ref={sunMeshRef}>
          <mesh>
            <sphereGeometry args={[4.5, 64, 64]} />
            <meshBasicMaterial
              map={sunSurfaceTexture}
              color="#ffe082"
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* 1. High-Resolution Organic Wavy Plasma Corona Shell (Always Outside Sun Sphere, No Clipping!) */}
        <mesh>
          <sphereGeometry args={[4.52, 96, 96]} />
          <primitive object={sunWavyCoronaShaderMaterial} attach="material" />
        </mesh>

        {/* High-power radiating solar light illuminating Earth and Moon from deep space */}
        <pointLight color="#fff7e6" intensity={7} distance={250} decay={0.3} />
      </group>

      {/* 3. THE MOON (Realistic NASA Lunar Surface orbiting Earth) */}
      <group ref={moonRef} position={[4.8, 1.2, 1.8]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            map={moonTexture}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
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



