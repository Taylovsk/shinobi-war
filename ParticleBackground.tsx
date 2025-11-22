import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  velocity: { x: number; y: number; z: number };
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const centerX = width / 2;
    const centerY = height / 2;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const colors = ['#ea580c', '#fbbf24', '#f97316', '#ef4444']; 

    const initParticles = (count: number) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: (Math.random() - 0.5) * width * 2,
          y: (Math.random() - 0.5) * height * 2,
          z: Math.random() * 2000,
          size: Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: Math.random() * 5 + 2,
          },
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        const perspective = 300 / (300 + p.z);
        const x2d = centerX + p.x * perspective;
        const y2d = centerY + p.y * perspective;
        const size2d = p.size * perspective * 2;

        if (size2d > 0) {
          ctx.beginPath();
          ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        p.z -= p.velocity.z;
        p.x += p.velocity.x;
        p.y += p.velocity.y;

        if (p.z <= -290) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    setSize();
    initParticles(400);
    draw();

    window.addEventListener('resize', setSize);

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: 'radial-gradient(circle at center, #1a0505 0%, #000000 100%)' }}
    />
  );
};

export default ParticleBackground;
