import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playMysteriousSound } from '../utils/audio';

const LOADING_TEXTS = [
  "뇌파 데이터 동기화 중...",
  "숨겨진 흑염룡의 기운 탐지 중...",
  "과거의 흑역사 스캔 중...",
  "전투력 및 중2력 계산 중..."
];

export default function Loading({ onNext }: { onNext: (analysis: any) => void }) {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1 < LOADING_TEXTS.length ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    playMysteriousSound();
    
    const GRADES = ["S-Class 주인공", "A-Class 흑염룡", "B-Class 고독한 늑대", "C-Class 방구석 철학자", "F-Class 일반인"];
    const SYMPTOMS = ["과몰입, 흑염룡 각성 대기", "다크모드 고집, 이어폰 필수", "망상 전문가, 새벽 감성", "혼자 영화 찍음, 세상은 썩었어", "지극히 평범함, 도파민 중독"];
    const NOTES = ["오른팔 봉인 중 (접근 주의)", "밤 12시 이후 감성 폭발 (위험)", "비 오는 날 혼자 걷기 좋아함", "시크릿 폴더 용량 초과", "정상인 코스프레 중"];
    
    const randomIdx = Math.floor(Math.random() * GRADES.length);
    
    const timer = setTimeout(() => {
      onNext({
        grade: GRADES[randomIdx],
        symptom: SYMPTOMS[randomIdx],
        note: NOTES[randomIdx]
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="w-full flex-grow bg-primary overflow-hidden flex flex-col items-center justify-center p-6 text-white font-sans relative">
      <div className="absolute inset-0 bg-grid-pattern-light opacity-30 pointer-events-none"></div>

      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-full max-w-xs aspect-square mb-12 flex items-center justify-center relative z-10"
      >
        <img src="/image.png" alt="캐릭터" className="w-full h-full object-contain mix-blend-multiply opacity-80" />
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
