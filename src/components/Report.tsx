import { useEffect } from 'react';
import { TopBar, PrimaryButton } from './Shared';
import { playAlertSound } from '../utils/audio';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { Diagnosis } from '../utils/scoring';

export default function Report({ onNext, photo, userName, result }: { onNext: () => void, photo: string | null, userName: string, result: Diagnosis }) {
  useEffect(() => {
    playAlertSound();
    if (photo) {
      try {
        const historyStr = localStorage.getItem('diagnosis_history');
        let history = historyStr ? JSON.parse(historyStr) : [];
        const newEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          photo,
          name: userName,
          grade: result.grade,
          score: result.score,
          serial: result.serial,
        };
        history = [newEntry, ...history.filter((h: any) => h.serial !== result.serial)].slice(0, 10);
        localStorage.setItem('diagnosis_history', JSON.stringify(history));
      } catch (e) {
        console.error("Failed to save history", e);
      }
    }
  }, [photo, userName, result]);

  const currentDateTime = new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-surface flex flex-col relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>
      <TopBar title="DIAGNOSTIC PROTOCOL" currentStep={4} />

      <main className="flex-grow p-4 md:p-6 w-full max-w-xl mx-auto flex flex-col relative z-10">

        <div className="bg-white border-2 border-secondary p-4 md:p-6 brutal-shadow mb-6 flex-col flex gap-4">
          <header className="flex flex-col items-center border-b-2 border-secondary pb-4 mb-2">
            <p className="font-mono text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase mb-1">국립 중2병 측정 연구소</p>
            <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tighter uppercase mb-1">중2력 진단 보고서</h1>
            <p className="font-mono text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">{currentDateTime} · {result.serial}</p>
          </header>

          <div className="flex flex-row gap-4">
            <div className="w-1/3 aspect-[3/4] border-2 border-secondary shrink-0 relative bg-gray-100 p-1">
              <img src={photo || "./face.png"} alt="Captured" className="w-full h-full object-cover grayscale contrast-125" />
              <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-[8px] text-center py-0.5 font-bold uppercase">CLASSIFIED</div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase">대상자 성명</span>
                <span className="text-xl md:text-2xl font-black text-secondary border-b border-gray-300 pb-1 truncate">{userName || '알 수 없음'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase">위험 등급</span>
                <div className="flex items-baseline gap-2 border-b border-gray-300 pb-1">
                  <span className="text-2xl md:text-3xl font-black text-primary shrink-0">{result.gradeCode}</span>
                  <span className="text-sm md:text-base font-black text-secondary truncate">{result.gradeLabel}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase">종합 중2력</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-gray-200 border border-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${result.score}%` }} />
                  </div>
                  <span className="font-mono text-sm font-black text-secondary shrink-0">{result.score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 판정 */}
          <div className="border-2 border-primary bg-orange-50 p-3">
            <span className="text-[10px] text-primary font-black uppercase block mb-1 tracking-widest">최종 판정</span>
            <p className="text-sm font-black text-secondary leading-relaxed">{result.verdict}</p>
          </div>

          {/* 이세계 자아 */}
          <div className="border-2 border-secondary bg-secondary text-white p-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern-light opacity-20 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 border-2 border-white/40 flex items-center justify-center">
                <span className="text-2xl font-black">{result.element.sign}</span>
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 block">Alter Ego · {result.element.en}</span>
                <p className="text-base md:text-lg font-black truncate">{result.alterEgo}</p>
                <p className="text-[10px] font-bold text-white/60">{result.archetype} · 빙고 {result.bingoCount}칸 반응</p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-secondary pt-4 mt-2">
            <h2 className="text-sm font-black uppercase text-secondary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span> 능력치 스캔
            </h2>
            <div className="h-56 w-full mt-2 bg-gray-50 border border-outline rounded p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.stats}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="능력치" dataKey="A" stroke="#ff5100" fill="#ff5100" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-3">
              {result.stats.map((s) => (
                <div key={s.subject} className={`border p-1.5 text-center ${s.subject === result.dominant ? 'border-primary bg-orange-50' : 'border-outline bg-white'}`}>
                  <div className="text-[9px] font-bold text-gray-500 truncate">{s.subject}</div>
                  <div className={`text-base font-black ${s.subject === result.dominant ? 'text-primary' : 'text-secondary'}`}>{s.A}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-secondary pt-4">
            <h2 className="text-sm font-black uppercase text-secondary mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">warning</span> 상세 진단 소견
            </h2>
            <div className="flex flex-col gap-3">
              <div className="bg-orange-50 p-3 border-l-4 border-primary">
                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">주요 증상 · {result.dominant} 우세</span>
                <p className="text-sm font-bold text-secondary">{result.symptom}</p>
              </div>
              <div className="bg-gray-100 p-3 border-l-4 border-gray-400">
                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">관찰 특이사항</span>
                <p className="text-sm font-bold text-secondary">{result.note}</p>
              </div>
              <div className="bg-white p-3 border-l-4 border-secondary border border-outline">
                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">센터 처방</span>
                <p className="text-sm font-bold text-secondary leading-relaxed">{result.prescription}</p>
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
