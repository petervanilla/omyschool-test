import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playMysteriousSound } from '../utils/audio';

const LOADING_TEXTS = [
  "오라 센서 응답 대기 중...",
  "봉인 상태 육안 대조 중...",
  "흑역사 아카이브 대조 중...",
  "중2력 최종 산출 중..."
];

export default function Loading({ onNext }: { onNext: () => void }) {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1 < LOADING_TEXTS.length ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    playMysteriousSound();
    const timer = setTimeout(() => onNext(), 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="w-full flex-grow bg-primary overflow-hidden flex flex-col items-center justify-center p-6 text-white font-sans relative">
      <div className="absolute inset-0 bg-grid-pattern-light opacity-30 pointer-events-none"></div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-full max-w-xs mb-12 flex items-center justify-center relative z-10 px-4"
      >
        <p className="text-xl md:text-2xl font-black text-center leading-relaxed">
          잠시만 기다리십시오.<br />측정기가 진정되는 중입니다.
        </p>
      </motion.div>

      <div className="w-full max-w-xs flex flex-col items-center z-10">
        <div className="h-14 flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg md:text-xl font-black tracking-widest text-center"
            >
              {LOADING_TEXTS[textIndex]}
            </motion.h2>
          </AnimatePresence>
        </div>
        
        <div className="w-full h-2 bg-white/20 rounded-full border border-white/50 overflow-hidden relative">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '30%', '45%', '85%', '100%'] }}
            transition={{ duration: 2.8, times: [0, 0.2, 0.5, 0.8, 1], ease: "easeInOut" }}
            className="h-full bg-white shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
          />
        </div>
        
        <p className="text-[10px] font-bold opacity-80 mt-4 uppercase tracking-widest">
          Analyzing diagnostic data
        </p>
      </div>


    </div>
  );
}
