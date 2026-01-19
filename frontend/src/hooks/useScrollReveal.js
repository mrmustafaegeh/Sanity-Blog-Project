import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

/**
 * useScrollReveal
 * A hook that triggers an anime.js animation when an element enters the viewport.
 * Supports "fly-in" directions for more dramatic entrances.
 * 
 * @param {Object} options - Custom animation overrides
 * @param {string} direction - 'left', 'right', 'bottom', 'top' (where it comes FROM)
 * @param {Object} observerOptions - IntersectionObserver options
 */
export const useScrollReveal = (options = {}, direction = 'bottom', observerOptions = { threshold: 0.1 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state based on direction
    const getInitialTransform = () => {
      const distance = 100; // Forceful fly-in distance
      switch (direction) {
        case 'left': return { translateX: [-distance, 0], translateY: [0, 0] };
        case 'right': return { translateX: [distance, 0], translateY: [0, 0] };
        case 'top': return { translateX: [0, 0], translateY: [-distance, 0] };
        case 'bottom':
        default: return { translateX: [0, 0], translateY: [distance, 0] };
      }
    };

    const initial = getInitialTransform();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(element, {
            opacity: [0, 1],
            translateX: initial.translateX,
            translateY: initial.translateY,
            scale: [0.9, 1],
            easing: 'easeOutExpo',
            duration: 1500,
            delay: options.delay || 100,
            ...options,
          });
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Set initial hidden state
    element.style.opacity = '0';

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options, direction, observerOptions]);

  return elementRef;
};
