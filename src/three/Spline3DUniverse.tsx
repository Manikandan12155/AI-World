import { useState, Suspense, lazy } from 'react';

// Lazy-load Spline so it loads seamlessly with fallback
const Spline = lazy(() => import('@splinetool/react-spline'));

interface Spline3DUniverseProps {
  onLoad?: () => void;
}

export const Spline3DUniverse: React.FC<Spline3DUniverseProps> = ({ onLoad }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // High-fidelity public dark cosmic earth scene from Spline ecosystem
  // (Spline official interactive earth & cyber space scene)
  const splineSceneUrl = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

  if (hasError) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center text-cyan-400 text-xs tracking-widest uppercase">
            <span className="animate-pulse">Initializing Spline 3D Universe Engine...</span>
          </div>
        }
      >
        <Spline
          scene={splineSceneUrl}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => {
            console.warn('Spline scene failed to fetch or render');
            setHasError(true);
          }}
          className={`w-full h-full transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </Suspense>
    </div>
  );
};
