import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { PrimaryButton, SecondaryButton } from './Shared';
import type { Diagnosis } from '../utils/scoring';

const GOLD = '#b8952f';
const MICRO = '대한민국중2병감별센터·본증서의위조는흑역사로처벌됩니다·';

export default function Certificate({
  onRestart,
  photo,
  userName,
  result,
}: {
  onRestart: () => void;
  photo: string | null;
  userName: string;
  result: Diagnosis;
}) {
  const certRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
  }, []);

  const now = new Date();
  const dateKo = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

  const handleDownload = async () => {
    if (!certRef.current || busy) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(certRef.current, {
        pixelRatio: 2,
        backgroundColor: '#fdfbf7',
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `중2병_수료증_${userName || '익명'}_${result.gradeCode}.png`;
      link.href = dataUrl;
      link.click();
      window.dispatchEvent(new CustomEvent('show-toast', { detail: '수료증이 저장되었습니다.' }));
    } catch (e) {
      console.error(e);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: '저장에 실패했습니다.' }));
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const text = `[국립 중2병 측정 연구소] ${userName || '익명'} · ${result.gradeCode}등급 ${result.gradeLabel}\n"${result.alterEgo}"\n종합 중2력 ${result.score}점`;
    if (navigator.share) {
      try {
        await navigator.share({ title: '나의 중2병 수료증', text, url: window.location.href });
      } catch {
        /* 사용자가 취소함 */
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        window.dispatchEvent(new CustomEvent('show-toast', { detail: '결과가 복사되었습니다.' }));
      } catch {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: '공유를 지원하지 않는 환경입니다.' }));
      }
    }
  };

  return (
    <div className="flex-1 min-h-0 bg-surface flex flex-col relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 relative z-10">
        <div
          ref={certRef}
          className="w-full max-w-[420px] mx-auto bg-[#fdfbf7] relative overflow-hidden"
          style={{ border: `2px solid ${GOLD}`, aspectRatio: '1 / 1.414' }}
        >
          {/* 기요셰 배경 */}
          <div className="absolute inset-0 guilloche opacity-80 pointer-events-none" />

          {/* 마이크로텍스트 테두리 */}
          <div className="absolute top-[3px] left-0 right-0 microtext px-1 pointer-events-none" style={{ color: `${GOLD}cc` }}>
            {MICRO.repeat(7)}
          </div>
          <div className="absolute bottom-[3px] left-0 right-0 microtext px-1 pointer-events-none" style={{ color: `${GOLD}cc` }}>
            {MICRO.repeat(7)}
          </div>

          {/* 이중 괘선 */}
          <div className="absolute inset-[8px] pointer-events-none" style={{ border: `1px solid ${GOLD}99` }} />
          <div className="absolute inset-[12px] pointer-events-none" style={{ border: `0.5px solid ${GOLD}55` }} />

          {/* 모서리 장식 */}
          {[
            'top-3 left-3 border-t-2 border-l-2',
            'top-3 right-3 border-t-2 border-r-2',
            'bottom-3 left-3 border-b-2 border-l-2',
            'bottom-3 right-3 border-b-2 border-r-2',
          ].map((c, i) => (
            <div key={i} className={`absolute w-7 h-7 ${c} pointer-events-none`} style={{ borderColor: GOLD }} />
          ))}

          {/* 워터마크 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[150px] font-black opacity-[0.045] select-none" style={{ color: GOLD }}>
              {result.element.sign}
            </span>
          </div>

          {/* ---------- 내용 ---------- */}
          <div className="relative z-10 h-full flex flex-col items-center text-center px-6 py-7">
            {/* 기관명 */}
            <p className="font-serif text-[9px] tracking-[0.28em] font-bold shrink-0" style={{ color: '#6b6250' }}>
              국립 중2병 측정 연구소
            </p>
            <p className="font-serif text-[6px] tracking-[0.22em] font-bold mt-0.5 shrink-0" style={{ color: '#9b9484' }}>
              NATIONAL CHU-2 RESEARCH INSTITUTE
            </p>
            <div className="h-px w-14 my-2.5 shrink-0" style={{ background: GOLD }} />

            {/* 제목 */}
            <h1 className="font-serif text-[32px] font-black text-secondary tracking-[0.22em] leading-none shrink-0 emboss">
              수료증
            </h1>
            <p className="font-serif text-[7.5px] uppercase tracking-[0.3em] font-bold mt-1.5 shrink-0" style={{ color: '#8a8371' }}>
              Certificate of Completion
            </p>
            <p className="font-mono text-[7px] font-bold mt-1 shrink-0" style={{ color: '#a09a88' }}>
              제 {result.serial} 호
            </p>

            {/* 사진 */}
            <div
              className="mt-3 w-[62px] h-[78px] p-[3px] bg-white shrink-0 relative"
              style={{ border: `1.5px solid ${GOLD}` }}
            >
              <img
                src={photo || './face.png'}
                alt="ID"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>

            {/* 성명 */}
            <div className="mt-3 w-full max-w-[230px] shrink-0">
              <p className="font-serif text-[8px] font-bold mb-0.5" style={{ color: '#8a8371' }}>
                성명
              </p>
              <div className="border-b pb-1" style={{ borderColor: '#151050' }}>
                <h3 className="font-serif text-[22px] font-black text-secondary tracking-[0.15em] truncate">
                  {userName || '알 수 없음'}
                </h3>
              </div>
            </div>

            {/* 등급 + 자아 */}
            <div className="mt-3 flex items-stretch gap-2 w-full max-w-[250px] shrink-0">
              <div className="flex-1 border px-2 py-1.5" style={{ borderColor: GOLD, background: '#fffdf6' }}>
                <p className="font-serif text-[6.5px] font-bold tracking-[0.16em]" style={{ color: '#8a8371' }}>
                  판정 등급
                </p>
                <p className="text-[17px] font-black text-primary leading-tight emboss">{result.gradeCode}</p>
                <p className="text-[7.5px] font-black text-secondary truncate">{result.gradeLabel}</p>
              </div>
              <div className="flex-[1.5] border px-2 py-1.5 text-left" style={{ borderColor: GOLD, background: '#fffdf6' }}>
                <p className="font-serif text-[6.5px] font-bold tracking-[0.16em]" style={{ color: '#8a8371' }}>
                  이세계 자아 · {result.element.name}
                </p>
                <p className="text-[9.5px] font-black text-secondary leading-tight mt-0.5 break-keep">
                  {result.alterEgo}
                </p>
                <p className="text-[7px] font-bold mt-0.5" style={{ color: '#8a8371' }}>
                  종합 중2력 {result.score}점
                </p>
              </div>
            </div>

            {/* 본문 */}
            <p
              className="font-serif text-[9px] leading-[1.75] text-secondary mt-3.5 shrink-0 break-keep px-1"
              style={{ textAlignLast: 'center' }}
            >
              위 사람은 본 연구소가 시행한 중2병 측정 전 과정을 성실히 이수하였으며,
              그 결과가 위와 같음을 확인하여 이 증서를 수여합니다.
              <br />
              <span className="font-bold">지금의 이 모습 또한 당신의 성장의 일부였음을 인증하며, 응원합니다.</span>
            </p>

            {/* 하단: 날짜 / 인장 / 서명 */}
            <div className="w-full flex items-end justify-between mt-auto gap-1 px-1 shrink-0">
              <div className="w-[32%] text-center">
                <div className="border-b pb-1 mb-1" style={{ borderColor: '#151050' }}>
                  <p className="font-serif text-[7.5px] text-secondary font-bold">{dateKo}</p>
                </div>
                <p className="font-serif text-[6px] uppercase tracking-[0.18em] font-bold" style={{ color: '#8a8371' }}>
                  Date
                </p>
              </div>

              {/* 밀랍 인장 */}
              <div className="w-[32%] flex justify-center relative">
                <div className="relative -rotate-12">
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-5 h-9 bg-red-800 -rotate-12 origin-top skew-y-12 border border-red-950" />
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-5 h-9 bg-red-700 rotate-12 origin-top -skew-y-12 border border-red-950" />
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative bg-red-600 border-2 border-red-800 z-10"
                    style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}
                  >
                    <div className="absolute inset-1 rounded-full border border-dashed border-red-900/60" />
                    <span className="text-[9px] font-black leading-[1.1] text-center" style={{ color: GOLD }}>
                      {result.element.sign}
                      <br />
                      <span className="text-[4.5px] tracking-tight">인증필</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-[32%] text-center">
                <div className="border-b pb-1 mb-1 relative h-6 flex items-end justify-center" style={{ borderColor: '#151050' }}>
                  <span
                    className="text-[17px] text-secondary -rotate-12 italic absolute bottom-0.5"
                    style={{ fontFamily: '"Caveat", "Brush Script MT", cursive' }}
                  >
                    Darkness
                  </span>
                </div>
                <p className="font-serif text-[6px] uppercase tracking-[0.18em] font-bold" style={{ color: '#8a8371' }}>
                  감별 센터장
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 w-full shrink-0 p-3 border-t border-outline bg-white z-20">
        <PrimaryButton onClick={handleDownload} disabled={busy} className="flex-1 text-[11px] py-2.5">
          <span className="material-symbols-outlined text-base">download</span>
          {busy ? '저장 중' : '다운로드'}
        </PrimaryButton>
        <SecondaryButton onClick={handleShare} className="flex-1 text-[11px] py-2.5">
          <span className="material-symbols-outlined text-base">share</span> 공유
        </SecondaryButton>
        <SecondaryButton onClick={onRestart} className="flex-1 text-[11px] py-2.5">
          <span className="material-symbols-outlined text-base">replay</span> 재검사
        </SecondaryButton>
      </div>
    </div>
  );
}
