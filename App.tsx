import React, { useState, useEffect } from 'react';
import { Menu, MessageSquare, Download, Users, Swords, ChevronDown, Github, Dice5 } from 'lucide-react';
import { DiscordSDK } from "@discord/embedded-app-sdk";
import ParticleBackground from './components/ParticleBackground';
import InteractiveCard from './components/InteractiveCard';
import ChatModal from './components/ChatModal';
import ClanSpins from './components/ClanSpins';

type Tab = 'home' | 'spins';

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID || "");

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isDiscordMode, setIsDiscordMode] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const query = new URLSearchParams(window.location.search);
      const isDiscordEnv = query.get('mode') === 'discord' || window.location.hostname.includes('discordsays.com');
      
      setIsDiscordMode(isDiscordEnv);
      
      if (isDiscordEnv) {
        setActiveTab('spins');
        try {
          await discordSdk.ready();
        } catch (e) {
          // Running locally or outside iframe context
        }
      }
    };

    initApp();

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = (tabName: Tab) => `
    relative text-sm font-bold uppercase tracking-widest hover:text-orange-400 transition-colors group cursor-pointer
    ${activeTab === tabName ? 'text-orange-500' : 'text-white'}
  `;

  if (isDiscordMode) {
    return (
      <div className="h-screen w-full bg-black overflow-hidden relative flex flex-col items-center justify-center">
        <ParticleBackground />
        <div className="w-full h-full overflow-y-auto custom-scrollbar">
            <ClanSpins isDiscordView={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white flex flex-col">
      <ParticleBackground />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled || activeTab !== 'home' ? 'bg-black/90 border-b border-orange-900/50 backdrop-blur-md py-2' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
            <div 
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => setActiveTab('home')}
            >
                <div className="w-10 h-10 relative">
                   <div className="absolute inset-0 bg-orange-600 rotate-45 transform transition-transform group-hover:rotate-90"></div>
                   <div className="absolute inset-0 flex items-center justify-center font-bold text-black anime-font text-xl">SW</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-bold anime-font leading-none text-white group-hover:text-orange-500 transition-colors text-glow">SHINOBI WAR</span>
                    <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Multiverse RPG</span>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <button onClick={() => setActiveTab('home')} className={navLinkClass('home')}>
                    Início
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${activeTab === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
                
                <button onClick={() => setActiveTab('spins')} className={navLinkClass('spins')}>
                    Sorteio de Clã
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${activeTab === 'spins' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>

                <a href="#" className="relative text-sm font-bold uppercase tracking-widest hover:text-orange-400 transition-colors group text-white">
                    Wiki
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
                
                <button 
                  className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 font-bold uppercase tracking-wider text-sm clip-path-button transform hover:scale-105 transition-all shadow-[0_0_15px_rgba(234,88,12,0.5)]"
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                >
                   JOGAR AGORA
                </button>
            </div>

             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white">
                <Menu className="w-8 h-8" />
            </button>
        </div>
        
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-orange-900 z-50">
                <div className="flex flex-col p-6 gap-4">
                     <button onClick={() => {setActiveTab('home'); setIsMobileMenuOpen(false)}} className="text-lg font-bold text-left py-2 hover:text-orange-500 border-b border-white/10">Início</button>
                     <button onClick={() => {setActiveTab('spins'); setIsMobileMenuOpen(false)}} className="text-lg font-bold text-left py-2 hover:text-orange-500 border-b border-white/10">Sorteio de Clã</button>
                     <a href="#" className="text-lg font-bold text-left py-2 hover:text-orange-500 border-b border-white/10">Wiki</a>
                </div>
            </div>
        )}
      </nav>

      <main className="flex-grow">
        {activeTab === 'home' ? (
            <>
                <header className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
                        <div className="mb-4 inline-block animate-bounce">
                            <span className="bg-orange-600/20 border border-orange-500 text-orange-300 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                                Nova Expansão: Guerra Ninja
                            </span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 anime-font filter drop-shadow-[0_0_10px_rgba(234,88,12,0.5)] mb-2 leading-tight">
                        SHINOBI WAR
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-light text-white japanese-font tracking-widest mb-8 opacity-90">
                        私は醜くてよく泣きます
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Explore mundos, conquiste batalhas e forje seu legado. O destino das vilas está em suas mãos.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <button 
                                onClick={() => setActiveTab('spins')}
                                className="group relative px-8 py-4 bg-orange-600 text-white font-black text-xl uppercase tracking-widest overflow-hidden rounded-sm transition-all hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.6)]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Dice5 className="w-6 h-6" />
                                    Pegar Meu Clã
                                </span>
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                            </button>

                            <button 
                                onClick={() => setIsChatOpen(true)}
                                className="group px-8 py-4 border border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold text-lg uppercase tracking-wider rounded-sm hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                                Falar com o Oráculo
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500">
                        <ChevronDown className="w-8 h-8" />
                    </div>
                </header>

                <section className="py-24 relative z-10">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-bold anime-font mb-4 text-white text-glow-blue">Clãs Populares</h2>
                            <p className="text-gray-400 max-w-xl mx-auto">
                                Cada clã possui jutsus únicos e uma linhagem poderosa.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <InteractiveCard 
                                title="Clã Uchiha"
                                description="Mestres do Sharingan e da Liberação de Fogo. Conhecidos por seu chakra poderoso e técnicas de ilusão devastadoras."
                                imageSrc="https://picsum.photos/400/600?grayscale&blur=1"
                                color="#ef4444"
                            />
                            <InteractiveCard 
                                title="Clã Senju"
                                description="Descendentes de Asura, possuem imensa força vital e maestria em diversas naturezas de chakra. Liderança natural."
                                imageSrc="https://picsum.photos/401/600?grayscale&blur=1"
                                color="#22c55e"
                            />
                            <InteractiveCard 
                                title="Clã Hyuga"
                                description="Portadores do Byakugan, possuem visão de 360 graus e a habilidade de ver e bloquear os pontos de chakra dos inimigos."
                                imageSrc="https://picsum.photos/402/600?grayscale&blur=1"
                                color="#a855f7"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 border-y border-white/5 bg-black/50 backdrop-blur-sm">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { label: 'Jogadores Online', val: '1,240', icon: Users },
                                { label: 'Clãs Criados', val: '86', icon: Swords },
                                { label: 'Missões Ativas', val: '342', icon: MessageSquare },
                                { label: 'Updates Semanais', val: 'Active', icon: Download },
                            ].map((stat, i) => (
                                <div key={i} className="p-6">
                                    <stat.icon className="w-8 h-8 mx-auto mb-4 text-orange-500" />
                                    <div className="text-4xl font-bold text-white mb-2 anime-font">{stat.val}</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </>
        ) : (
            <ClanSpins />
        )}
      </main>

      <footer className="py-12 bg-black border-t border-orange-900/30 relative z-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left">
                <h4 className="text-2xl font-bold anime-font text-white">SHINOBI WAR</h4>
                <p className="text-gray-500 text-sm mt-2">© 2024 Multiverse RPG. Todos os direitos reservados.</p>
                <p className="text-gray-600 text-xs mt-1">Este é um projeto fã-made, não afiliado a Masashi Kishimoto.</p>
            </div>
            <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Termos</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
