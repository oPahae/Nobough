import { useEffect, useRef } from 'react';

export default function Loading() {
  const containerRef = useRef(null);
  const liquidRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const variationRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const liquid = liquidRef.current;

    function createParticle() {
      const particle = document.createElement('div');
      const size = Math.random() * 6 + 3;
      particle.className = `particle ${Math.random() > 0.5 ? 'red' : 'pistachio'}`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.position = 'absolute';
      particle.style.left = `${Math.random() * (container.offsetWidth - size)}px`;
      particle.style.bottom = '0px';
      particle.style.animation = `particleFloat ${2 + Math.random() * 2}s ease-out forwards`; // Reduced animation duration

      container.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 3000);
    }

    function animateLiquid(time) {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      variationRef.current += deltaTime * 0.01;
      const skew = Math.sin(variationRef.current) * 2;
      const scaleX = 1 + Math.sin(variationRef.current * 0.7) * 0.03;
      liquid.style.transform = `skewX(${skew}deg) scaleX(${scaleX})`;

      animationRef.current = requestAnimationFrame(animateLiquid);
    }

    function startParticleSystem() {
      createParticle();
      setTimeout(startParticleSystem, 1 + Math.random() * 500);
    }

    startParticleSystem()
    animationRef.current = requestAnimationFrame(animateLiquid);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="logo-container" ref={containerRef}>
      <div className="logo-base"></div>
      <div className="liquid-container">
        <div className="liquid" ref={liquidRef}></div>
      </div>
    </div>
  );
}
