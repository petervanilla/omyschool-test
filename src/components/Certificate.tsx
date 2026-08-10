import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PrimaryButton, SecondaryButton } from './Shared';

export default function Certificate({ onRestart, photo, userName, grade, symptom, note }: { onRestart: () => void, photo: string | null, userName: string, grade: string, symptom: string, note: string }) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const currentDateTime = new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-surface flex flex-col items-center p-4 md:p-6 relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>
      
      <div className="flex-1 w-full max-w-xl flex flex-col min-h-0 relative z-10 gap-4">
        <main className="w-full bg-[#fdfbf7] brutal-shadow relative p-4 md:p-8 border-2 border-[#d4af37] flex-1 flex flex-col min-h-0">
          {/* Corner Decors */}
          <div className="absolute top-2 left-2 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-[#d4af37] opacity-50"></div>
          <div className="absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-[#d4af37] opacity-50"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-[#d4af37] opacity-50"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-[#d4af37] opacity-50"></div>
          <div className="border border-[#d4af37] h-full p-6 md:p-10 flex flex-col items-center text-center bg-[#fdfbf7] relative overflow-hidden">
            
            <h2 className="font-serif text-[10px] md:text-xs tracking-[0.2em] uppercase text-gray-700 mb-4 font-bold shrink-0">대한민국 중2병 감별센터</h2>
            <div className="h-px w-12 bg-[#d4af37] mx-auto mb-6 shrink-0"></div>
            
            <h1 className="font-serif text-3xl md:text-5xl font-black text-secondary tracking-widest mb-2 shrink-0">수료증</h1>
            <p className="font-serif text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-4 font-bold shrink-0">Certificate of Completion</p>
            <div className="mb-4 w-20 h-24 border-2 border-[#d4af37] p-1 bg-white mx-auto shadow-sm shrink-0">
              <img src={photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"} alt="ID" className="w-full h-full object-cover grayscale contrast-125" />
            </div>
            <div className="mb-4 w-full max-w-[240px] mx-auto shrink-0">
              <p className="font-serif text-[10px] md:text-xs text-gray-500 mb-1 font-bold">성명</p>
              <div className="border-b border-secondary pb-1">
                <h3 className="font-serif text-xl md:text-3xl font-black text-secondary tracking-widest">{userName || '알 수 없음'}</h3>
              </div>
            </div>
            <p className="font-serif text-[10px] md:text-sm leading-relaxed text-secondary text-justify mb-4 overflow-y-auto shrink-0" style={{ textAlignLast: 'center' }}>
              위 사람은 중2병 감별 센터의 모든 과정을 측정을 통하여<br/>
              충분히 검증 하였기에 이 증서를 수여합니다.<br/>
              지금의 이 모습도 당신의 성장의 일부였음을 인증하며 응원합니다.
            </p>
            <div className="w-full flex flex-row justify-between items-end mt-auto gap-2 md:gap-4 px-2 relative z-10 shrink-0">
              <div className="w-1/3 text-center">
                <div className="border-b border-secondary pb-1 mb-1">
                  <p className="font-serif text-[8px] md:text-xs text-secondary font-bold">{currentDateTime}</p>
                </div>
                <p className="font-serif text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest font-bold">Date</p>
              </div>
              <div className="w-1/3 flex justify-center relative">
                {/* Wax Seal with Ribbons */}
                <div className="relative transform -rotate-12">
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 md:w-8 md:h-12 bg-red-800 -rotate-12 z-0 origin-top skew-y-12 shadow-sm border border-red-950"></div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 md:w-8 md:h-12 bg-red-700 rotate-12 z-0 origin-top -skew-y-12 shadow-sm border border-red-950"></div>
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-[#d4af37] relative bg-red-600 shadow-md border-2 border-red-800 z-10 shrink-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 border border-dashed border-red-800 m-1 rounded-full opacity-50"></div>
                    <div className="text-center drop-shadow-md">
                      <span className="material-symbols-outlined block text-base md:text-2xl text-[#d4af37]">workspace_premium</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/3 text-center">
                <div className="border-b border-secondary pb-1 mb-1 relative h-6 flex items-end justify-center">
                  <span className="text-sm md:text-2xl text-secondary transform -rotate-12 italic absolute bottom-0.5" style={{ fontFamily: '"Caveat", "Brush Script MT", cursive' }}>Darkness</span>
                </div>
                <p className="font-serif text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest font-bold">감별 센터장</p>
              </div>
            </div>
          </div>
        </main>
        <div className="flex flex-row gap-2 w-full shrink-0">
          <PrimaryButton className="flex-1 text-[10px] md:text-sm py-2">
            <span className="material-symbols-outlined text-sm md:text-base">download</span> 다운로드
          </PrimaryButton>
          <SecondaryButton onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title: '나의 중2병 수료증',
                  text: '대한민국 중2병 감별센터에서 측정을 완료했습니다.',
                  url: window.location.href,
                });
              } catch (err) {
                console.error('Share failed:', err);
              }
            } else {
              alert('공유하기 기능을 지원하지 않는 환경입니다.');
            }
          }} className="flex-1 text-[10px] md:text-sm py-2 border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors bg-white">
            <span className="material-symbols-outlined text-sm md:text-base">share</span> 공유하기
          </SecondaryButton>
          <SecondaryButton onClick={onRestart} className="flex-1 text-[10px] md:text-sm py-2 border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors bg-white">
            <span className="material-symbols-outlined text-sm md:text-base">replay</span> 다시 검사
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
