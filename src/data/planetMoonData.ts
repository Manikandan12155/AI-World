export interface MoonData {
  name: string;
  isNamed: boolean;
  radiusOffset: number; // distance from planet center in 3D scene units
  speed: number;        // orbit speed
  size: number;         // visual sphere radius
  color: string;
  description?: string;
  incline?: number;     // orbital inclination angle
  dayTexture?: string;  // high resolution day texture
  nightTexture?: string; // high resolution night texture
}

export interface PlanetMoonSystemData {
  planetName: string;
  totalMoons: number;
  namedMoonsCount: number;
  unnamedMoonsCount: number;
  autonomousMoonsCount?: number;
  majorMoons: MoonData[];
  remainingMoonsCount: number;
  autonomousSwarmCount?: number;
}

export const PLANET_MOONS_DATA: Record<string, PlanetMoonSystemData> = {
  Earth: {
    planetName: 'Earth',
    totalMoons: 1,
    namedMoonsCount: 1,
    unnamedMoonsCount: 0,
    majorMoons: [
      {
        name: 'The Moon (Luna)',
        isNamed: true,
        radiusOffset: 3.6,
        speed: 0.08,
        size: 0.55,
        color: '#e2e8f0',
        description: 'Earth\'s only natural satellite',
        incline: 0.1,
        dayTexture: '/textures/Moon Day.png',
        nightTexture: '/textures/Moon Night.png'
      }
    ],
    remainingMoonsCount: 0
  },
  Mars: {
    planetName: 'Mars',
    totalMoons: 2,
    namedMoonsCount: 2,
    unnamedMoonsCount: 0,
    majorMoons: [
      {
        name: 'Phobos',
        isNamed: true,
        radiusOffset: 1.35,
        speed: 0.18,
        size: 0.16,
        color: '#a8a29e',
        description: 'Larger inner Martian moon',
        incline: 0.15,
        dayTexture: '/textures/Phobos Day.jpg'
      },
      {
        name: 'Deimos',
        isNamed: true,
        radiusOffset: 2.1,
        speed: 0.11,
        size: 0.12,
        color: '#78716c',
        description: 'Smaller outer Martian moon',
        incline: -0.2,
        dayTexture: '/textures/Deimos Day.jpg'
      }
    ],
    remainingMoonsCount: 0
  },
  Jupiter: {
    planetName: 'Jupiter',

    totalMoons: 95,

    // Moons with official names
    namedMoonsCount: 57,

    // Moons that do not yet have official names
    unnamedMoonsCount: 38,

    majorMoons: [
      {
        name: 'Ganymede',
        isNamed: true,
        radiusOffset: 3.6,
        speed: 0.09,
        size: 0.32,
        color: '#cbd5e1',
        description: 'Largest moon in the Solar System',
        incline: 0.05,
        dayTexture: '/textures/Ganymede Day.jpg'
      },
      {
        name: 'Callisto',
        isNamed: true,
        radiusOffset: 4.8,
        speed: 0.06,
        size: 0.28,
        color: '#94a3b8',
        description: 'Heavily cratered ice moon',
        incline: -0.1,
        dayTexture: '/textures/Callisto Day.jpg'
      },
      {
        name: 'Io',
        isNamed: true,
        radiusOffset: 2.7,
        speed: 0.16,
        size: 0.24,
        color: '#fef08a',
        description: 'Most volcanically active body',
        incline: 0.12,
        dayTexture: '/textures/Io Day.jpg'
      },
      {
        name: 'Europa',
        isNamed: true,
        radiusOffset: 3.1,
        speed: 0.12,
        size: 0.22,
        color: '#e0f2fe',
        description: 'Subsurface liquid water ocean',
        incline: -0.08,
        dayTexture: '/textures/Europa Day.jpg'
      },
      {
        name: 'Amalthea',
        isNamed: true,
        radiusOffset: 2.3,
        speed: 0.20,
        size: 0.12,
        color: '#f87171',
        description: 'Inner reddish irregular moon',
        incline: 0.2,
        dayTexture: '/textures/Amalthea Day.jpg'
      }
    ],

    // 95 total - 5 displayed major moons
    remainingMoonsCount: 90
  },
  Saturn: {
    planetName: 'Saturn',

    totalMoons: 293,

    // Named moons vs currently unnamed/designated moons
    namedMoonsCount: 63,
    unnamedMoonsCount: 230,

    majorMoons: [
      {
        name: 'Titan',
        isNamed: true,
        radiusOffset: 4.5,
        speed: 0.08,
        size: 0.34,
        color: '#d6a85f',
        description: 'Largest moon of Saturn and the second-largest moon in the Solar System',
        incline: 0.02,
        dayTexture: '/textures/Titan Day.jpg'
      },
      {
        name: 'Rhea',
        isNamed: true,
        radiusOffset: 3.7,
        speed: 0.11,
        size: 0.22,
        color: '#b8b8b8',
        description: 'Second-largest moon of Saturn',
        incline: 0.01,
        dayTexture: '/textures/Rhea Day.jpg'
      },
      {
        name: 'Iapetus',
        isNamed: true,
        radiusOffset: 5.5,
        speed: 0.05,
        size: 0.18,
        color: '#8c8175',
        description: 'Two-toned outer moon of Saturn',
        incline: 0.25,
        dayTexture: '/textures/Iapetus Day.jpg'
      },
      {
        name: 'Dione',
        isNamed: true,
        radiusOffset: 3.1,
        speed: 0.14,
        size: 0.17,
        color: '#cbd5e1',
        description: 'Icy moon with bright wispy terrain',
        incline: 0.02,
        dayTexture: '/textures/Dione Day.jpg'
      },
      {
        name: 'Tethys',
        isNamed: true,
        radiusOffset: 2.8,
        speed: 0.16,
        size: 0.16,
        color: '#d1d5db',
        description: 'Icy moon with the huge Odysseus crater',
        incline: 0.01,
        dayTexture: '/textures/Tethys Day.jpg'
      },
      {
        name: 'Enceladus',
        isNamed: true,
        radiusOffset: 2.5,
        speed: 0.19,
        size: 0.14,
        color: '#f8fafc',
        description: 'Icy moon with an underground ocean and water-ice plumes',
        incline: 0.01,
        dayTexture: '/textures/Enceladus Day.jpg'
      },
      {
        name: 'Mimas',
        isNamed: true,
        radiusOffset: 2.3,
        speed: 0.21,
        size: 0.11,
        color: '#bfc5cc',
        description: 'Small icy moon famous for its giant Herschel crater',
        incline: 0.01,
        dayTexture: '/textures/Mimas Day.jpg'
      },
      {
        name: 'Hyperion',
        isNamed: true,
        radiusOffset: 4.6,
        speed: 0.07,
        size: 0.10,
        color: '#8f8277',
        description: 'Irregular sponge-like moon',
        incline: 0.15,
        dayTexture: '/textures/Hyperion Day.jpg'
      }
    ],

    // 293 total - 8 major moons displayed
    remainingMoonsCount: 285
  },
  Uranus: {
    planetName: 'Uranus',
    totalMoons: 27,
    namedMoonsCount: 27,
    unnamedMoonsCount: 0,
    majorMoons: [
      {
        name: 'Titania',
        isNamed: true,
        radiusOffset: 2.6,
        speed: 0.09,
        size: 0.22,
        color: '#e2e8f0',
        description: 'Largest Uranian moon',
        incline: 0.1,
        dayTexture: '/textures/Titania Day.jpg'
      },
      {
        name: 'Oberon',
        isNamed: true,
        radiusOffset: 3.2,
        speed: 0.07,
        size: 0.20,
        color: '#cbd5e1',
        description: 'Outer major moon',
        incline: -0.15,
        dayTexture: '/textures/Oberon Day.jpg'
      },
      {
        name: 'Ariel',
        isNamed: true,
        radiusOffset: 2.1,
        speed: 0.13,
        size: 0.16,
        color: '#f1f5f9',
        description: 'Brightest Uranian moon',
        incline: 0.08,
        dayTexture: '/textures/Ariel Day.jpg'
      },
      {
        name: 'Umbriel',
        isNamed: true,
        radiusOffset: 2.35,
        speed: 0.11,
        size: 0.16,
        color: '#64748b',
        description: 'Dark cratered moon',
        incline: -0.05,
        dayTexture: '/textures/Umbriel Day.jpg'
      },
      {
        name: 'Miranda',
        isNamed: true,
        radiusOffset: 1.7,
        speed: 0.18,
        size: 0.13,
        color: '#94a3b8',
        description: 'Extreme ice canyon topography',
        incline: 0.25,
        dayTexture: '/textures/Miranda Day.jpg'
      }
    ],
    remainingMoonsCount: 22
  },
  Neptune: {
    planetName: 'Neptune',
    totalMoons: 16,
    namedMoonsCount: 14,
    unnamedMoonsCount: 2,
    majorMoons: [
      {
        name: 'Triton',
        isNamed: true,
        radiusOffset: 2.5,
        speed: -0.09,
        size: 0.28,
        color: '#bae6fd',
        description: 'Largest moon of Neptune; retrograde orbit',
        incline: -0.4,
        dayTexture: '/textures/Triton Day.jpg'
      },
      {
        name: 'Nereid',
        isNamed: true,
        radiusOffset: 3.8,
        speed: 0.05,
        size: 0.14,
        color: '#94a3b8',
        description: 'Highly eccentric irregular moon',
        incline: 0.3,
        dayTexture: '/textures/Nereid Day.jpg'
      },
      {
        name: 'Proteus',
        isNamed: true,
        radiusOffset: 1.8,
        speed: 0.15,
        size: 0.16,
        color: '#64748b',
        description: 'Large irregularly shaped moon',
        incline: 0.05,
        dayTexture: '/textures/Proteus Day.jpg'
      }
    ],
    remainingMoonsCount: 13
  },
  Mercury: {
    planetName: 'Mercury',
    totalMoons: 0,
    namedMoonsCount: 0,
    unnamedMoonsCount: 0,
    majorMoons: [],
    remainingMoonsCount: 0
  },
  Venus: {
    planetName: 'Venus',
    totalMoons: 0,
    namedMoonsCount: 0,
    unnamedMoonsCount: 0,
    majorMoons: [],
    remainingMoonsCount: 0
  }
};
