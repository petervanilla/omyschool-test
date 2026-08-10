import { useState } from 'react';
import { motion } from 'motion/react';
import { TopBar, PrimaryButton, SecondaryButton } from './Shared';

export default function License({ onNext, photo, userName, grade, symptom, note }: { onNext: () => void, photo: string | null, userName: string, grade: string, symptom: string, note: string }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const LicenseCard = ({ className = "" }: { className?: string }) => (
    <motion.div 
      className={`relative transform-style-3d z-10 cursor-pointer ${className}`}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* FRONT */}
      <div className="absolute inset-0 backface-hidden bg-[#f1ebd8] border-2 border-secondary rounded-xl p-4 md:p-6 flex flex-col brutal-shadow">
        <div className="absolute inset-2 md:inset-3 border border-secondary rounded-lg pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-4 z-10 border-b border-secondary pb-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center text-[#f1ebd8] shrink-0">
              <span className="material-symbols-outlined text-2xl md:text-3xl">shield_with_heart</span>
            </div>
            <div>
              <h1 className="text-base md:text-2xl font-black tracking-widest text-secondary truncate">중2병 감별센터</h1>
              <p className="text-[8px] md:text-[10px] text-gray-700 font-bold tracking-widest">OFFICIAL IDENTITY CARD</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 md:gap-6 z-10 flex-grow h-full items-center">
          <div className="w-[100px] md:w-[120px] flex flex-col shrink-0">
            <div className="w-full aspect-[3/4] bg-gray-200 border border-secondary overflow-hidden rounded-sm relative">
              <img src={photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"} alt="ID" className="w-full h-full object-cover grayscale contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50 mix-blend-overlay"></div>
            </div>
            <div className="mt-2 pt-1 border-t border-secondary text-center hidden md:block">
              <div className="h-6 barcode-strip w-full opacity-80"></div>
              <p className="text-[6px] font-mono font-bold mt-1">CHU-2-BYUNG-001</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col text-xs md:text-sm font-bold text-secondary">
            <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-y-2 md:gap-y-4 items-end">
              <div className="text-[10px] md:text-xs text-gray-600 uppercase">성명</div>
              <div className="border-b border-secondary pb-0.5 font-black text-sm md:text-base">{userName || '알 수 없음'}</div>
              
              <div className="text-[10px] md:text-xs text-gray-600 uppercase">등급</div>
              <div className="border-b border-secondary pb-0.5 font-black text-sm md:text-base text-primary">{grade}</div>
              
              <div className="text-[10px] md:text-xs text-gray-600 uppercase">주요 증상</div>
              <div className="border-b border-secondary pb-0.5 text-[10px] md:text-xs truncate">{symptom}</div>
              
              <div className="text-[10px] md:text-xs text-gray-600 uppercase">특이사항</div>
              <div className="border-b border-secondary pb-0.5 text-red-600 text-[10px] md:text-xs truncate">{note}</div>
            </div>
            
            <div className="mt-6 flex justify-between items-end relative">
              <p className="text-[8px] font-bold text-gray-500 animate-pulse bg-white/50 px-1 py-0.5 rounded border border-secondary/30">
                탭하여 뒷면 확인
              </p>
              <div className="text-center relative ml-auto">
                <div className="absolute -inset-2 border-2 border-red-600 rounded-full opacity-40 transform rotate-6 pointer-events-none flex items-center justify-center">
                  <span className="text-red-600 font-bold text-[6px] tracking-tighter opacity-70">OFFICIAL</span>
                </div>
                <p className="font-serif text-lg md:text-xl text-primary transform -rotate-6 italic mr-2">Darkness</p>
                <div className="w-16 md:w-24 border-b border-secondary mt-1 mb-0.5"></div>
                <p className="text-[5px] md:text-[6px] uppercase tracking-widest">AUTHORIZED SIGNATURE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BACK */}
      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-secondary rounded-xl p-4 md:p-6 flex flex-col brutal-shadow">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <header className="border-b-2 border-secondary pb-2 mb-4 z-10">
          <h1 className="text-lg md:text-2xl font-black text-secondary">보유자의 권리와 책임</h1>
          <p className="font-mono text-[8px] md:text-[10px] text-gray-500 font-bold mt-1">문서 번호: AS-773-B // 법적 조항</p>
        </header>
        
        <div className="flex-1 grid grid-cols-1 gap-y-2 md:gap-y-3 z-10 text-[10px] md:text-xs font-bold text-secondary overflow-y-auto">
          <div className="flex items-start gap-2"><span className="font-mono text-primary">01.</span><p>질문 없이 1년 연속 검은색 의류 착용 및 암흑 동기화 권리.</p></div>
          <div className="flex items-start gap-2"><span className="font-mono text-primary">02.</span><p>지정된 시간 동안 제한 없는 멍때림(뇌내 시뮬레이션) 허가.</p></div>
          <div className="flex items-start gap-2"><span className="font-mono text-primary">03.</span><p>이어폰 24시간 착용을 통한 일상적 소음 및 현실 단절 권리.</p></div>
          <div className="flex items-start gap-2"><span className="font-mono text-primary">04.</span><p>밤 12시 이후 감성 폭발 및 새벽 감성 글귀 작성 무제한 허용.</p></div>
          <div className="flex items-start gap-2"><span className="font-mono text-primary">05.</span><p>고독한 혼잣말 허용: 월간 무제한.</p></div>
          <div className="flex items-start gap-2"><span className="font-mono text-primary">06.</span><p>필살기 및 내면의 흑염룡 명명권: 최대 3개의 별칭 허용.</p></div>
        </div>
        
        <div className="mt-4 bg-orange-50 p-2 md:p-3 border border-primary rounded z-10 shrink-0">
          <div className="flex items-center gap-1 mb-1 text-primary">
            <span className="material-symbols-outlined text-xs md:text-sm">warning</span>
            <span className="text-[8px] md:text-[10px] font-black uppercase">공식 경고</span>
          </div>
          <p className="font-mono text-[8px] md:text-[9px] text-gray-600 leading-tight">
            본 약관 위반 시 주인공 증후군 특권이 즉시 취소될 수 있습니다. 본 센터는 소급 적용하여 오글거림을 집행할 권리를 보유합니다.
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-surface flex flex-col overflow-hidden">
      <TopBar title="DIAGNOSTIC PROTOCOL" currentStep={5} />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 w-full relative perspective-1000">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>
        
        <LicenseCard className="w-full max-w-[320px] min-h-[500px]" />
      </main>

      <div className="p-4 md:p-6 flex flex-col items-center gap-4 justify-center border-t border-outline bg-white z-20">
        <SecondaryButton onClick={() => setIsFullscreen(true)} className="w-full max-w-xs text-sm py-3">
          <span className="material-symbols-outlined text-lg">fullscreen</span> 전체보기
        </SecondaryButton>
        <PrimaryButton onClick={onNext} className="w-full max-w-xs text-sm py-3">
          <span className="material-symbols-outlined text-lg">workspace_premium</span> 수료증 확인하기
        </PrimaryButton>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center perspective-1000 p-4">
          <button 
            onClick={() => {
              setIsFullscreen(false);
              setIsFlipped(false);
            }} 
            className="absolute top-6 right-6 text-white z-[60] bg-white/10 w-12 h-12 rounded-full flex items-center justify-center border border-white/30 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <LicenseCard className="w-full max-w-md h-[480px]" />
        </div>
      )}
    </div>
  );
}
