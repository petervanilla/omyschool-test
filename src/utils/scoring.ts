/**
 * 중2병 측정 엔진
 * 문진 응답 + 빙고 선택을 실제로 계산해서 등급/능력치/이세계 자아를 산출한다.
 * 같은 입력 → 같은 결과 (결정론적). 랜덤 없음.
 */

export type Answer = 0 | 1 | 2; // 아니요 | 조금요 | 네

export const STATS = ['망상력', '흑염룡', '다크니스', '고독감', '전투력', '오글거림'] as const;
export type StatKey = (typeof STATS)[number];

export interface Question {
  text: string;
  weights: Partial<Record<StatKey, number>>;
  /** 아니요 / 조금요 / 네 에 대한 감별사의 반응 */
  reactions: [string, string, string];
}

/* ------------------------------------------------------------------ */
/* 문진 문항                                                            */
/* ------------------------------------------------------------------ */

export const QUESTIONS: Question[] = [
  {
    text: '옷장을 여십시오.\n검은색 계열이 70% 이상입니까?',
    weights: { 다크니스: 3, 흑염룡: 1 },
    reactions: [
      '정상 범위입니다. 일단은.',
      '70%... 애매하군요. 기록해 두겠습니다.',
      '(펜을 내려놓으며) ...시작부터 흥미롭군요.',
    ],
  },
  {
    text: '이어폰을 꽂는 순간,\n길거리가 뮤직비디오 촬영장이 됩니까?',
    weights: { 망상력: 3, 오글거림: 2 },
    reactions: [
      '음악을 음악으로 듣는군요. 드문 일입니다.',
      '가끔 감독이 되는군요. 흔한 증상입니다.',
      '주연·감독·촬영 1인 3역. 측정기가 반응합니다.',
    ],
  },
  {
    text: '오른손이 가끔 저릿한 이유가\n"봉인" 때문이라고 생각한 적 있습니까?',
    weights: { 흑염룡: 4, 오글거림: 2 },
    reactions: [
      '혈액순환입니다. 다행이군요.',
      '...한 번쯤은 그럴 수 있습니다. 한 번쯤은.',
      '(무전기를 들며) 본부, 여기 하나 나왔습니다.',
    ],
  },
  {
    text: '단체 사진 속에서 나만\n다른 세계에 있는 것 같습니까?',
    weights: { 고독감: 3, 망상력: 1 },
    reactions: [
      '단체 사진에 잘 섞이는군요. 건강합니다.',
      '가장자리를 선호하시는군요.',
      '같은 프레임, 다른 차원. 전형적입니다.',
    ],
  },
  {
    text: '아직 세상에 꺼내지 않은 능력이\n내 안에 있다고 느낍니까?',
    weights: { 전투력: 3, 망상력: 2 },
    reactions: [
      '겸손하군요. 혹은 정말 없거나.',
      '"아직"이라는 단어를 쓰셨습니다. 기록합니다.',
      '언제 꺼내실 겁니까? ...아니요, 대답하지 마십시오.',
    ],
  },
  {
    text: '새벽 2시에 쓴 글을\n아침에 읽고 지운 적 있습니까?',
    weights: { 오글거림: 4, 고독감: 1 },
    reactions: [
      '새벽에 주무시는군요. 부럽습니다.',
      '지웠다니 다행입니다. 남아 있었다면 증거였습니다.',
      '몇 개나 지우셨습니까. ...괜찮습니다, 모두가 그럽니다.',
    ],
  },
  {
    text: '비 오는 날, 우산이 있는데도\n일부러 쓰지 않은 적 있습니까?',
    weights: { 다크니스: 2, 고독감: 2, 오글거림: 1 },
    reactions: [
      '우산을 우산으로 쓰는군요. 훌륭합니다.',
      '한두 번의 낭만은 허용됩니다.',
      '감기는 낭만으로 낫지 않습니다. 기록합니다.',
    ],
  },
  {
    text: '마지막 문항입니다.\n지금 이 검사에 꽤 진지하게 임하고 있습니까?',
    weights: { 망상력: 2, 흑염룡: 2, 다크니스: 2, 고독감: 2, 전투력: 2, 오글거림: 2 },
    reactions: [
      '가볍게 지나가시는군요. 그것도 하나의 방어기제입니다.',
      '적당한 거리. 가장 위험한 상태입니다.',
      '...본 문항이 함정이라는 것을, 방금 아셨습니까?',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 빙고 세트 성향                                                       */
/* ------------------------------------------------------------------ */

export interface SetProfile {
  archetype: string;
  affinity: Record<StatKey, number>;
}

/** Bingo.tsx 의 BINGO_SETS 순서와 1:1 대응 */
export const SET_PROFILES: SetProfile[] = [
  {
    archetype: '감성 과잉형',
    affinity: { 망상력: 1.2, 흑염룡: 0.6, 다크니스: 0.8, 고독감: 1.0, 전투력: 0.6, 오글거림: 1.4 },
  },
  {
    archetype: '흑염룡 각성형',
    affinity: { 망상력: 1.1, 흑염룡: 1.5, 다크니스: 1.3, 고독감: 0.9, 전투력: 1.2, 오글거림: 1.0 },
  },
  {
    archetype: '방구석 철학자형',
    affinity: { 망상력: 1.3, 흑염룡: 0.7, 다크니스: 1.0, 고독감: 1.2, 전투력: 0.8, 오글거림: 1.0 },
  },
  {
    archetype: '비극 주인공형',
    affinity: { 망상력: 1.0, 흑염룡: 0.8, 다크니스: 1.1, 고독감: 1.5, 전투력: 0.6, 오글거림: 1.3 },
  },
  {
    archetype: '인싸 호소인형',
    affinity: { 망상력: 1.1, 흑염룡: 0.6, 다크니스: 0.6, 고독감: 0.8, 전투력: 1.0, 오글거림: 1.5 },
  },
];

/* ------------------------------------------------------------------ */
/* 등급                                                                */
/* ------------------------------------------------------------------ */

export interface GradeDef {
  min: number;
  code: string;
  label: string;
  /** 증명서·라이선스에 찍히는 한 줄 판정 */
  verdict: string;
  /** 특이사항 */
  note: string;
  /** 센터의 처방 */
  prescription: string;
}

export const GRADES: GradeDef[] = [
  {
    min: 0,
    code: 'F',
    label: '일반인',
    verdict: '측정 가능한 중2력이 검출되지 않았습니다.',
    note: '정상인 코스프레 의혹 있음 (계속 관찰)',
    prescription: '가끔은 이어폰을 꽂고 창밖을 보십시오. 인생이 조금 길어집니다.',
  },
  {
    min: 18,
    code: 'D',
    label: '잠복기',
    verdict: '초기 신호가 관측되나 발현되지 않았습니다.',
    note: '조용한 편. 그래서 더 위험함',
    prescription: '지금이 가장 좋은 때입니다. 아무것도 하지 마십시오.',
  },
  {
    min: 32,
    code: 'C',
    label: '방구석 철학자',
    verdict: '세계에 대한 불만이 논리의 형태로 축적되었습니다.',
    note: '나무위키 정독 이력 다수 추정',
    prescription: '생각을 줄이고 산책을 늘리십시오. 효과는 보장하지 않습니다.',
  },
  {
    min: 45,
    code: 'B',
    label: '고독한 늑대',
    verdict: '무리에서 스스로 이탈한 흔적이 뚜렷합니다.',
    note: '단체 사진 가장자리 선호',
    prescription: '늑대도 가끔은 무리로 돌아갑니다. 밥은 같이 드십시오.',
  },
  {
    min: 58,
    code: 'A',
    label: '흑염룡 보유자',
    verdict: '우측(또는 좌측) 상완부에 미봉인 개체가 확인되었습니다.',
    note: '오른팔 봉인 중 · 접근 주의',
    prescription: '봉인은 유지하되, 시험 기간에는 절대 풀지 마십시오.',
  },
  {
    min: 70,
    code: 'S',
    label: '주인공',
    verdict: '본인이 서사의 중심이라는 확신이 임계치를 돌파했습니다.',
    note: '모든 상황에 BGM이 깔린다고 진술',
    prescription: '조연들에게도 대사를 주십시오. 그들도 사람입니다.',
  },
  {
    min: 82,
    code: 'SS',
    label: '각성자',
    verdict: '현실과 설정의 경계가 관측 장비로 구분되지 않습니다.',
    note: '측정 중 장비 2회 재부팅됨',
    prescription: '그 설정, 나중에 소설로 쓰십시오. 진심입니다.',
  },
  {
    min: 92,
    code: 'SSS',
    label: '봉인 해제',
    verdict: '본 센터 설립 이래 최상위 수치. 감별사 전원 대피 완료.',
    note: '측정기 눈금 초과 · 수기 기록으로 전환',
    prescription: '축하합니다. 당신은 이미 완성되었습니다. 부디 그대로.',
  },
];

/* ------------------------------------------------------------------ */
/* 스탯별 증상 / 속성                                                   */
/* ------------------------------------------------------------------ */

const STAT_SYMPTOM: Record<StatKey, string> = {
  망상력: '뇌내 시뮬레이션 상시 가동, 현실 렌더링 지연',
  흑염룡: '좌우 상완부 봉인 유지, 간헐적 각성 조짐',
  다크니스: '광원 회피 성향, 검은색 외 색상 인식 저하',
  고독감: '군중 속 단독 행동, 자발적 프레임 이탈',
  전투력: '미공개 필살기 보유 주장, 검증 불가',
  오글거림: '심야 감성 서술 후 익일 삭제 반복',
};

const STAT_ELEMENT: Record<StatKey, { name: string; sign: string; en: string }> = {
  망상력: { name: '환영', sign: '幻', en: 'ILLUSION' },
  흑염룡: { name: '흑염', sign: '炎', en: 'DARKFLAME' },
  다크니스: { name: '암흑', sign: '闇', en: 'DARKNESS' },
  고독감: { name: '빙결', sign: '氷', en: 'FROST' },
  전투력: { name: '뇌전', sign: '雷', en: 'THUNDER' },
  오글거림: { name: '심연', sign: '深', en: 'ABYSS' },
};

/* ------------------------------------------------------------------ */
/* 이세계 자아 이름 생성                                                */
/* ------------------------------------------------------------------ */

const NAME_MID = ['을 삼킨', '에 잠긴', '을 다스리는', '에 봉인된', '을 목격한', '과 계약한'];
const NAME_TAIL = ['관측자', '방랑자', '계승자', '파수꾼', '목격자', '이단아', '수호자', '망령'];

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* 결과 타입                                                            */
/* ------------------------------------------------------------------ */

export interface Diagnosis {
  /** 0-100 종합 중2력 */
  score: number;
  gradeCode: string;
  /** "S-Class 주인공" 형태 (기존 호환) */
  grade: string;
  gradeLabel: string;
  verdict: string;
  symptom: string;
  note: string;
  prescription: string;
  stats: { subject: StatKey; A: number; fullMark: number }[];
  dominant: StatKey;
  element: { name: string; sign: string; en: string };
  /** 이세계 자아 이름 */
  alterEgo: string;
  archetype: string;
  /** 문서번호 */
  serial: string;
  bingoCount: number;
}

/* ------------------------------------------------------------------ */
/* 계산                                                                */
/* ------------------------------------------------------------------ */

/** 문항 배열로부터 스탯별 이론상 최대치를 계산 (문항을 늘려도 자동 대응) */
const CHAT_MAX: Record<StatKey, number> = (() => {
  const m = {} as Record<StatKey, number>;
  for (const s of STATS) m[s] = 0;
  for (const q of QUESTIONS) {
    for (const s of STATS) m[s] += (q.weights[s] ?? 0) * 2;
  }
  return m;
})();

export function diagnose(params: {
  userName: string;
  answers: Answer[];
  bingoSetIndex: number;
  bingoSelected: number[];
}): Diagnosis {
  const { userName, answers, bingoSetIndex, bingoSelected } = params;

  const profile = SET_PROFILES[bingoSetIndex] ?? SET_PROFILES[0];

  /* --- 문진 점수 --- */
  const chatRaw = {} as Record<StatKey, number>;
  for (const s of STATS) chatRaw[s] = 0;
  QUESTIONS.forEach((q, i) => {
    const a = answers[i] ?? 0;
    for (const s of STATS) chatRaw[s] += (q.weights[s] ?? 0) * a;
  });

  /* --- 빙고 점수 --- */
  const bingoRaw = {} as Record<StatKey, number>;
  const bingoMax = {} as Record<StatKey, number>;
  for (const s of STATS) {
    bingoRaw[s] = 0;
    bingoMax[s] = 0;
  }
  // 25칸 전부 골랐을 때가 최대
  for (let i = 0; i < 25; i++) {
    const s = STATS[i % STATS.length];
    bingoMax[s] += profile.affinity[s];
  }
  for (const idx of bingoSelected) {
    const s = STATS[idx % STATS.length];
    bingoRaw[s] += profile.affinity[s];
  }

  /* --- 합산 & 정규화 (문진 60% / 빙고 40%) --- */
  const stats = STATS.map((s) => {
    const chatPct = CHAT_MAX[s] > 0 ? chatRaw[s] / CHAT_MAX[s] : 0;
    const bingoPct = bingoMax[s] > 0 ? bingoRaw[s] / bingoMax[s] : 0;
    const mixed = chatPct * 0.6 + bingoPct * 0.4;
    // 레이더 차트가 완전히 찌그러지지 않도록 하한 8
    const val = Math.round(8 + mixed * 92);
    return { subject: s, A: Math.min(100, val), fullMark: 100 };
  });

  const score = Math.round(stats.reduce((a, b) => a + b.A, 0) / stats.length);

  /* --- 등급 --- */
  const gradeDef = [...GRADES].reverse().find((g) => score >= g.min) ?? GRADES[0];

  /* --- 지배 스탯 --- */
  const dominant = stats.reduce((a, b) => (b.A > a.A ? b : a)).subject;
  const element = STAT_ELEMENT[dominant];

  /* --- 이세계 자아 (이름 + 속성 기반, 결정론적) --- */
  const rnd = mulberry32(hashString(`${userName}|${dominant}|${gradeDef.code}`));
  const alterEgo = `${element.name}${NAME_MID[Math.floor(rnd() * NAME_MID.length)]} ${
    NAME_TAIL[Math.floor(rnd() * NAME_TAIL.length)]
  }`;

  /* --- 문서번호 --- */
  const h = hashString(`${userName}|${score}|${bingoSelected.join(',')}`);
  const serial = `CHU2-${gradeDef.code.padEnd(3, 'X')}-${String(h % 100000).padStart(5, '0')}`;

  return {
    score,
    gradeCode: gradeDef.code,
    grade: `${gradeDef.code}-Class ${gradeDef.label}`,
    gradeLabel: gradeDef.label,
    verdict: gradeDef.verdict,
    symptom: STAT_SYMPTOM[dominant],
    note: gradeDef.note,
    prescription: gradeDef.prescription,
    stats,
    dominant,
    element,
    alterEgo,
    archetype: profile.archetype,
    serial,
    bingoCount: bingoSelected.length,
  };
}
