import React, { useState, useEffect, useRef } from 'react';
import { Dice5, Sparkles, RefreshCw, Shield } from 'lucide-react';

type Rarity = 'Comum' | 'Raro' | 'Lendário' | 'Divino';

interface Clan {
  name: string;
  rarity: Rarity;
  color: string;
  description: string;
}

const CLANS: Clan[] = [
  { name: 'Akimichi', rarity: 'Comum', color: '#fbbf24', description: 'Mestres da expansão corporal.' },
  { name: 'Inuzuka', rarity: 'Comum', color: '#a16207', description: 'Lutam ao lado de companheiros caninos.' },
  { name: 'Aburame', rarity: 'Comum', color: '#4b5563', description: 'Controladores de insetos.' },
  { name: 'Nara', rarity: 'Raro', color: '#10b981', description: 'Estrategistas das sombras.' },
  { name: 'Yamanaka', rarity: 'Raro', color: '#f472b6', description: 'Técnicas de controle mental.' },
  { name: 'Sarutobi', rarity: 'Raro', color: '#ef4444', description: 'Domínio dos 5 elementos.' },
  { name: 'Hyuga', rarity: 'Lendário', color: '#a855f7', description: 'Olhos que tudo veem (Byakugan).' },
  { name: 'Uchiha', rarity: 'Lendário', color: '#b91c1c', description: 'O clã do fogo e do Sharingan.' },
  { name: 'Senju', rarity: 'Lendário', color: '#16a34a', description: 'A força da floresta e vitalidade.' },
  { name: 'Uzumaki', rarity: 'Lendário', color: '#f97316', description: 'Reservas imensas de Chakra e selamentos.' },
  { name: 'Otsutsuki', rarity: 'Divino', color: '#ffffff', description: 'Seres celestiais, a origem do Chakra.' },
];

const RARITY_COLORS: Record<Rarity, string> = {
  'Comum': 'border-gray-500 text-gray-300 shadow-gray-500/20',
  'Raro': 'border-blue-500 text-blue-400 shadow-blue-500/40',
  'Lendário': 'border-red-600 text-red-500 shadow-red-600/60',
  'Divino': 'border-yellow-300 text-yellow-200 shadow-yellow-300/80 bg-white/5',
};

interface ClanSpinsProps {
  isDiscordView?: boolean;
}

const ClanSpins: React.FC<ClanSpinsProps> = ({ isDiscordView = false }) => {
  const [spins, setSpins] = useState(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayClan, setDisplayClan] = useState<Clan>(CLANS[0]);
  const [history, setHistory] = useState<Clan[]>([]);
  const [message, setMessage] = useState("Tente a sorte, Shinobi!");
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getRandomClan = (): Clan => {
    const rand = Math.random() * 100;
    let pool: Clan[] = [];
    
    if (rand > 99) pool = CLANS.filter(c => c.rarity === 'Divino');
    else if (rand > 90) pool = CLANS.filter(c => c.rarity === 'Lendário');
    else if (rand > 60) pool = CLANS.filter(c => c.rarity === 'Raro');
    else pool = CLANS.filter(c => c.rarity === 'Comum');

    if (pool.length === 0) pool = CLANS.filter(c => c.rarity === 'Comum');
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const handleSpin = () => {
    if (spins <= 0 || isSpinning) return;

    setIsSpinning(true);
    setSpins(prev => prev - 1);
    setMessage("Concentrando chakra...");

    let counter = 0;
    const maxIterations = 25;
    const intervalSpeed = 100;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayClan(CLANS[Math.floor(Math.random() * CLANS.length)]);
      counter++;

      if (counter >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const result = getRandomClan();
        setDisplayClan(result);
        setIsSpinning(false);
        setHistory(prev => [result, ...prev].slice(0, 5));
        
        if (result.rarity === 'Divino') setMessage("INCRÍVEL! UMA LINHAGEM DIVINA!");
        else if (result.rarity === 'Lendário') setMessage("Uma lenda renasce!");
        else setMessage(`Você obteve o clã ${result.name}.`);
      }
    }, intervalSpeed);
  };

  return (
    <div className={`px-4 flex flex-col items-center relative z-10 ${isDiscordView ? 'pt-4 pb-4 w-full' : 'pt-24 pb-12 min-h-screen'}`}>
      
      {/* Esconde o cabeçalho grande no modo Discord para economizar espaço */}
      <div className={`text-center mb-6 animate-fade-in-up ${isDiscordView ? 'mt-2' : ''}`}>
        <h2 className={`${isDiscordView ? 'text-3xl' : 'text-5xl'} font-bold anime-font text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 filter drop-shadow-[0_0_10px_rgba(234,88,12,0.5)]`}>
          Sorteio de Clã
        </h2>
        {!isDiscordView && <p className="text-gray-400 mt-2">Defina seu destino ninja.</p>}
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Spinner Machine */}
        <div className={`bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden group ${isDiscordView ? 'min-h-[350px]' : ''}`}>
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-${displayClan.color}/10 opacity-50 transition-colors duration-500`} />
            
            <div className="relative z-10 text-center w-full">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Dice5 className="w-6 h-6 text-orange-500" />
                    <span className="text-xl font-bold text-white">Spins: <span className="text-orange-500 text-2xl">{spins}</span></span>
                </div>

                <div className={`
                    w-full aspect-[3/4] ${isDiscordView ? 'max-h-[200px]' : 'max-h-[400px]'} rounded-xl border-4 flex flex-col items-center justify-center p-4 transition-all duration-300 transform
                    ${isSpinning ? 'scale-95 opacity-90 blur-[1px]' : 'scale-100 opacity-100'}
                    ${RARITY_COLORS[displayClan.rarity]}
                    bg-gray-900/80 shadow-[0_0_30px_rgba(0,0,0,0.5)]
                `}>
                    <span className="uppercase tracking-[0.5em] text-[10px] font-bold mb-2 opacity-70">{displayClan.rarity}</span>
                    <h3 
                        className={`${isDiscordView ? 'text-4xl' : 'text-5xl md:text-6xl'} font-black anime-font mb-2 transition-colors duration-300`} 
                        style={{ color: displayClan.color, textShadow: `0 0 20px ${displayClan.color}` }}
                    >
                        {displayClan.name}
                    </h3>
                    <div className="w-16 h-1 bg-current opacity-50 mb-4 rounded-full"></div>
                    <p className="text-xs md:text-sm text-gray-300 font-roboto max-w-xs line-clamp-3">
                        {displayClan.description}
                    </p>
                    {displayClan.rarity === 'Divino' && <Sparkles className="w-6 h-6 mt-2 animate-spin-slow text-yellow-200" />}
                </div>
            </div>

            <div className="relative z-10 mt-6 w-full">
                <button
                    onClick={handleSpin}
                    disabled={isSpinning || spins <= 0}
                    className={`
                        w-full py-3 px-4 rounded-lg font-black uppercase tracking-widest text-lg transition-all
                        ${spins > 0 && !isSpinning 
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] transform hover:-translate-y-1' 
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                    `}
                >
                    {isSpinning ? '...' : spins === 0 ? '0 Spins' : 'Girar'}
                </button>
                <p className="mt-2 text-center text-xs text-orange-300 h-4 truncate">{message}</p>
            </div>
        </div>

        {/* History / Rates Panel */}
        <div className="space-y-4">
             {/* Rates */}
             <div className="bg-gray-900/80 backdrop-blur border border-white/10 rounded-xl p-4">
                <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" /> Probabilidades
                </h4>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-gray-400"><span className="text-gray-300 font-bold">Comum</span> <span>60%</span></div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="bg-gray-500 h-1.5 rounded-full" style={{width: '60%'}}></div></div>
                    
                    <div className="flex justify-between items-center text-blue-400"><span className="font-bold">Raro</span> <span>30%</span></div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: '30%'}}></div></div>
                    
                    <div className="flex justify-between items-center text-red-500"><span className="font-bold">Lendário</span> <span>9%</span></div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="bg-red-600 h-1.5 rounded-full" style={{width: '9%'}}></div></div>

                    <div className="flex justify-between items-center text-yellow-400"><span className="font-bold">Divino</span> <span>1%</span></div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="bg-yellow-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{width: '1%'}}></div></div>
                </div>
             </div>

             {/* History */}
             <div className="bg-gray-900/80 backdrop-blur border border-white/10 rounded-xl p-4 flex-1">
                <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-green-400" /> Histórico
                </h4>
                <div className="space-y-2">
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-xs italic">Vazio...</p>
                    ) : (
                        history.map((clan, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-6 rounded-full" style={{backgroundColor: clan.color}}></div>
                                    <div>
                                        <div className="text-white font-bold text-xs">{clan.name}</div>
                                        <div className="text-[9px] uppercase tracking-wider text-gray-400">{clan.rarity}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default ClanSpins;
