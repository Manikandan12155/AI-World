export interface DwarfPlanetData {
  name: string;
  radius: number;          // distance from Sun in scene units
  size: number;            // 3D visual sphere radius
  color: string;
  speed: number;           // orbital speed
  incline: number;         // orbital inclination angle
  description: string;
  orbitAngleOffset: number;// fixed initial orbital angle position
  isEllipsoid?: boolean;   // e.g. Haumea fast-spinning rugby ball shape
  dayTexture?: string;     // photorealistic surface texture map path
}

export const DWARF_PLANETS_DATA: DwarfPlanetData[] = [
  {
    name: 'Pluto',
    radius: 145.0,
    size: 0.52,
    color: '#e2e8f0',
    speed: 0.008,
    incline: 0.28,
    description: 'Famous icy dwarf planet with heart-shaped Tombaugh Regio glacier',
    orbitAngleOffset: 1.1,
    dayTexture: '/textures/Pluto Day.jpg',
  },
  {
    name: 'Ceres',
    radius: 48.5, // Situated inside the Main Asteroid Belt between Mars and Jupiter!
    size: 0.38,
    color: '#a1a1aa',
    speed: 0.016,
    incline: 0.18,
    description: 'Largest object in the Asteroid Belt; ocean world dwarf planet',
    orbitAngleOffset: 2.5,
    dayTexture: '/textures/Ceres Day.jpg',
  },
  {
    name: 'Eris',
    radius: 165.0,
    size: 0.48,
    color: '#cbd5e1',
    speed: 0.006,
    incline: 0.42,
    description: 'Massive trans-Neptunian icy dwarf planet beyond Kuiper Belt',
    orbitAngleOffset: 4.2,
    dayTexture: '/textures/Eris Day.jpg',
  },
  {
    name: 'Haumea',
    radius: 154.0,
    size: 0.42,
    color: '#f1f5f9',
    speed: 0.007,
    incline: 0.35,
    description: 'Fast-spinning elongated rugby-ball shaped icy dwarf planet with rings',
    orbitAngleOffset: 3.4,
    isEllipsoid: true,
    dayTexture: '/textures/Haumea Day.jpg',
  },
  {
    name: 'Makemake',
    radius: 158.0,
    size: 0.45,
    color: '#fca5a5',
    speed: 0.007,
    incline: 0.32,
    description: 'Reddish-brown icy Kuiper Belt dwarf planet with methane snow',
    orbitAngleOffset: 5.6,
    dayTexture: '/textures/Makemake Day.jpg',
  }
];
