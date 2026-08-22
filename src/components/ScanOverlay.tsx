import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

/**
 * 안면 계측 가이드 오버레이.
 * 실제 인체계측(anthropometry) 기준선을 흉내낸 정렬 가이드 + 라이브 계측 수치.
 */
export default function ScanOverlay({ locked = false }: { locked?: boolean }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setT((v) => v + 1), 420);
    return () => clearInterval(iv);
  }, []);

  // 미세하게 흔들리는 계측값 (측정기가 살아있는 느낌)
  const wob = (base: number, amp: number, phase: number) =>
    base + Math.sin((t + phase) * 0.9) * amp;

  const ipd = wob(63.4, 0.6, 0).toFixed(1);
  const sym = wob(96.2, 1.4, 2).toFixed(1);
  const aura = wob(41.8, 2.2, 4).toFixed(1);
  const depth = wob(72, 5, 6).toFixed(0);

  const P = '#ff5100';
  const S = '#151050';

  return (
    <div className="absolute inset-0 pointer-events-none z-20 select-none">
      <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="sweep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={P} stopOpacity="0" />
            <stop offset="50%" stopColor={P} stopOpacity="0.55" />
            <stop offset="100%" stopColor={P} stopOpacity="0" />
          </linearGradient>
          <mask id="ovalMask">
            <rect width="300" height="400" fill="black" />
            <ellipse cx="150" cy="175" rx="78" ry="100" fill="white" />
          </mask>
        </defs>

        {/* --- 삼분할 격자 --- */}
        <g stroke={S} strokeOpacity="0.16" strokeWidth="0.6">
          <line x1="100" y1="0" x2="100" y2="400" />
          <line x1="200" y1="0" x2="200" y2="400" />
          <line x1="0" y1="133" x2="300" y2="133" />
          <line x1="0" y1="266" x2="300" y2="266" />
        </g>

        {/* --- 눈금자 (상단 / 좌측) --- */}
        <g stroke={S} strokeOpacity="0.45" strokeWidth="0.7">
          {Array.from({ length: 31 }).map((_, i) => (
            <line key={`tx${i}`} x1={i * 10} y1="0" x2={i * 10} y2={i % 5 === 0 ? 7 : 3.5} />
          ))}
          {Array.from({ length: 41 }).map((_, i) => (
            <line key={`ty${i}`} x1="0" y1={i * 10} x2={i % 5 === 0 ? 7 : 3.5} y2={i * 10} />
          ))}
        </g>
        <g fill={S} fillOpacity="0.5" fontSize="4.6" fontFamily="monospace" fontWeight="bold">
          {[50, 100, 150, 200, 250].map((x) => (
            <text key={`lx${x}`} x={x + 1.5} y="12">
              {x}
            </text>
          ))}
          {[100, 200, 300].map((y) => (
            <text key={`ly${y}`} x="9" y={y + 2} >
              {y}
            </text>
          ))}
        </g>

        {/* --- 안면 정렬 타원 --- */}
        <ellipse
          cx="150"
          cy="175"
          rx="78"
          ry="100"
          fill="none"
          stroke={P}
          strokeWidth="1.6"
          strokeDasharray="7 5"
          opacity="0.95"
        />
        <ellipse cx="150" cy="175" rx="86" ry="108" fill="none" stroke={P} strokeWidth="0.5" opacity="0.35" />

        {/* --- 수직 정중선 + 대칭 표식 --- */}
        <line x1="150" y1="60" x2="150" y2="292" stroke={P} strokeWidth="0.7" strokeDasharray="3 3" opacity="0.8" />
        <g stroke={P} strokeWidth="0.9" opacity="0.75">
          <line x1="144" y1="175" x2="150" y2="175" />
          <line x1="150" y1="175" x2="156" y2="175" />
          <line x1="147" y1="172" x2="144" y2="175" />
          <line x1="147" y1="178" x2="144" y2="175" />
          <line x1="153" y1="172" x2="156" y2="175" />
          <line x1="153" y1="178" x2="156" y2="175" />
        </g>

        {/* --- 인체계측 기준선 --- */}
        {[
          { y: 88, ko: '두정선', en: 'VERTEX' },
          { y: 152, ko: '안와선', en: 'ORBITAL' },
          { y: 200, ko: '비저선', en: 'SUBNASAL' },
          { y: 258, ko: '이부선', en: 'MENTAL' },
        ].map((l) => (
          <g key={l.en}>
            <line x1="58" y1={l.y} x2="234" y2={l.y} stroke={P} strokeWidth="0.6" strokeDasharray="2 2.5" opacity="0.7" />
            <circle cx="58" cy={l.y} r="1.5" fill={P} opacity="0.9" />
            <circle cx="234" cy={l.y} r="1.5" fill={P} opacity="0.9" />
            <text
              x="294"
              y={l.y - 1.4}
              fill={S}
              fontSize="4.2"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="end"
            >
              {l.en}
            </text>
            <text x="294" y={l.y + 4.2} fill={P} fontSize="4.6" fontWeight="bold" textAnchor="end">
              {l.ko}
            </text>
          </g>
        ))}

        {/* --- 동공 위치 표식 --- */}
        {[120, 180].map((x) => (
          <g key={x}>
            <circle cx={x} cy="152" r="7" fill="none" stroke={P} strokeWidth="0.8" opacity="0.85" />
            <circle cx={x} cy="152" r="1.4" fill={P} />
            <line x1={x - 11} y1="152" x2={x - 8} y2="152" stroke={P} strokeWidth="0.8" />
            <line x1={x + 8} y1="152" x2={x + 11} y2="152" stroke={P} strokeWidth="0.8" />
          </g>
        ))}
        {/* 동공간 거리 치수선 */}
        <g stroke={S} strokeWidth="0.6" opacity="0.8">
          <line x1="120" y1="128" x2="180" y2="128" />
          <line x1="120" y1="125" x2="120" y2="131" />
          <line x1="180" y1="125" x2="180" y2="131" />
        </g>
        <text x="150" y="124" fill={S} fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          IPD {ipd}
        </text>

        {/* --- 스캔 스윕 --- */}
        <motion.rect
          x="0"
          width="300"
          height="46"
          fill="url(#sweep)"
          mask="url(#ovalMask)"
          initial={{ y: 70 }}
          animate={{ y: [70, 235, 70] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* --- 모서리 브래킷 --- */}
        <g stroke={P} strokeWidth="1.6" fill="none">
          <path d="M14 30 L14 14 L30 14" />
          <path d="M270 14 L286 14 L286 30" />
          <path d="M14 370 L14 386 L30 386" />
          <path d="M286 370 L286 386 L270 386" />
        </g>

        {/* --- 촬영 제원 --- */}
        <g fill={S} fillOpacity="0.6" fontSize="4.8" fontFamily="monospace" fontWeight="bold">
          <text x="16" y="45">ISO 400 · f/2.8</text>
          <text x="284" y="45" textAnchor="end">50mm · AF-S</text>
        </g>
      </svg>

      {/* --- 상단 상태 표시 --- */}
      <div className="absolute top-2.5 left-0 right-0 flex justify-center">
        <div
          className={`flex items-center gap-1.5 px-2 py-[3px] border text-[8px] font-black tracking-[0.14em] backdrop-blur-sm ${
            locked ? 'border-primary bg-primary/90 text-white' : 'border-primary bg-white/85 text-primary'
          }`}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-current"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
          {locked ? 'TARGET LOCKED · 정렬 완료' : 'CALIBRATING · 얼굴을 타원에 맞추십시오'}
        </div>
      </div>

      {/* --- 하단 계측 패널 --- */}
      <div className="absolute bottom-0 left-0 right-0 bg-secondary/88 backdrop-blur-sm px-2 py-1.5">
        <div className="grid grid-cols-4 gap-1">
          {[
            ['동공간거리', `${ipd}`, 'mm'],
            ['안면대칭률', `${sym}`, '%'],
            ['오라주파수', `${aura}`, 'Hz'],
            ['눈빛심연도', `${depth}`, 'pt'],
          ].map(([label, val, unit]) => (
            <div key={label} className="text-center leading-none">
              <p className="text-[5.5px] font-bold text-white/55 tracking-tight">{label}</p>
              <p className="text-[10px] font-black text-white font-mono mt-[2px]">
                {val}
                <span className="text-[5.5px] text-primary ml-[1px]">{unit}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[5.5px] font-black text-white/45 tracking-[0.1em] shrink-0">SENSOR</span>
          <div className="flex-1 h-[3px] bg-white/15 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: ['20%', '92%', '46%', '78%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-[5.5px] font-mono font-black text-primary shrink-0">
            {locked ? 'OK' : 'ADJ'}
          </span>
        </div>
      </div>
    </div>
  );
}
