import { useState, useEffect } from 'react';
import { TopBar, PrimaryButton } from './Shared';

const BINGO_SETS = [
  // SET 1: 감성/허세 (Emotion/Pretension)
  [
    { ko: "모자 눌러씀", en: "CAP PULLED DOWN" }, { ko: "주인공병", en: "PROTAGONIST" }, { ko: "무신사 중독", en: "MUSINSA ADDICT" }, { ko: "NPC 취급", en: "NPC TREATMENT" }, { ko: "멍때림", en: "ZONING OUT" },
    { ko: "좋아요 신경씀", en: "LIKE OBSESSED" }, { ko: "릴스 과몰입", en: "REELS ADDICT" }, { ko: "부모님 눈 피했음", en: "AVOIDING EYE CONTACT" }, { ko: "검은색 집착", en: "BLACK OBSESSION" }, { ko: "혼자 콘서트", en: "SOLO CONCERT" },
    { ko: "이어폰 지금 꼽음", en: "EARPHONES IN" }, { ko: "T발C야", en: "T OR C" }, { ko: "거울 표정 연습", en: "MIRROR PRACTICE" }, { ko: "MBTI 맹신", en: "MBTI BLIND FAITH" }, { ko: "프사 자주 바꿈", en: "PFP CHANGER" },
    { ko: "의미심장", en: "DEEP MEANING" }, { ko: "따짐", en: "ARGUING" }, { ko: "감성 과다", en: "OVERLY EMOTIONAL" }, { ko: "앞머리 신경쓰임", en: "BANGS OBSESSED" }, { ko: "BGM 필수", en: "BGM REQUIRED" },
    { ko: "인생곡 집착", en: "LIFE SONG" }, { ko: "우울한 곡 저장", en: "SAD SONGS" }, { ko: "팩폭 장인", en: "TRUTH BOMBER" }, { ko: "접는다 말했음", en: "I'M QUITTING" }, { ko: "비범함 추구", en: "EXTRAORDINARY" }
  ],
  // SET 2: 흑염룡/오글거림 (Dark Dragon/Cringe)
  [
    { ko: "크크큭 웃음", en: "EVIL LAUGH" }, { ko: "오른팔 결박", en: "SEALED ARM" }, { ko: "다크모드 집착", en: "DARK MODE ONLY" }, { ko: "세계관 최강자", en: "WORLD STRONGEST" }, { ko: "비오는날 산책", en: "RAIN WALK" },
    { ko: "후드 뒤집어씀", en: "HOOD UP" }, { ko: "내면의 괴물", en: "INNER MONSTER" }, { ko: "아무도 날 모름", en: "NOBODY KNOWS ME" }, { ko: "과거 회상", en: "FLASHBACK" }, { ko: "창밖 주시", en: "WINDOW GAZING" },
    { ko: "혼잣말 중얼", en: "MUMBLING" }, { ko: "차라리 내가...", en: "I RATHER..." }, { ko: "시크한 말투", en: "CHIC TONE" }, { ko: "가려진 한쪽 눈", en: "ONE EYE HIDDEN" }, { ko: "필살기 이름", en: "SPECIAL MOVE" },
    { ko: "상처받은 영혼", en: "SCARRED SOUL" }, { ko: "고독을 즐김", en: "ENJOY LONELINESS" }, { ko: "피의 숙명", en: "BLOOD FATE" }, { ko: "각성 대기중", en: "AWAKENING" }, { ko: "나만의 규칙", en: "MY OWN RULES" },
    { ko: "파멸의 노래", en: "SONG OF RUIN" }, { ko: "어둠의 다크", en: "DARK OF DARK" }, { ko: "봉인 해제", en: "SEAL BROKEN" }, { ko: "위험한 분위기", en: "DANGEROUS VIBE" }, { ko: "그녀석은 가짜", en: "HE IS FAKE" }
  ],
  // SET 3: 방구석 철학자 (Room Philosopher)
  [
    { ko: "인간 혐오", en: "MISANTHROPY" }, { ko: "자본주의 비판", en: "ANTI-CAPITALISM" }, { ko: "세상은 썩었어", en: "ROTTEN WORLD" }, { ko: "회의주의자", en: "SKEPTIC" }, { ko: "나는 달라", en: "I AM DIFFERENT" },
    { ko: "일침 병", en: "NEED TO ADVISE" }, { ko: "깨어있는 척", en: "WOKE PRETENDER" }, { ko: "논리적 척", en: "LOGICAL FAKE" }, { ko: "책 표지만 읽음", en: "COVER READER" }, { ko: "니체 좋아함", en: "LOVES NIETZSCHE" },
    { ko: "어른들 노답", en: "ADULTS NO ANSWER" }, { ko: "유튜브로 공부", en: "YOUTUBE SCHOLAR" }, { ko: "마이너 부심", en: "MINOR PRIDE" }, { ko: "주류 거부", en: "REJECT MAINSTREAM" }, { ko: "영화 평론가", en: "MOVIE CRITIC" },
    { ko: "알고리즘 탓", en: "ALGORITHM FAULT" }, { ko: "감성보단 이성", en: "REASON > EMOTION" }, { ko: "정치병 초기", en: "EARLY POLITICS" }, { ko: "나무위키 정독", en: "WIKI READER" }, { ko: "무종교 부심", en: "ATHEIST PRIDE" },
    { ko: "동물만 좋아함", en: "ONLY LIKES ANIMALS" }, { ko: "인류 멸망 기원", en: "DOOMSDAY WISH" }, { ko: "혼술 로망", en: "SOLO DRINK ROMANCE" }, { ko: "팩트 체커", en: "FACT CHECKER" }, { ko: "진리 탐구", en: "SEEKING TRUTH" }
  ],
  // SET 4: 비련의 주인공 (Tragic Hero)
  [
    { ko: "카톡 프사 내림", en: "NO PFP" }, { ko: "상메 점 하나", en: "STATUS: DOT" }, { ko: "읽씹 당함", en: "IGNORED" }, { ko: "이별 노래 반복", en: "BREAKUP SONG LOOP" }, { ko: "새벽에 깨있음", en: "AWAKE AT DAWN" },
    { ko: "눈물 셀카", en: "TEAR SELCA" }, { ko: "과거 편지 읽음", en: "OLD LETTERS" }, { ko: "인스타 비활성화", en: "INSTA DEACTIVATED" }, { ko: "비오는날 우울", en: "RAINY DEPRESSION" }, { ko: "추억에 잠김", en: "LOST IN MEMORIES" },
    { ko: "나만 아픈 연애", en: "ONLY I HURT" }, { ko: "운명론자", en: "FATALIST" }, { ko: "상처받기 싫어", en: "FEAR OF HURT" }, { ko: "미련 철철", en: "LINGERING FEELINGS" }, { ko: "혼자만의 이별", en: "ONE-SIDED BREAKUP" },
    { ko: "감정 쓰레기통", en: "EMOTION TRASHCAN" }, { ko: "아무도 안믿음", en: "TRUST NOBODY" }, { ko: "배신 당함", en: "BETRAYED" }, { ko: "내가 문제야", en: "I AM THE PROBLEM" }, { ko: "행복해지고 싶다", en: "WANT HAPPINESS" },
    { ko: "다 부질없다", en: "ALL VAIN" }, { ko: "외로움 즐기는척", en: "FAKE ENJOY ALONE" }, { ko: "연락 기다림", en: "WAITING FOR TEXT" }, { ko: "우연을 믿음", en: "BELIEVE IN CHANCE" }, { ko: "비극적 결말", en: "TRAGIC ENDING" }
  ],
  // SET 5: 소셜 미디어 인싸 호소인 (Wannabe Influencer)
  [
    { ko: "스토리 10개 이상", en: "STORY OVERLOAD" }, { ko: "오운완 강박", en: "WORKOUT POST" }, { ko: "플미 신발", en: "PREMIUM SHOES" }, { ko: "홍대병", en: "HONGDAE SICKNESS" }, { ko: "카페 투어", en: "CAFE TOUR" },
    { ko: "거울샷 필수", en: "MIRROR SHOT" }, { ko: "명품 로고 노출", en: "LUXURY LOGO" }, { ko: "협찬인 척", en: "FAKE SPONSOR" }, { ko: "DM으로 문의", en: "DM FOR INQUIRY" }, { ko: "친목 도모", en: "SOCIALIZING" },
    { ko: "핫플 도장깨기", en: "HOTSPOT HUNTER" }, { ko: "유행어 남발", en: "SLANG OVERUSE" }, { ko: "MBTI 과몰입", en: "MBTI ADDICT" }, { ko: "인생네컷 수집", en: "PHOTOBOOTH" }, { ko: "아이폰 고집", en: "IPHONE ONLY" },
    { ko: "에어팟 맥스", en: "AIRPODS MAX" }, { ko: "감성 필터", en: "AESTHETIC FILTER" }, { ko: "바디프로필 로망", en: "BODY PROFILE" }, { ko: "릴스 댄스 연습", en: "REELS DANCE" }, { ko: "오마카세 허세", en: "OMAKASE BLUFF" },
    { ko: "골프/테니스 입문", en: "GOLF/TENNIS NEWBIE" }, { ko: "지인 찬스", en: "FRIEND CHANCE" }, { ko: "파티 피플", en: "PARTY PEOPLE" }, { ko: "인싸 코스프레", en: "INSSA COSPLAY" }, { ko: "관심 종자", en: "ATTENTION SEEKER" }
  ]
];

export default function Bingo({ onNext }: { onNext: (setIndex: number, selected: number[]) => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [items, setItems] = useState<{ ko: string, en: string }[]>([]);
  const [setIndex, setSetIndex] = useState(0);

  useEffect(() => {
    const randomSetIndex = Math.floor(Math.random() * BINGO_SETS.length);
    setSetIndex(randomSetIndex);
    const shuffled = [...BINGO_SETS[randomSetIndex]].sort(() => 0.5 - Math.random());
    setItems(shuffled.slice(0, 25));
  }, []);

  const toggle = (i: number) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(i)) newSet.delete(i);
      else newSet.add(i);
      return newSet;
    });
  };

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-surface flex flex-col">
      <TopBar title="DIAGNOSTIC PROTOCOL" currentStep={3} />
      
      <main className="flex-grow flex flex-col p-4 md:p-6 max-w-2xl mx-auto w-full gap-6 items-center justify-center">

        <div className="text-center mb-2 z-10 w-full">
          <h2 className="text-[45px] font-black text-secondary mb-1 tracking-tighter">중2력 빙고</h2>
          <p className="text-gray-500 font-bold text-sm">해당하는 칸을 <span className="text-primary">전부</span> 누르십시오</p>
          <p className="text-gray-400 font-bold text-[11px] mt-1">정직할수록 측정 정확도가 올라갑니다</p>

          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="px-3 py-1 border border-outline rounded-full text-[11px] font-black text-secondary bg-white">
              선택 {selected.size}/25
            </span>
            <span className="px-3 py-1 border border-primary rounded-full text-[11px] font-black text-primary bg-white">
              중2력 {Math.round((selected.size / 25) * 100)}
            </span>
          </div>
        </div>

        <section className="w-full aspect-square max-w-lg mx-auto grid grid-cols-5 grid-rows-5 border-t border-l border-outline bg-white brutal-shadow">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex flex-col items-center justify-center p-1 md:p-2 border-r border-b border-outline hover:bg-gray-100 transition-colors ${selected.has(i) ? 'bg-primary text-white hover:bg-orange-600' : 'text-secondary'}`}
            >
              <span className="font-black text-[10px] md:text-xs mb-0.5 md:mb-1 text-center leading-tight">{item.ko}</span>
              <span className={`text-[6px] md:text-[8px] font-black tracking-widest opacity-70 text-center leading-none ${selected.has(i) ? 'text-white' : 'text-gray-500'}`}>{item.en}</span>
            </button>
          ))}
        </section>

        <div className="w-full max-w-md mx-auto mt-4 flex flex-col items-center gap-3">
          <p className="text-[11px] font-bold text-gray-400">
            {selected.size === 0 ? '해당 사항이 없다면 그대로 진행하십시오' : `${selected.size}개 항목이 기록되었습니다`}
          </p>
          <PrimaryButton onClick={() => onNext(setIndex, [...selected])} className="w-full text-sm md:text-base">
          증후군 분석하기 <span className="material-symbols-outlined text-lg">barcode_scanner</span>
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
