import { useEffect, useMemo } from 'react';
import { TopBar, PrimaryButton } from './Shared';
import { playAlertSound } from '../utils/audio';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function Report({ onNext, photo, userName, grade, symptom, note }: { onNext: () => void, photo: string | null, userName: string, grade: string, symptom: string, note: string }) {
  useEffect(() => {
    playAlertSound();
    if (photo) {
      try {
        const historyStr = localStorage.getItem('diagnosis_history');
        let history = historyStr ? JSON.parse(historyStr) : [];
        if (!history.some((item: any) => item.photo === photo)) {
          const newEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            photo: photo,
          };
          history = [newEntry, ...history].slice(0, 10);
          localStorage.setItem('diagnosis_history', JSON.stringify(history));
        }
      } catch (e) {
        console.error("Failed to save history", e);
      }
    }
  }, [photo]);

  const currentDateTime = new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  
  const statsData = useMemo(() => [
    { subject: '망상력', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: '흑염룡', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: '다크니스', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: '고독감', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: '전투력', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: '오글거림', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
  ], []);

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-surface flex flex-col relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>
      <TopBar title="DIAGNOSTIC PROTOCOL" currentStep={4} />
      
      <main className="flex-grow p-4 md:p-6 w-full max-w-xl mx-auto flex flex-col relative z-10">
        
        <div className="bg-white border-2 border-secondary p-4 md:p-6 brutal-shadow mb-6 flex-col flex gap-4">
          <header className="flex flex-col items-center border-b-2 border-secondary pb-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tighter uppercase mb-1">중2력 진단 보고서</h1>
            <p className="font-mono text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest">{currentDateTime}</p>
          </header>
          
          <div className="flex flex-row gap-4">
            <div className="w-1/3 aspect-[3/4] border-2 border-secondary shrink-0 relative bg-gray-100 p-1">
              <img src={photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"} alt="Captured" className="w-full h-full object-cover grayscale contrast-125" />
              <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-[8px] text-center py-0.5 font-bold uppercase">CLASSIFIED</div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase">대상자 성명</span>
                <span className="text-xl md:text-2xl font-black text-secondary border-b border-gray-300 pb-1">{userName || '알 수 없음'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase">위험 등급</span>
                <span className="text-xl md:text-2xl font-black text-primary border-b border-gray-300 pb-1 truncate">{grade}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t-2 border-secondary pt-4 mt-2">
            <h2 className="text-sm font-black uppercase text-secondary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span> 능력치 스캔
            </h2>
            <div className="h-56 w-full mt-2 bg-gray-50 border border-outline rounded p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={statsData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="능력치" dataKey="A" stroke="#ff5100" fill="#ff5100" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="border-t-2 border-secondary pt-4">
            <h2 className="text-sm font-black uppercase text-secondary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">warning</span> 상세 진단 소견
            </h2>
            <div className="flex flex-col gap-3">
              <div className="bg-orange-50 p-3 border-l-4 border-primary">
                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">주요 증상</span>
                <p className="text-sm font-bold text-secondary">{symptom}</p>
              </div>
              <div className="bg-gray-100 p-3 border-l-4 border-gray-400">
                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">관찰 특이사항</span>
                <p className="text-sm font-bold text-secondary">{note}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center opacity-70 border-t border-dashed border-gray-300 pt-4">
            <div className="h-10 barcode-strip w-full max-w-[200px] opacity-60"></div>
          </div>
        </div>
        
        <PrimaryButton onClick={() => { window.dispatchEvent(new CustomEvent("show-toast", { detail: "라이선스가 발급되었습니다." })); onNext(); }} className="w-full max-w-md mx-auto text-base py-3">
          라이선스 발급 <span className="material-symbols-outlined text-lg">badge</span>
        </PrimaryButton>
      </main>
    </div>
  );
}
