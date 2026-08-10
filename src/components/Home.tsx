import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryButton } from './Shared';
import mainIcon from '../assets/images/regenerated_image_1786294223747.png';

export default function Home({ onNext }: { onNext: () => void }) {
  const [isA, setIsA] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setIsA(prev => !prev), 5000);
    
    try {
      const historyStr = localStorage.getItem('diagnosis_history');
      if (historyStr) {
        setHistory(JSON.parse(historyStr));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden w-full bg-surface p-4 flex flex-col items-center justify-center">
      <main className="flex flex-col items-center justify-center relative px-4 py-8 w-full max-w-[374px] mx-auto overflow-hidden border border-primary bg-surface shadow-sm">
        <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none opacity-50"></div>
        
        <header className="w-full flex flex-col items-center mb-4 text-center z-10">
          <div className="inline-flex items-center justify-center px-2 py-1 border border-primary text-white text-[10px] font-bold uppercase mb-3 tracking-wider bg-primary">
            Edgy Level Test
          </div>
          <h1 className="text-[42px] md:text-[50px] font-black text-secondary tracking-tight mb-2 leading-[1.1]">
            대한민국<br />중2병 측정기
          </h1>
          <div className="w-16 h-px bg-gray-400 mt-4"></div>
        </header>

        <div className="relative w-full aspect-square max-w-[16rem] mb-4 z-10">
          <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-white p-2 pb-8 border border-outline brutal-shadow -rotate-6 -translate-x-4 translate-y-4">
            <img src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=400&q=80" alt="bg" className="w-full h-full object-cover grayscale contrast-125" />
          </div>
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-white p-2 pb-8 border border-outline brutal-shadow rotate-6 translate-x-4 translate-y-2">
            <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80" alt="bg" className="w-full h-full object-cover grayscale contrast-125" />
          </div>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4/5 h-4/5 bg-white p-2 pb-10 border border-outline brutal-shadow z-10 hover:-translate-y-2 transition-transform duration-300">
            <img src={mainIcon} alt="main" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="text-center w-full relative h-20 flex items-center justify-center z-10 mb-4">
          <AnimatePresence mode="wait">
            {isA ? (
              <motion.div
                key="A"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full flex flex-col items-center"
              >
                <h2 className="text-[28px] md:text-[32px] font-normal mb-3">너, 중2병이지?</h2>
                <div className="flex items-center gap-2 text-gray-500 font-bold text-xs md:text-sm">
                  <span className="w-4 h-px bg-primary"></span>
                  <p>딱 10초!면 널 측정해 줄게!</p>
                  <span className="w-4 h-px bg-primary"></span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="B"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full flex flex-col items-center"
              >
                <h2 className="text-[28px] md:text-[32px] font-normal mb-3 text-secondary">큰일이다!</h2>
                <div className="flex items-center gap-2 text-gray-500 font-bold text-xs md:text-sm">
                  <span className="w-4 h-px bg-primary"></span>
                  <p>우리 애가 왜 저러는지 알려드리죠.</p>
                  <span className="w-4 h-px bg-primary"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <PrimaryButton onClick={onNext} className="w-full max-w-[230px] z-10">
          검사 시작
        </PrimaryButton>
        {history.length > 0 && (
          <div className="w-full z-10 border-t border-outline pt-4 mt-6">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">Previous Diagnoses</p>
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {history.map((item, idx) => (
                <div key={item.id} className="w-12 h-16 shrink-0 border border-outline bg-white p-1 brutal-shadow">
                  <img src={item.photo} alt={`History ${idx}`} className="w-full h-full object-cover grayscale" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
