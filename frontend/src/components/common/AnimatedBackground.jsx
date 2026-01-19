import React, { useEffect, useRef, useMemo } from 'react';

const AnimatedBackground = () => {
  const nebulaRef = useRef(null);
  const starsRef = useRef(null);
  const scrollRef = useRef({ y: 0, ticking: false });

  // Generate stars once to avoid re-renders
  const stars = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      opacity: Math.random() * 0.5 + 0.3,
      // Random twinkle timing for CSS animation
      duration: Math.random() * 3 + 2 + 's',
      delay: Math.random() * 5 + 's'
    }));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current.y = window.scrollY;
      
      if (!scrollRef.current.ticking) {
        window.requestAnimationFrame(() => {
          const y = scrollRef.current.y;
          
          if (starsRef.current) {
            starsRef.current.style.transform = `translate3d(0, ${-y * 0.08}px, 0)`;
          }
          if (nebulaRef.current) {
            nebulaRef.current.style.transform = `translate3d(0, ${-y * 0.12}px, 0)`;
          }
          
          scrollRef.current.ticking = false;
        });
        
        scrollRef.current.ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#020617]">
      {/* Deep Space Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_#0f172a_0%,_#020617_100%)]" />
      
      {/* Moving Nebulae */}
      <div 
        ref={nebulaRef} 
        className="absolute inset-0 will-change-transform"
      >
        <div className="nebula absolute w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[160px] top-[-10%] left-[-5%] animate-nebula-pulse" />
        <div className="nebula absolute w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[150px] bottom-[10%] right-[-10%] animate-nebula-pulse-delayed" />
        <div className="nebula absolute w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] top-[30%] right-[10%] animate-nebula-pulse" />
        <div className="nebula absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] bottom-[-10%] left-[20%] animate-nebula-pulse-delayed" />
      </div>

      {/* Starfield */}
      <div 
        ref={starsRef} 
        className="absolute inset-0 will-change-transform"
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="star absolute bg-white rounded-full shadow-[0_0_3px_rgba(255,255,255,0.5)] animate-twinkle"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              top: star.top,
              left: star.left,
              opacity: star.opacity,
              animationDuration: star.duration,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      {/* Cosmic Dust Overlay */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-screen pointer-events-none" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes nebula-pulse {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.1) translate(10px, 10px); }
        }
        .animate-twinkle {
          animation: twinkle var(--duration, 3s) ease-in-out infinite;
        }
        .animate-nebula-pulse {
          animation: nebula-pulse 20s ease-in-out infinite alternate;
        }
        .animate-nebula-pulse-delayed {
          animation: nebula-pulse 25s ease-in-out infinite alternate-reverse;
        }
      `}} />
    </div>
  );
};

export default AnimatedBackground;
