import React, { useRef, useState } from 'react';

interface InteractiveCardProps {
  title: string;
  description: string;
  imageSrc: string;
  color: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ title, description, imageSrc, color }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full h-96 perspective-1000 group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="w-full h-full transition-transform duration-100 ease-out rounded-xl border-2 border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden relative shadow-2xl"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute inset-0">
             <img 
                src={imageSrc} 
                alt={title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300 group-hover:scale-110 transform"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div 
            className="absolute bottom-0 left-0 p-6 w-full translate-z-10"
            style={{ transform: 'translateZ(50px)' }}
        >
          <h3 
            className="text-4xl font-bold text-white mb-2 uppercase anime-font tracking-wider"
            style={{ color: color, textShadow: `0 0 15px ${color}` }}
          >
            {title}
          </h3>
          <p className="text-gray-200 text-sm line-clamp-3 font-roboto">
            {description}
          </p>
          <button 
            className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-gray-200 transition-colors rounded-sm"
          >
            Ver Detalhes
          </button>
        </div>
        
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};

export default InteractiveCard;
