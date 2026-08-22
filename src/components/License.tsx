import { useState } from 'react';
import { motion } from 'motion/react';
import { TopBar, PrimaryButton, SecondaryButton } from './Shared';
import type { Diagnosis } from '../utils/scoring';

const MICRO = '중2병감별센터·NATIONALCHU2RESEARCHINSTITUTE·본증서는위조할수없습니다·';

export default function License({
  onNext,
  photo,
  userName,
  result,
}: {
  onNext: () => void;
  photo: string | null;
  userName: string;
  result: Diagnosis;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const issued = new Date();
  const expires = new Date(issued.getFullYear() + 2, issued.getMonth(), issued.getDate());
  const fmt = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  const mrzDate = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

  const pad = (s: string, n: number) => (s + '<'.repeat(n)).slice(0, n);
  const nameKey = (userName || 'UNKNOWN').toUpperCase().replace(/[^A-Z0-9]/g, '') || 'UNKNOWN';
  const mrz1 = `C2<KOR${pad(result.element.en, 12)}${pad(nameKey, 14)}`;
  const mrz2 = `${pad(result.gradeCode, 3)}${result.serial.replace(/\D/g, '').slice(0, 8)}<${mrzDate(
    issued
  )}<${mrzDate(expires)}<${String(result.score).padStart(3, '0')}`;

  const Card = () => (
    <motion.div
      className="relative w-full h-full transform-style-3d cursor-pointer"
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 22 }}
      onClick={() => setIsFlipped((f) => !f)}
    >
      {/* ================= FRONT ================= */}
      <div className="absolute inset-0 backface-hidden bg-[#f4efdf] border-2 border-secondary rounded-xl overflow-hidden flex flex-col brutal-shadow">
        {/* 보안 배경 */}
        <div className="absolute inset-0 guilloche pointer-events-none" />
        <div className="absolute inset-0 latent opacity-[0.35] pointer-events-none" />

        {/* 마이크로텍스트 테두리 */}
        <div className="absolute top-[3px] left-0 right-0 microtext text-secondary/45 px-1 pointer-events-none">
          {MICRO.repeat(6)}
        </div>
        <div className="absolute bottom-[3px] left-0 right-0 microtext text-secondary/45 px-1 pointer-events-none">
          {MICRO.repeat(6)}
        </div>

        {/* 내부 괘선 */}
        <div className="absolute inset-[7px] border border-secondary/45 rounded-lg pointer-events-none" />

        {/* --- 헤더 --- */}
        <header className="relative z-10 flex items-center gap-2 px-3.5 pt-3.5 pb-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-secondary text-[#f4efdf] flex items-center justify-center shrink-0 border border-secondary">
            <span className="text-[15px] font-black leading-none">{result.element.sign}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[12.5px] font-black tracking-tight text-secondary leading-tight truncate emboss">
              국립 중2병 측정 연구소
            </h1>
            <p className="text-[6.5px] text-secondary/65 font-bold tracking-[0.2em] leading-tight">
              NATIONAL CHU-2 RESEARCH INSTITUTE
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[6px] font-black tracking-[0.16em] text-secondary/60">ID CARD</p>
            <p className="text-[7px] font-mono font-black text-primary">{result.serial}</p>
          </div>
        </header>

        <div className="relative z-10 h-px bg-secondary/50 mx-3.5 shrink-0" />

        {/* --- 본문 --- */}
        <div className="relative z-10 flex flex-col px-3.5 py-2.5 flex-1 min-h-0 gap-2">
          {/* 상단: 사진 + 인적사항 */}
          <div className="flex gap-3 shrink-0">
            <div className="w-[30%] max-w-[96px] shrink-0 flex flex-col gap-1">
              <div className="relative w-full aspect-[3/4] border border-secondary bg-gray-200 overflow-hidden">
                <img
                  src={photo || './face.png'}
                  alt="ID"
                  className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute inset-0 holo-sheen opacity-25 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 bg-secondary/85 text-[5.5px] text-[#f4efdf] text-center font-black tracking-[0.14em] py-[1.5px]">
                  SPECIMEN
                </div>
              </div>

              {/* 고스트 포토 — 실제 신분증의 부(副)사진 */}
              <div className="relative w-full aspect-[5/3] border border-secondary/40 bg-gray-100 overflow-hidden">
                <img
                  src={photo || './face.png'}
                  alt=""
                  className="w-full h-full object-cover grayscale opacity-30 contrast-150"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[5.5px] font-black tracking-[0.18em] text-secondary/70">GHOST</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-[7px]">
              <Field label="성명 / NAME" value={userName || '알 수 없음'} strong />
              <Field label="이세계 자아 / ALTER EGO" value={result.alterEgo} accent />
              <Field label="속성 / ELEMENT" value={`${result.element.sign} ${result.element.name}`} />
              <Field label="유형 / TYPE" value={result.archetype} small />
            </div>
          </div>

          {/* 중단: 능력치 계측 기록 */}
          <div className="flex-1 min-h-0 border-t border-secondary/35 pt-1.5 flex flex-col">
            <div className="flex items-baseline justify-between mb-1 shrink-0">
              <p className="text-[5.5px] font-black tracking-[0.16em] text-secondary/55 uppercase">
                계측 기록 / MEASURED VALUES
              </p>
              <p className="text-[5.5px] font-black tracking-[0.14em] text-secondary/45">
                종합 {result.score}
              </p>
            </div>
            <div className="flex-1 min-h-0 grid grid-cols-2 gap-x-2.5 gap-y-[3px] content-center">
              {result.stats.map((s) => (
                <div key={s.subject} className="flex items-center gap-1.5">
                  <span
                    className={`text-[6px] font-black w-[26px] shrink-0 truncate ${
                      s.subject === result.dominant ? 'text-primary' : 'text-secondary/70'
                    }`}
                  >
                    {s.subject}
                  </span>
                  <div className="flex-1 h-[4px] bg-secondary/12 overflow-hidden">
                    <div
                      className={s.subject === result.dominant ? 'h-full bg-primary' : 'h-full bg-secondary/55'}
                      style={{ width: `${s.A}%` }}
                    />
                  </div>
                  <span className="text-[6px] font-mono font-black text-secondary/70 w-[13px] text-right shrink-0">
                    {s.A}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 하단: 등급 칩 + 홀로그램 */}
          <div className="flex items-end justify-between gap-2 shrink-0">
            <div className="border-2 border-primary bg-primary/10 px-2 py-1 min-w-0">
              <p className="text-[5.5px] font-black tracking-[0.16em] text-secondary/60 leading-none mb-0.5">
                GRADE
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[19px] font-black text-primary leading-none emboss">
                  {result.gradeCode}
                </span>
                <span className="text-[8px] font-black text-secondary truncate">{result.gradeLabel}</span>
              </div>
            </div>

            <div className="relative w-11 h-11 shrink-0 border border-secondary/40 overflow-hidden bg-white/40">
              <div className="absolute inset-0 holo-patch opacity-80" />
              <div className="absolute inset-0 holo-sheen opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[13px] font-black text-secondary/85 leading-none">
                  {result.element.sign}
                </span>
                <span className="text-[4.5px] font-black tracking-[0.12em] text-secondary/70 mt-0.5">
                  VALID
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- 하단: 발급/만료 + MRZ --- */}
        <div className="relative z-10 shrink-0">
          <div className="flex justify-between items-center px-3.5 pb-1 text-[6px] font-bold text-secondary/70">
            <span>발급 {fmt(issued)}</span>
            <span className="text-primary font-black animate-pulse">탭하여 뒷면 확인</span>
            <span>만료 {fmt(expires)}</span>
          </div>
          <div className="bg-[#eae3cd] border-t border-secondary/50 px-2 py-1">
            <p className="mrz text-[7px] text-secondary/90 leading-[1.35]">{mrz1}</p>
            <p className="mrz text-[7px] text-secondary/90 leading-[1.35]">{mrz2}</p>
          </div>
        </div>
      </div>

      {/* ================= BACK ================= */}
      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fbfaf6] border-2 border-secondary rounded-xl overflow-hidden flex flex-col brutal-shadow">
        <div className="absolute inset-0 guilloche opacity-70 pointer-events-none" />

        {/* 자기 띠 */}
        <div className="relative z-10 h-7 bg-secondary shrink-0 mt-2.5 flex items-center px-3">
          <div className="holo-sheen opacity-20 absolute inset-0" />
          <span className="microtext text-white/50 relative z-10">{MICRO.repeat(5)}</span>
        </div>

        <header className="relative z-10 px-3.5 pt-2.5 pb-1.5 shrink-0">
          <h2 className="text-[13px] font-black text-secondary leading-tight emboss">보유자의 권리와 책임</h2>
          <p className="font-mono text-[6.5px] text-secondary/55 font-bold mt-0.5">
            문서번호 {result.serial} · 시행령 제2조 제4항
          </p>
        </header>

        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-3.5 space-y-[5px] text-[8px] font-bold text-secondary leading-snug">
          {[
            '질문 없이 1년 연속 검은색 의류를 착용할 권리.',
            '지정 시간 내 무제한 멍때림(뇌내 시뮬레이션) 허가.',
            '이어폰 착용을 통한 현실 단절 권리. 단, 횡단보도 제외.',
            '심야 감성 서술 및 익일 삭제 무제한 허용.',
            '필살기 명명권 최대 3건. 중복 등록 불가.',
            '본인이 서사의 주인공이라 주장할 권리. 증명 책임은 면제.',
          ].map((t, i) => (
            <div key={i} className="flex gap-1.5">
              <span className="font-mono text-primary shrink-0">{String(i + 1).padStart(2, '0')}.</span>
              <p>{t}</p>
            </div>
          ))}

          <div className="border border-secondary/40 bg-white/70 p-1.5 mt-2">
            <p className="text-[6px] font-black tracking-[0.14em] text-secondary/60 mb-0.5">센터 처방</p>
            <p className="text-[8px] leading-snug">{result.prescription}</p>
          </div>

          {/* 개인 특기사항 */}
          <div className="border-t border-secondary/30 pt-1.5 mt-2 space-y-1.5">
            <p className="text-[6px] font-black tracking-[0.14em] text-secondary/55">특기사항 / REMARKS</p>
            <div className="flex gap-1.5">
              <span className="text-[6.5px] font-black text-secondary/50 w-[34px] shrink-0 pt-[1px]">주요증상</span>
              <p className="text-[7.5px] leading-snug flex-1">{result.symptom}</p>
            </div>
            <div className="flex gap-1.5">
              <span className="text-[6.5px] font-black text-secondary/50 w-[34px] shrink-0 pt-[1px]">관찰</span>
              <p className="text-[7.5px] leading-snug flex-1">{result.note}</p>
            </div>
            <div className="flex gap-1.5">
              <span className="text-[6.5px] font-black text-secondary/50 w-[34px] shrink-0 pt-[1px]">판정</span>
              <p className="text-[7.5px] leading-snug flex-1 text-primary font-black">{result.verdict}</p>
            </div>
          </div>

          {/* 발급 정보 */}
          <div className="grid grid-cols-3 gap-1 border-t border-secondary/30 pt-1.5 mt-2 pb-1">
            {[
              ['종합수치', String(result.score)],
              ['우세속성', `${result.element.sign} ${result.element.name}`],
              ['빙고반응', `${result.bingoCount}칸`],
            ].map(([k, v]) => (
              <div key={k} className="border border-secondary/25 bg-white/60 px-1 py-[3px] text-center">
                <p className="text-[5px] font-black tracking-[0.1em] text-secondary/50 leading-none">{k}</p>
                <p className="text-[8px] font-black text-secondary leading-tight mt-[2px] truncate">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 shrink-0 px-3.5 py-2">
          <div className="bg-orange-50 border border-primary p-1.5 mb-1.5">
            <div className="flex items-center gap-1 text-primary mb-0.5">
              <span className="material-symbols-outlined text-[10px]">warning</span>
              <span className="text-[6.5px] font-black tracking-[0.14em]">공식 경고</span>
            </div>
            <p className="font-mono text-[6.5px] text-secondary/70 leading-tight">
              본 약관 위반 시 주인공 특권이 즉시 취소됩니다. 본 센터는 소급 적용하여 오글거림을 집행할 권리를
              보유합니다.
            </p>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="h-6 barcode-strip w-full opacity-85" />
              <p className="font-mono text-[5.5px] font-black mt-0.5 text-secondary/70">{result.serial}</p>
            </div>
            <div className="text-center shrink-0 relative pr-1">
              {/* 원형 직인 */}
              <div className="absolute -top-3 -right-1 w-11 h-11 rounded-full border-2 border-red-700/70 stamp-ink flex items-center justify-center rotate-[-14deg] pointer-events-none opacity-90">
                <div className="absolute inset-[3px] rounded-full border border-dashed border-red-700/50" />
                <span className="text-[5px] font-black text-red-700/85 leading-[1.1] text-center">
                  중2병
                  <br />
                  감별센터
                  <br />
                  <span className="text-[4px]">OFFICIAL</span>
                </span>
              </div>
              <p
                className="text-[13px] text-secondary italic -rotate-6 mr-6"
                style={{ fontFamily: '"Caveat", "Brush Script MT", cursive' }}
              >
                Darkness
              </p>
              <div className="w-16 border-b border-secondary/60 mb-0.5 mr-6" />
              <p className="text-[5px] font-black tracking-[0.14em] text-secondary/60 mr-6">감별 센터장</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex-1 min-h-0 bg-surface flex flex-col">
      <TopBar title="DIAGNOSTIC PROTOCOL" currentStep={5} />

      <main className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center p-4 relative perspective-1000">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
        {/* 화면 높이에 맞춰 카드가 항상 들어가도록 계산 */}
        <div
          className="relative w-full max-w-[330px] shrink-0"
          style={{ height: 'min(calc(100dvh - 262px), 486px)', minHeight: 400 }}
        >
          <Card />
        </div>
      </main>

      <div className="p-3 flex gap-2 justify-center border-t border-outline bg-white z-20 shrink-0">
        <SecondaryButton onClick={() => setIsFullscreen(true)} className="flex-1 text-xs py-2.5">
          <span className="material-symbols-outlined text-base">fullscreen</span> 크게 보기
        </SecondaryButton>
        <PrimaryButton onClick={onNext} className="flex-1 text-xs py-2.5">
          <span className="material-symbols-outlined text-base">workspace_premium</span> 수료증
        </PrimaryButton>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/92 z-50 flex flex-col items-center justify-center perspective-1000 p-5">
          <button
            onClick={() => {
              setIsFullscreen(false);
              setIsFlipped(false);
            }}
            className="absolute top-5 right-5 text-white z-[60] bg-white/10 w-11 h-11 rounded-full flex items-center justify-center border border-white/30 hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <div
            className="relative w-full max-w-[390px]"
            style={{ height: 'min(calc(100dvh - 120px), 560px)' }}
          >
            <Card />
          </div>
          <p className="text-white/50 text-[11px] font-bold mt-4 tracking-wider">카드를 탭하면 뒤집힙니다</p>
        </div>
      )}
    </div>
  );
}

/* ---------- 필드 헬퍼 ---------- */
function Field({
  label,
  value,
  strong,
  accent,
  small,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[5.5px] font-black tracking-[0.16em] text-secondary/55 leading-none mb-[3px] uppercase">
        {label}
      </p>
      <p
        className={`border-b border-secondary/45 pb-[2px] truncate leading-tight ${
          strong ? 'text-[13px] font-black' : small ? 'text-[8px] font-bold' : 'text-[9.5px] font-black'
        } ${accent ? 'text-primary' : 'text-secondary'}`}
      >
        {value}
      </p>
    </div>
  );
}
