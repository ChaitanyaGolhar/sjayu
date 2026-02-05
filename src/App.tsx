//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, X, Flower, Gift, Lock, 
  Smile, Cloud, Unlock, Star, ArrowRight, 
  RotateCcw, Sparkles, Paperclip, Pin, Mail,
  Volume2, VolumeX, Music, AlertCircle, Type, MousePointer2,
  Cookie, Candy, Croissant, Cake, Coffee, IceCream,
  Gem
} from 'lucide-react';

// --- Assets & Theme ---
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Homemade+Apple&family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Reenie+Beanie&family=La+Belle+Aurore&family=Noto+Sans+Devanagari:wght@400;600&display=swap');
`;

// --- AUDIO DATA ---
const DEFAULT_MUSIC = "Come-Through.mp3"; 
const INTRO_MUSIC = "Come-Through.mp3"; 

// --- Shared Components ---

const NoiseOverlay = ({ dark = false }) => (
  <div className={`pointer-events-none fixed inset-0 z-50 mix-blend-multiply ${dark ? 'opacity-[0.08] bg-stone-900' : 'opacity-[0.04]'}`} 
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
  />
);

// --- ANIMATION COMPONENTS ---
const FallingFlowers = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {[...Array(25)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: -50, x: Math.random() * 100, rotate: 0, opacity: 0 }}
        animate={{ 
          y: '120vh', 
          x: [null, Math.random() * 100 - 50, Math.random() * 100 - 50],
          rotate: [0, 180, 360], 
          opacity: [0, 0.9, 0.9, 0] 
        }}
        transition={{
          duration: Math.random() * 15 + 10,
          repeat: Infinity,
          delay: Math.random() * 10,
          ease: "linear",
          times: [0, 0.5, 1]
        }}
        className="absolute"
        style={{ left: `${Math.random() * 100}%`, scale: Math.random() * 0.4 + 0.6 }}
      >
        <Flower size={Math.random() * 30 + 20} className="text-rose-400/60 fill-rose-300/40" strokeWidth={1} />
      </motion.div>
    ))}
  </div>
);

// NEW: Cute Floating Doodles for Reveals
const FloatingDoodles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 0.4, 0],
          scale: [0.5, 1, 0.5],
          y: [0, -100],
          x: Math.random() * 40 - 20
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeInOut"
        }}
        className="absolute text-rose-300"
        style={{ 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%` 
        }}
      >
        {i % 3 === 0 ? <Heart size={24} fill="currentColor" /> : i % 3 === 1 ? <Sparkles size={20} /> : <Star size={16} />}
      </motion.div>
    ))}
  </div>
);

// --- MUSIC PLAYER ---
const BackgroundMusic = ({ isPlaying, togglePlay, currentTrack }) => {
  // Use encodeURI to handle spaces and special characters in filenames safely
  const audioRef = useRef(new Audio(encodeURI(currentTrack)));
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    const fadeOut = setInterval(() => {
      if (audioRef.current.volume > 0.1) audioRef.current.volume -= 0.1;
      else {
        clearInterval(fadeOut);
        audioRef.current.pause();
        audioRef.current.src = encodeURI(currentTrack); // Ensure encoded URL
        audioRef.current.load();
        if (isPlaying && hasInteracted) {
          audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
          audioRef.current.volume = 0;
          const fadeIn = setInterval(() => {
             if (audioRef.current.volume < 0.9) audioRef.current.volume += 0.1;
             else clearInterval(fadeIn);
          }, 100);
        }
      }
    }, 100);
    return () => clearInterval(fadeOut);
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying && hasInteracted) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying, hasInteracted]);

  useEffect(() => {
    const startAudio = () => { setHasInteracted(true); };
    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });
  }, []);

  return (
    <button onClick={togglePlay} className="fixed bottom-6 right-6 z-[100] bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-stone-200 hover:scale-105 transition-transform group">
      {isPlaying ? (
        <div className="relative"><Volume2 size={24} className="text-[#8B3A3A]" /><span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span></div>
      ) : ( <VolumeX size={24} className="text-stone-400" /> )}
    </button>
  );
};

// --- SCRAPBOOK COMPONENTS ---
const Tape = ({ className = "" }) => (
  <div className={`absolute w-24 h-8 bg-[#fdfbf7]/80 backdrop-blur-[1px] shadow-sm transform ${className} z-20`}>
    <div className="w-full h-full opacity-40 bg-stone-200 border-x border-white/50"></div>
  </div>
);

const Polaroid = ({ color, rotation, delay, children, caption, className = "" }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0, rotate: 0, y: 50 }}
    animate={{ scale: 1, opacity: 1, rotate: rotation, y: 0 }}
    transition={{ delay: delay, type: "spring", stiffness: 100, damping: 15 }}
    className={`bg-white p-3 pb-10 shadow-xl shrink-0 relative transform transition-transform hover:scale-105 hover:z-30 duration-500 z-10 ${className}`}
  >
    <div className={`w-full aspect-[4/5] ${color} overflow-hidden bg-stone-200 relative`}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/10 to-transparent pointer-events-none mix-blend-multiply" />
    </div>
    {caption && (
      <div className="absolute bottom-2 left-0 right-0 text-center font-['Reenie_Beanie'] text-2xl text-stone-800">{caption}</div>
    )}
  </motion.div>
);

const LinedPaper = ({ children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className={`bg-[#fdfbf7] p-6 shadow-md relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #aebcc9 28px)', backgroundPosition: '0 20px' }}></div>
    <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-300/50"></div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const Sticker = ({ type, className }) => {
  if (type === 'flower') return <Flower className={`absolute text-rose-800/60 ${className}`} size={64} strokeWidth={1} />;
  if (type === 'butterfly') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={`absolute text-stone-600 ${className}`}>
      <path d="M12 22c1.1 0 2-.9 2-2v-3l-2 2-2-2v3c0 1.1.9 2 2 2z"/>
      <path d="M2.5 14.9c-1-1.3-1.3-2.9-.7-4.4.6-1.5 2.2-2.2 3.8-1.8 1 .2 1.8.9 2.4 1.7l2 2.5 2-2.5c.6-.8 1.4-1.5 2.4-1.7 1.6-.4 3.2.3 3.8 1.8.6 1.5.3 3.1-.7 4.4l-5.5 6.5c-.6.7-1.5 1.1-2.5 1.1s-1.9-.4-2.5-1.1l-5.5-6.5z"/>
    </svg>
  );
  return null;
};

const TornPaper = ({ className = "", children }) => (
  <div className={`absolute bg-[#f4f1ea] p-6 shadow-md ${className}`} style={{ clipPath: "polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%)" }}>
    <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
    <div className="font-['Cormorant_Garamond'] italic text-stone-700 leading-relaxed text-sm md:text-base text-center relative z-10">
      {children}
    </div>
  </div>
);

// --- GAMIFIED COMPONENTS ---

// 1. Rose Day
const RoseGame = ({ onWin }) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [basketX, setBasketX] = useState(50);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const isThorn = Math.random() > 0.7; // 30% chance of thorn
      setItems(prev => [...prev, { 
        id: Date.now(), 
        x: Math.random() * 90 + 5, 
        y: -10,
        type: isThorn ? 'thorn' : 'rose'
      }]);
      setItems(prev => prev.map(item => ({ ...item, y: item.y + (item.type === 'thorn' ? 2 : 1.5) })).filter(item => item.y < 110));
    }, 400); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const caughtItem = items.find(item => item.y > 85 && item.y < 95 && Math.abs(item.x - basketX) < 10);
    
    if (caughtItem) {
      if (caughtItem.type === 'rose') {
        setScore(s => Math.min(s + 1, 10));
      } else {
        setScore(s => Math.max(0, s - 2)); 
      }
      setItems(prev => prev.filter(i => i.id !== caughtItem.id));
    }
  }, [items, basketX]);

  useEffect(() => { if (score >= 10) onWin(); }, [score, onWin]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(5, Math.min(95, x)));
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => handleMouseMove(e.touches[0])}
      className="relative w-full h-80 bg-stone-100 overflow-hidden border border-stone-300 rounded-sm cursor-none touch-none"
    >
      <div className="absolute top-4 right-4 font-['Playfair_Display'] text-xl italic flex gap-4">
        <span>Pakadle: {score}/10</span>
      </div>
      
      {items.map(item => (
        <div 
          key={item.id} 
          className={`absolute ${item.type === 'thorn' ? 'text-stone-800' : 'text-rose-600'}`} 
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {item.type === 'thorn' ? <X size={28} strokeWidth={3} /> : <Flower size={24} fill="currentColor" />}
        </div>
      ))}

      <div 
        className="absolute bottom-4 w-16 h-8 border-x-2 border-b-2 border-stone-800 rounded-b-lg flex justify-center bg-white/50 backdrop-blur-sm"
        style={{ left: `calc(${basketX}% - 2rem)` }}
      />
      <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none opacity-40 text-xs">
        Katyanpasun sawdhan! (X)
      </div>
    </div>
  );
};

// 2. Propose Day
const ProposeGame = ({ onWin }) => {
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const ringRef = useRef(null);
  const fingerRef = useRef(null);

  const handleDragEnd = (e, info) => {
    setIsDragging(false);
    const fingerRect = fingerRef.current.getBoundingClientRect();
    const ringRect = ringRef.current.getBoundingClientRect();
    const distance = Math.hypot((ringRect.x + ringRect.width/2) - (fingerRect.x + fingerRect.width/2), (ringRect.y + ringRect.height/2) - (fingerRect.y + fingerRect.height/2));

    if (distance < 50) {
      setSuccess(true);
      setTimeout(onWin, 1000);
    } else {
      setDragPosition({ x: 0, y: 0 });
    }
  };

  return (
    // Added touch-none here to prevent scrolling while dragging on mobile
    <div className="flex flex-col items-center justify-center h-80 w-full relative overflow-hidden bg-stone-50/50 touch-none">
      {!success ? (
        <>
          <p className="absolute top-4 font-['Playfair_Display'] text-xl text-stone-600 animate-pulse">Angathi majhya botat ghal...</p>
          <div ref={fingerRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50">
             <svg width="100" height="150" viewBox="0 0 100 150" className="fill-stone-300">
               <path d="M20,150 L20,80 Q20,60 35,60 L35,150" />
               <path d="M35,150 L35,40 Q35,20 50,20 L50,150" />
               <path d="M50,150 L50,30 Q50,10 65,10 L65,150" />
               <path d="M65,150 L65,45 Q65,25 80,25 L80,150" />
             </svg>
             <div className="absolute top-[40px] left-[35px] w-6 h-6 rounded-full border-2 border-stone-400 border-dashed animate-ping opacity-50"></div>
          </div>
          <motion.div ref={ringRef} drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 200 }} dragElastic={0.2} onDragEnd={handleDragEnd} whileDrag={{ scale: 1.2, cursor: 'grabbing' }} animate={isDragging ? {} : { x: 0, y: 0 }} className="absolute top-20 cursor-grab z-20">
             <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-yellow-500 rounded-full"></div>
                <Gem size={24} className="absolute -top-3 left-1/2 -translate-x-1/2 text-blue-300 fill-blue-100 drop-shadow-md" />
             </div>
          </motion.div>
        </>
      ) : (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
           <h2 className="font-['Playfair_Display'] text-4xl text-[#8B3A3A] mb-2">Ho!</h2>
           <p className="font-['Cormorant_Garamond'] text-stone-500">Mi nehmich tujha asel.</p>
        </motion.div>
      )}
    </div>
  );
};

// 3. Chocolate Day
const ChocolateGame = ({ onWin }) => {
  const iconMap = [
    { id: 'cookie', Icon: Cookie, color: 'text-amber-700' },
    { id: 'candy', Icon: Candy, color: 'text-pink-500' },
    { id: 'croissant', Icon: Croissant, color: 'text-orange-600' },
    { id: 'cake', Icon: Cake, color: 'text-rose-400' },
    { id: 'icecream', Icon: IceCream, color: 'text-blue-400' },
    { id: 'coffee', Icon: Coffee, color: 'text-stone-700' },
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const deck = [...iconMap, ...iconMap].sort(() => Math.random() - 0.5).map((item, index) => ({ ...item, uniqueId: index }));
    setCards(deck);
  }, []);

  const handleCardClick = (index) => {
    if (isChecking || matched.includes(index) || flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [first, second] = newFlipped;
      if (cards[first].id === cards[second].id) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
        setIsChecking(false);
      } else {
        setTimeout(() => { setFlipped([]); setIsChecking(false); }, 1000);
      }
    }
  };

  useEffect(() => { if (cards.length > 0 && matched.length === cards.length) setTimeout(onWin, 500); }, [matched, cards, onWin]);

  return (
    <div className="h-80 w-full flex flex-col items-center justify-center">
      <p className="mb-6 text-stone-500 text-sm uppercase tracking-widest">God-God jodya lava</p>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          const IconComponent = card.Icon;
          return (
            <div key={card.uniqueId} onClick={() => handleCardClick(index)} className="w-14 h-14 md:w-16 md:h-16 relative cursor-pointer" style={{ perspective: "1000px" }}>
              <motion.div className="w-full h-full relative" initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }} style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute inset-0 w-full h-full bg-white border-2 border-stone-200 rounded-lg flex items-center justify-center shadow-sm" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}><IconComponent size={28} className={card.color} /></div>
                <div className="absolute inset-0 w-full h-full bg-[#3E2723] border-2 border-[#5D4037] rounded-lg flex items-center justify-center shadow-sm" style={{ backfaceVisibility: "hidden" }}><Gift size={20} className="text-white/30" /></div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. Teddy Day: Spot the Difference (EASIER 5x5)
const TeddyGame = ({ onWin }) => {
  const gridSize = 25; // Reduced from 49 to 25
  const [targetIndex, setTargetIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25);

  useEffect(() => {
    setTargetIndex(Math.floor(Math.random() * gridSize));
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 25; 
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const BearIcon = ({ isTarget }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" className="fill-[#8D6E63] stroke-none" />
      <circle cx="20" cy="20" r="15" className="fill-[#8D6E63]" />
      <circle cx="80" cy="20" r="15" className="fill-[#8D6E63]" />
      <ellipse cx="50" cy="60" rx="14" ry="12" className="fill-[#D7CCC8]" />
      {/* NOSE: Target has RED nose (EASIER) */}
      <circle cx="50" cy="55" r="4" fill={isTarget ? "#B71C1C" : "#5D4037"} />
      <circle cx="35" cy="45" r="4" className="fill-black" />
      <circle cx="65" cy="45" r="4" className="fill-black" />
      {isTarget ? (
         <path d="M45 65 Q50 72 55 65" stroke="#3E2723" strokeWidth="2" fill="none" />
      ) : (
         <path d="M45 65 Q50 70 55 65" stroke="#3E2723" strokeWidth="2" fill="none" />
      )}
    </svg>
  );

  return (
    <div className="relative w-full h-96 flex flex-col items-center justify-center">
      <div className="flex justify-between w-full max-w-xs mb-4 text-sm text-stone-500 font-bold uppercase tracking-widest">
        <span>LAL Nak aslela Teddy shodha</span>
        <span className={timeLeft < 5 ? "text-red-500" : ""}>{timeLeft}s</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {[...Array(gridSize)].map((_, i) => (
          <button key={i} onClick={() => i === targetIndex ? onWin() : setTimeLeft(t => Math.max(0, t - 2))} className="w-12 h-12 hover:scale-110 transition-transform bg-stone-100 rounded-full p-1 border border-stone-200 shadow-sm">
            <BearIcon isTarget={i === targetIndex} />
          </button>
        ))}
      </div>
    </div>
  );
};

// 5. Promise Day
const PromiseGame = ({ onWin }) => {
  const phrase = "I PROMISE TO STAY";
  const [input, setInput] = useState("");
  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= phrase.length) { setInput(val); if (val === phrase) setTimeout(onWin, 500); }
  };
  return (
    <div className="flex flex-col items-center justify-center h-80 w-full px-8 space-y-8">
      <Lock size={48} className={`transition-colors duration-500 ${input === phrase ? 'text-green-600' : 'text-stone-400'}`} />
      <div className="w-full text-center space-y-4">
        <p className="font-['Cormorant_Garamond'] text-lg tracking-widest text-stone-500">TYPE KARA UNLOCK KARNYASATHI:</p>
        <div className="font-['Playfair_Display'] text-2xl md:text-3xl text-stone-800 tracking-widest border-b border-stone-300 pb-2 min-h-[3rem]">{phrase.split('').map((char, i) => (<span key={i} className={i < input.length ? "text-[#8B3A3A]" : "opacity-30"}>{char}</span>))}</div>
        <input type="text" value={input} onChange={handleChange} className="w-full text-center bg-transparent border-none outline-none text-transparent caret-[#8B3A3A] absolute inset-0 h-full cursor-text" autoFocus />
        <p className="text-xs text-stone-400 uppercase tracking-widest">(Type "I PROMISE TO STAY")</p>
      </div>
    </div>
  );
};

// 6. Hug Day
const HugGame = ({ onWin }) => {
  const warmthRef = useRef(30);
  const scoreRef = useRef(0);
  const [warmth, setWarmth] = useState(30);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Thandi vajtey... Mithi mar na!");

  useEffect(() => {
    const timer = setInterval(() => {
      warmthRef.current = Math.max(0, warmthRef.current - 0.4);
      if (warmthRef.current > 65 && warmthRef.current < 95) {
        scoreRef.current = Math.min(100, scoreRef.current + 0.4);
        setMessage("Ekdam Ubbdar... ❤️");
      } else if (warmthRef.current >= 95) {
        scoreRef.current = Math.max(0, scoreRef.current - 0.2); 
        setMessage("Khup ghatt hotay!");
      } else {
        setMessage("Thandi vajtey... Mithi mar na!");
      }
      setWarmth(warmthRef.current);
      setScore(scoreRef.current);
      if (scoreRef.current >= 100) { clearInterval(timer); onWin(); }
    }, 30);
    return () => clearInterval(timer);
  }, [onWin]);

  const handleHug = () => { warmthRef.current = Math.min(100, warmthRef.current + 12); };

  return (
    <div className="flex flex-col items-center justify-center h-80 w-full select-none px-4">
      <div className="text-center mb-6 space-y-1"><p className="font-['Cormorant_Garamond'] text-xl font-bold tracking-widest text-stone-600 uppercase">{message}</p><p className="text-xs text-stone-400">Heart la Red Zone madhe thev</p></div>
      <div className="flex gap-8 items-end h-48 w-full max-w-xs justify-center relative">
         <div className="w-16 h-full bg-stone-200 rounded-full relative overflow-hidden border border-stone-300"><div className="absolute bottom-[65%] w-full h-[30%] bg-rose-100/50 z-10 border-y border-rose-200 dashed"></div><motion.div className={`absolute bottom-0 w-full transition-colors duration-300 ${warmth > 95 ? 'bg-red-800' : warmth > 65 ? 'bg-[#8B3A3A]' : 'bg-blue-300'}`} style={{ height: `${warmth}%` }} /><div className="absolute inset-0 flex flex-col justify-end pb-2 items-center z-20 pointer-events-none"><span className="text-white drop-shadow-md text-xs font-bold">{Math.round(warmth)}%</span></div></div>
         <div className="h-full flex flex-col justify-end space-y-2"><div className="w-4 h-full bg-stone-100 rounded-full overflow-hidden relative"><motion.div className="absolute bottom-0 w-full bg-green-500" style={{ height: `${score}%` }} /></div><span className="text-[10px] uppercase text-stone-400 rotate-90 origin-left translate-x-2">Pragati</span></div>
      </div>
      <motion.button whileTap={{ scale: 0.9 }} onClick={handleHug} className="mt-8 w-20 h-20 bg-[#8B3A3A] rounded-full shadow-lg flex items-center justify-center text-white active:bg-rose-800 transition-colors"><Heart size={32} className="fill-current" /></motion.button>
    </div>
  );
};

// 7. Kiss Day
const KissGame = ({ onWin }) => {
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  useEffect(() => {
    const spawner = setInterval(() => { const id = Date.now(); setTargets(prev => [...prev, { id, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }]); setTimeout(() => { setTargets(prev => prev.filter(t => t.id !== id)); }, 1200); }, 700); return () => clearInterval(spawner);
  }, []);
  const hit = (id) => { setTargets(prev => prev.filter(t => t.id !== id)); setScore(s => s + 1); };
  useEffect(() => { if (score >= 10) onWin(); }, [score, onWin]);
  return (
    <div className="relative w-full h-80 bg-stone-50 border border-stone-200 rounded-lg overflow-hidden cursor-crosshair"><div className="absolute top-4 right-4 font-bold text-stone-300 text-2xl">{score}/10</div><AnimatePresence>{targets.map(t => ( <motion.button key={t.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => hit(t.id)} className="absolute p-2" style={{ left: `${t.x}%`, top: `${t.y}%` }}><Heart className="fill-rose-500 text-rose-600 drop-shadow-md" size={32} /></motion.button> ))}</AnimatePresence></div>
  );
};

// 8. Final Surprise
const FinalSurpriseGame = ({ onWin }) => (
  <div className="flex flex-col items-center justify-center h-80 cursor-pointer w-full" onClick={onWin}>
    <motion.div whileHover={{ scale: 1.05, rotate: 2 }} whileTap={{ scale: 0.95 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="relative">
       <div className="w-56 h-40 bg-[#8B3A3A] rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-0 border-l-[112px] border-l-transparent border-r-[112px] border-r-transparent border-t-[90px] border-t-red-900/40 z-10"></div><div className="w-12 h-12 rounded-full bg-red-950 shadow-lg flex items-center justify-center z-20 mt-4 border-2 border-red-800/50"><Heart className="text-red-900/50 fill-red-900/50" size={24} /></div></div>
    </motion.div>
    <div className="mt-12 text-center space-y-2"><h3 className="font-['Playfair_Display'] text-2xl">Jayu sathi patra</h3><p className="font-['Cormorant_Garamond'] italic text-lg text-stone-400 animate-pulse">Ughadun tar bagh...</p></div>
  </div>
);

// --- REVEAL VIEWS ---

const RoseReveal = ({ data }) => (
  <div className="relative w-full max-w-4xl h-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center p-8 gap-12">
    <FloatingDoodles />
    <div className="relative z-10">
      <Tape className="-top-3 left-12 -rotate-3" />
      <Polaroid color={data.color} rotation="-2deg" delay={0.2} caption="Majhya Sunder Ful">
        <div className="w-full h-full bg-rose-900/20 flex items-center justify-center"><Flower size={80} className="text-rose-900 opacity-20" /></div>
      </Polaroid>
      <Sticker type="flower" className="-bottom-8 -right-8 rotate-12" />
    </div>
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="max-w-xs md:max-w-sm relative z-10">
      <LinedPaper className="rotate-1">
        <h2 className="font-['Playfair_Display'] text-3xl mb-4 text-[#8B3A3A] font-bold">{data.revealTitle}</h2>
        <p className="font-['Noto_Sans_Devanagari'] text-xl leading-loose text-stone-800">{data.message}</p>
        <p className="font-['Homemade_Apple'] text-sm mt-6 text-right text-stone-500">- S.</p>
      </LinedPaper>
      <Tape className="-top-2 -right-2 rotate-45" />
    </motion.div>
  </div>
);

const ProposeReveal = ({ data }) => (
  <div className="flex flex-col items-center justify-center w-full max-w-4xl gap-8 p-4 relative">
    <FloatingDoodles />
    <div className="flex flex-wrap justify-center gap-6 relative z-10">
      <Polaroid color="bg-stone-300" rotation="-3deg" delay={0.2} caption="Day One">
         <div className="w-full h-full bg-stone-300 flex items-center justify-center"><span className="font-['Playfair_Display'] text-4xl opacity-20">Tevha</span></div>
      </Polaroid>
      <Polaroid color="bg-stone-800" rotation="2deg" delay={0.4} caption="Forever">
         <div className="w-full h-full bg-stone-800 flex items-center justify-center"><span className="font-['Playfair_Display'] text-4xl text-white opacity-20">Atta</span></div>
      </Polaroid>
      <Tape className="top-0 left-[45%] w-32 rotate-0" />
    </div>
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="bg-[#fff9c4] p-6 shadow-lg max-w-md w-full relative rotate-1 z-10">
       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-sm z-20"></div>
       <h2 className="font-['Playfair_Display'] text-4xl text-center mb-4">{data.revealTitle}</h2>
       <p className="font-['Noto_Sans_Devanagari'] text-xl text-center leading-relaxed italic">"{data.message}"</p>
       <div className="mt-6 text-center"><span className="font-['Homemade_Apple'] text-2xl text-[#8B3A3A] border-b-2 border-[#8B3A3A]">Ho, nehmich.</span></div>
    </motion.div>
  </div>
);

const ChocolateReveal = ({ data }) => (
  <div className="relative w-full max-w-2xl p-8 bg-[#3E2723] rounded-sm shadow-2xl flex flex-col items-center text-[#EFEBE9]">
    <FloatingDoodles />
    <div className="absolute top-4 left-4 w-full h-full border border-[#8D6E63] pointer-events-none"></div>
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="text-center space-y-6 z-10">
      <div className="font-['Playfair_Display'] text-5xl tracking-widest text-[#D7CCC8] uppercase border-b border-[#5D4037] pb-4 inline-block">{data.revealTitle}</div>
      <p className="font-['Noto_Sans_Devanagari'] text-xl leading-relaxed max-w-md">{data.message}</p>
      <div className="bg-white p-2 pb-6 shadow-lg transform rotate-3 max-w-xs mx-auto text-stone-800 mt-8">
         <div className="aspect-square bg-stone-200 mb-2 overflow-hidden"><div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50"></div></div>
         <p className="font-['Reenie_Beanie'] text-xl text-center">Tu majhi Treat aahes.</p>
      </div>
    </motion.div>
  </div>
);

const SimpleScrapbookLayout = ({ data }) => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
     <FloatingDoodles />
     <motion.div initial={{ rotate: 0, opacity: 0 }} animate={{ rotate: -2, opacity: 1 }} className="absolute w-80 h-96 bg-[#f0f0f0] shadow-xl z-0" />
     <motion.div initial={{ rotate: 0, opacity: 0 }} animate={{ rotate: 3, opacity: 1 }} transition={{ delay: 0.1 }} className="absolute w-80 h-96 bg-[#fff] shadow-xl z-0" />
     <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="relative">
           <Tape className="-top-4 -left-4 -rotate-45" />
           <Tape className="-bottom-4 -right-4 -rotate-45" />
           <Polaroid color={data.color} rotation="-2deg" delay={0.3} caption={data.note}>
              <div className="w-full h-full flex items-center justify-center bg-stone-100"><Heart className="text-stone-300" size={48} /></div>
           </Polaroid>
        </div>
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="max-w-xs">
           <h2 className="font-['Homemade_Apple'] text-3xl mb-6 text-[#8B3A3A] font-bold">{data.revealTitle}</h2>
           <p className="font-['Noto_Sans_Devanagari'] text-2xl leading-snug text-stone-800">{data.message}</p>
        </motion.div>
     </div>
  </div>
);

const FinalLetterReveal = ({ data }) => {
  const letterLines = [
  "प्रिय जयू, 💞",
  "",
  "आज काही खास लिहावंसं वाटतंय.",
  "शब्द शोधताना जाणवतं की,",
  "तू माझ्या आयुष्यात आलीस",
  "आणि सगळं हळूच बदलून गेलं.",
  "",
  "तुझ्यामुळे आयुष्य शांत झालं.",
  "गोंधळातसुद्धा एक स्थिरपणा आला.",
  "मी जसा आहे तसाच स्वीकारणारी,",
  "आणि तरीही मला अजून चांगला बनवणारी",
  "एकमेव व्यक्ती म्हणजे तू.",
  "",
  "तू फक्त माझी प्रेयसी नाहीस,",
  "तू माझं घर आहेस.",
  "जिथे थकवा उतरतो,",
  "आणि मन निवांत होतं.",
  "",
  "तुझं ते मनापासून बोलणं,",
  "लहानसहान गोष्टींवर खुश होणं,",
  "आणि कधी कधी कारण नसतानाही चिडणं,",
  "हे सगळं तुझंच आहे —",
  "आणि म्हणूनच मला ते सगळं आवडतं.",
  "",
  "मी परिपूर्ण नाही,",
  "पण माझं प्रेम खरं आहे.",
  "मला तुला बदलायचं नाही,",
  "मला फक्त तुला जपायचं आहे.",
  "",
  "तुझ्या प्रत्येक टप्प्यावर,",
  "प्रत्येक निर्णयात,",
  "प्रत्येक शांत आणि कठीण दिवशी,",
  "मी तुझ्या सोबत उभा राहीन.",
  "",
  "जग कितीही गोंगाटाचं असो,",
  "माझी नजर मात्र नेहमी",
  "तुलाच शोधत राहील.",
  "",
  "या व्हॅलेंटाईन डे ला,",
  "फक्त एवढंच सांगायचं आहे —",
  "मी तुझ्यावर प्रेम करतो.",
  "आज, उद्या, आणि कायमच.",
  "",
  "नेहमी तुझाच,",
  "S."
];



  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#e8e4d9]">
      <FallingFlowers />
      <FloatingDoodles />
      <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] pointer-events-none" />
      <motion.div 
         initial={{ y: 50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ duration: 1.2, ease: "easeOut" }}
         className="relative z-10 w-full max-w-5xl min-h-[85vh] bg-[#FDFBF7] shadow-2xl p-4 md:p-12 overflow-hidden flex flex-col md:flex-row gap-8 items-start justify-center"
         style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
         <Tape className="-top-4 right-20 rotate-3 z-20" />
         <TornPaper className="hidden md:block absolute -top-4 left-10 rotate-[-4deg] max-w-[200px] z-20">"Majha tujhyavar prem aahe, tu jashi aahes tyawar ani tu jashi ghadat aahes tyawar."</TornPaper>
         <Sticker type="butterfly" className="absolute bottom-10 left-10 w-24 h-24 rotate-12 opacity-70 hidden md:block" />
         <div className="relative w-full md:w-1/3 flex flex-col gap-8 mt-12 md:mt-0">
            <Polaroid color="bg-stone-300" rotation="-6deg" delay={0.2} caption="Day 1" className="z-10"><div className="w-full h-full bg-stone-300 flex items-center justify-center opacity-30"><Heart size={40} /></div></Polaroid>
            <Polaroid color="bg-stone-800" rotation="4deg" delay={0.4} caption="Forever" className="z-20 md:-ml-8 md:-mt-12"><div className="w-full h-full bg-stone-800 flex items-center justify-center text-white opacity-30"><Star size={40} /></div></Polaroid>
            <Tape className="top-[45%] left-[-10px] rotate-[-20deg] z-30" />
         </div>
         <div className="relative w-full md:w-2/3 mt-8 md:mt-12">
            <LinedPaper className="rotate-1 min-h-[600px]">
               <Paperclip className="absolute -top-3 right-8 text-stone-400 w-12 h-12 rotate-12 drop-shadow-md z-20" />
               <div className="text-center mb-10 mt-4">
                  <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#2A2A2A] mb-2">Kayamcha Tujha</h1>
                  <div className="w-16 h-[2px] bg-[#8B3A3A] mx-auto opacity-50"></div>
               </div>
               <div className="font-['Noto_Sans_Devanagari'] text-xl md:text-xl leading-[2.2rem] text-stone-800 px-2 md:px-6">
                  {letterLines.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.5, duration: 0.8 }} className={line === "" ? "h-6" : ""} style={{ transform: `rotate(${Math.random() * 1 - 0.5}deg)` }}>{line}</motion.div>
                  ))}
               </div>
               <motion.div initial={{ opacity: 0, rotate: -5 }} whileInView={{ opacity: 1, rotate: 0 }} transition={{ delay: letterLines.length * 0.5 + 0.5, duration: 1 }} className="mt-16 text-right pr-8"><p className="font-['Homemade_Apple'] text-3xl text-[#8B3A3A] -rotate-2">S.</p></motion.div>
            </LinedPaper>
            <Tape className="-bottom-4 right-1/2 translate-x-1/2 rotate-2 z-30" />
         </div>
      </motion.div>
    </div>
  );
};

const RevealView = ({ dayData, onBack }) => {
  const renderLayout = () => {
    switch(dayData.id) {
      case 1: return <RoseReveal data={dayData} />;
      case 2: return <ProposeReveal data={dayData} />;
      case 3: return <ChocolateReveal data={dayData} />;
      case 8: return <FinalLetterReveal data={dayData} />;
      default: return <SimpleScrapbookLayout data={dayData} />;
    }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full min-h-screen bg-[#E5E0D8] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>
      <div className="w-full flex justify-between items-center p-8 z-[100] fixed top-0 left-0 right-0 pointer-events-none">
        <button onClick={onBack} className="pointer-events-auto group flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity bg-white px-6 py-3 rounded-full shadow-md border border-stone-200">
          <RotateCcw size={16} />
          <span className="text-xs uppercase tracking-widest font-bold text-stone-600">Alabm Band Kara</span>
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center w-full px-4 py-24 z-10 overflow-y-auto">{renderLayout()}</div>
    </motion.div>
  );
};

// --- MAIN STRUCTURE ---

const StoryIntro = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const lines = [
    "Hi Jayu...", 
    "Me S.", 
    "Mi khup divsanpasun aplaybaddal vichar kartoy.", 
    "Mi kiti nashibwan aahe...", 
    "Tula majhi 'Jayu' mhanayla.", 
    "Majhya ayushyat, tu ekmev aahes.", 
    "Mala kahitari kayam lakshat rahil asa banvaycha hota.", 
    "Fakt shubhechha nahi, tar ek athvan.", 
    "Tayar aahes?"
  ];
  const handleNext = () => { if (index < lines.length - 1) setIndex(index + 1); else onComplete(); };
  return (
    <div onClick={handleNext} className="fixed inset-0 bg-[#0a0a0a] text-stone-200 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden">
      <NoiseOverlay dark={true} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute bg-white rounded-full opacity-20" style={{ width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', }} animate={{ y: [0, -100], opacity: [0, 0.5, 0] }} transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }} className="text-center px-8 relative z-10">
          <p className={`font-['Playfair_Display'] text-3xl md:text-5xl leading-tight ${index === lines.length - 1 ? 'text-[#8B3A3A] italic' : 'text-stone-100'}`}>{lines[index]}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const EditorialLanding = ({ days, onSelectDay, completed }) => (
  <div className="w-full bg-[#F7F5F0] text-[#2A2A2A] pb-24">
     <nav className="flex justify-between items-center py-8 px-6 md:px-12 border-b border-stone-200/60 sticky top-0 bg-[#F7F5F0]/95 backdrop-blur-sm z-40">
        <div className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold opacity-60">2025</div>
        <div className="font-['Playfair_Display'] text-xl md:text-2xl tracking-tight font-semibold">S <span className="text-[#8B3A3A] italic">&</span> JAYU💞</div>
        <div className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold opacity-60">Kayamche Sobat</div>
     </nav>
     <div className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EBE7E0] rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="relative z-10 text-center space-y-4 max-w-4xl mx-auto">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}><span className="font-['Cormorant_Garamond'] italic text-2xl md:text-3xl text-[#8B3A3A]">Majhya priya Jayu sathi</span></motion.div>
           <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="font-['Playfair_Display'] text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter text-[#1A1A1A]">APLI PREM<br/>KATHA</motion.h1>
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="max-w-md mx-auto mt-8 pt-8"><p className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-relaxed text-stone-600">Fakt majhya Jayu sathi banavlele kahi khas kshan ani athvani.</p><div className="mt-12 flex justify-center"><div className="w-[1px] h-16 bg-stone-300"></div></div></motion.div>
        </div>
     </div>
     <div className="px-4 md:px-12 py-24 bg-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-stone-200"></div>
        <div className="text-center mb-24 pt-12">
           <span className="font-['Cormorant_Garamond'] italic text-2xl text-[#8B3A3A]">The Collection</span>
           <div className="relative"><h3 className="font-['Playfair_Display'] text-[5rem] md:text-[8rem] lg:text-[10rem] uppercase tracking-tighter leading-none opacity-[0.03] select-none">CHAPTERS</h3><div className="absolute inset-0 flex items-center justify-center"><div className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A]">Aple Saat Divas</div></div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-7xl mx-auto px-4">
           {days.map((day, idx) => {
              const isDone = completed.includes(day.id);
              return (
                <motion.div key={day.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} onClick={() => onSelectDay(day)} className="group cursor-pointer">
                   <div className="aspect-[3/4] bg-[#F5F5F0] relative overflow-hidden mb-6 transition-all duration-500 group-hover:shadow-2xl">
                      <div className={`absolute inset-0 transition-opacity duration-500 ${isDone ? 'opacity-100' : 'opacity-0'}`}><div className={`w-full h-full ${day.color} opacity-20`}></div></div>
                      <div className="absolute inset-0 bg-[#1A1A1A] opacity-0 group-hover:opacity-1 transition-opacity duration-500" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"><day.icon size={48} strokeWidth={1} className={`mb-4 transition-all duration-500 ${isDone ? 'text-[#8B3A3A] scale-110' : 'text-stone-300 group-hover:text-stone-600'}`} />{isDone && <span className="font-['Homemade_Apple'] text-[#8B3A3A] text-lg -rotate-6">Ughadla</span>}</div>
                      <div className="absolute top-4 left-4 font-['Playfair_Display'] text-4xl text-stone-200 font-bold opacity-50">0{idx + 1}</div>
                   </div>
                   <div className="text-center space-y-2"><div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-bold">{day.date}</div><h4 className="font-['Playfair_Display'] text-2xl group-hover:text-[#8B3A3A] transition-colors">{day.title}</h4><div className="w-8 h-[1px] bg-stone-300 mx-auto mt-4 group-hover:w-16 transition-all duration-500"></div></div>
                </motion.div>
              );
           })}
        </div>
     </div>
     <div className="py-24 text-center"><Sparkles className="inline-block text-[#8B3A3A] mb-4" size={24} /><p className="font-['Cormorant_Garamond'] italic text-xl text-stone-500">Jayu sathi premne banavlele</p></div>
  </div>
);

// --- DATA ---
const DAYS_DATA = [
  { 
    id: 1, 
    date: "Feb 7", 
    title: "Rose Day", 
    icon: Flower, 
    component: RoseGame,
    color: "bg-rose-900",
    revealTitle: "तुझ्यासाठी…",
    message: "गुलाब सुकून जातील, पण माझं तुझ्यावरचं प्रेम कधीच सुकणार नाही. तू माझ्या आयुष्यातली ती एकमेव कळी आहेस, जिने मला पूर्ण फुलवलं.",
    note: "तू माझ्यासाठी सगळ्यात अनमोल आहेस.",

    // Rec: "Perfect" (Ed Sheeran) OR "Pehli Nazar Mein" (Race)
    musicUrl: "Yad Lagla - Full Audio Song  Sairat  Ajay Atul  Nagraj Popatrao Manjule.mp3" 
  },
  { 
    id: 2, 
    date: "Feb 8", 
    title: "Propose Day", 
    icon: Star, 
    component: ProposeGame,
    color: "bg-stone-800",
    revealTitle: "माझी होशील?",
    message: "मला जगातलं काहीही नको, फक्त तू हवी आहेस. तू, तुझा सोबत, आणि आपलं भविष्य — एवढंच स्वप्न आहे माझं. ‘S’ ची ‘जयू’ होशील का?",
    note: "फक्त तू आणि मी.",

    // Rec: "Marry You" (Bruno Mars) OR "Raabta" (Agent Vinod)
    // Updated: Switched to existing file Man-Udhan-Varyache.mp3 as Tula Pahate Re was missing
    musicUrl: "Man-Udhan-Varyache.mp3" 
  },
  { 
    id: 3, 
    date: "Feb 9", 
    title: "Chocolate Day", 
    icon: Gift, 
    component: ChocolateGame,
    color: "bg-[#3E2723]",
    revealTitle: "गोडवा",
    message: "चॉकलेटचा गोडवा थोड्याच वेळात संपतो, पण तुझ्या हसण्यातला गोडवा माझा दिवस पूर्ण करतो. तू माझ्या आयुष्यातली सगळ्यात गोड गोष्ट आहेस.",
    note: "सगळ्यांपेक्षा गोड.",


    // Rec: "Sugar" (Maroon 5) OR "Uff Teri Ada" (Kartik Calling Kartik)
    musicUrl: "Kiti Sangaichay Mala (PenduJatt.Com.Se).mp3" 
  },
  { 
    id: 4, 
    date: "Feb 10", 
    title: "Teddy Day", 
    icon: Smile, 
    component: TeddyGame,
    color: "bg-[#5D4037]",
    revealTitle: "सुरक्षित जागा",
    message: "जसं टेडीला मिठीत घेतल्यावर बरं वाटतं, तसं मला तुझं सुरक्षित ठिकाण व्हायचं आहे. जिथे तू सगळा ताण विसरून फक्त शांतता अनुभवशील.",
    note: "माझ्या गोड जयू साठी.",


    // Rec: "Count On Me" (Bruno Mars) OR "Tera Hone Laga Hoon" (Ajab Prem Ki Ghazab Kahani)
    musicUrl: "YE JEEVLAGA YE  ANURADHA PAUDWAL, SACHIN  MARATHI ROMANTIC SONG.mp3" 
  },
  { 
    id: 5, 
    date: "Feb 11", 
    title: "Promise Day", 
    icon: Lock, 
    component: PromiseGame,
    color: "bg-[#263238]",
    revealTitle: "माझं वचन",
    message: "मी तुला नेहमी गोड गोष्टी सांगण्याचं वचन देत नाही, पण जेव्हा सगळं अवघड असेल, तेव्हा तुझा हात घट्ट पकडून तुझ्या सोबत राहीन. मी तुला कधीच एकटी सोडणार नाही.",
    note: "मनापासून.",


    // Rec: "A Thousand Years" (Christina Perri) OR "Tum Se Hi" (Jab We Met)
    musicUrl: "Monsoon-Melody-–-Adhir-Man-Jhale-🌧️❤️-Ajay-Atul-x-Shreya-Ghoshal-Pooja-Sawant-Nilkanth-Master.mp3" 
  },
  { 
    id: 6, 
    date: "Feb 12", 
    title: "Hug Day", 
    icon: Cloud, 
    component: HugGame,
    color: "bg-[#455A64]",
    revealTitle: "उब",
    message: "तुझी एक मिठी माझ्या सगळ्या थकव्यावर औषध आहे. तू माझ्या जवळ असतेस, तेव्हा जगातलं सगळं ओझं हलकं वाटतं. मला फक्त तुझ्या जवळ राहायचं आहे.",
    note: "कधीच दूर जाऊ नकोस.",


    // Rec: "Photograph" (Ed Sheeran) OR "Jaadu Ki Jhappi" (Rang De Basanti)
    musicUrl: "Sairat Zaala Ji - Official Full Video  Sairat  Ajay Atul  Nagraj Popatrao Manjule.mp3" 
  },
  { 
    id: 7, 
    date: "Feb 13", 
    title: "Kiss Day", 
    icon: Heart, 
    component: KissGame,
    color: "bg-[#B71C1C]",
    revealTitle: "थांबणं",
    message: "चुंबन म्हणजे फक्त ओठांचा स्पर्श नाही, तर दोन मनांचं एकत्र थांबणं आहे. तू जवळ असतेस, तेव्हा बाकी सगळं थांबतं. फक्त तू आणि मी.",
    note: "आणखी एक.",


    // Rec: "Kiss Me" (Sixpence None The Richer) OR "Ishq Wala Love" (SOTY)
    musicUrl: "Antari Vajati (Sang Na Re Mana) - Zenda  Romantic Marathi Songs  Pushkar Shroti, Santosh Juvekar.mp3" 
  },
  { 
    id: 8, 
    date: "Feb 14", 
    title: "Valentine's Day", 
    icon: Sparkles, 
    component: FinalSurpriseGame,
    color: "bg-red-900",
    revealTitle: "कायमचा तुझा",
    note: "नेहमीच.",
    // Rec: "Lover" (Taylor Swift) OR "Kesariya" (Brahmastra)
    musicUrl: "Tuzyat-Jiv-Rangala.mp3" 
  },
];

export default function ValentineWeekApp() {
  const [view, setView] = useState('intro');
  const [activeDay, setActiveDay] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(INTRO_MUSIC);

  useEffect(() => {
    if (view === 'intro') setCurrentTrack(INTRO_MUSIC);
    else if (view === 'menu') setCurrentTrack(DEFAULT_MUSIC);
    else if ((view === 'game' || view === 'reveal') && activeDay?.musicUrl) {
      setCurrentTrack(activeDay.musicUrl);
    }
  }, [view, activeDay]);

  const handleSelectDay = (day) => {
    setActiveDay(day);
    if (completedDays.includes(day.id)) setView('reveal');
    else setView('game');
  };
  const handleWin = () => {
    if (activeDay && !completedDays.includes(activeDay.id)) setCompletedDays([...completedDays, activeDay.id]);
    setView('reveal');
  };
  const handleBackToMenu = () => { setView('menu'); setActiveDay(null); };

  const ActiveGame = activeDay ? activeDay.component : null;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden font-sans">
      <style>{FONTS}</style>
      <NoiseOverlay />
      <BackgroundMusic isPlaying={isPlaying} togglePlay={() => setIsPlaying(!isPlaying)} currentTrack={currentTrack} />

      <AnimatePresence mode="wait">
        {view === 'intro' && <StoryIntro onComplete={() => { setView('menu'); setIsPlaying(true); }} />}
        {view === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 1.5 }}>
            <EditorialLanding days={DAYS_DATA} onSelectDay={handleSelectDay} completed={completedDays} />
          </motion.div>
        )}
        {view === 'game' && activeDay && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#F7F5F0]/95 backdrop-blur-md">
            <div className="w-full max-w-lg bg-white p-8 md:p-12 shadow-2xl border border-stone-100 relative">
              <button onClick={handleBackToMenu} className="absolute top-6 left-6 p-2 hover:bg-stone-50 rounded-full transition-colors"><X size={20} className="text-stone-400" /></button>
              <div className="text-center mb-10"><span className="font-['Cormorant_Garamond'] italic text-stone-500 text-lg">The Ritual</span><h2 className="font-['Playfair_Display'] text-4xl mt-2">{activeDay.title}</h2></div>
              <ActiveGame onWin={handleWin} />
              <div className="mt-8 text-center"><div className="w-8 h-[1px] bg-stone-200 mx-auto mb-4"></div><p className="font-['Cormorant_Garamond'] text-stone-400 text-sm tracking-wide">Purna karun athvan ughad</p></div>
            </div>
          </motion.div>
        )}
        {view === 'reveal' && activeDay && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto bg-[#E5E0D8]">
            <RevealView dayData={activeDay} onBack={handleBackToMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}