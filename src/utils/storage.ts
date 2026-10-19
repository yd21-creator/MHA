import { RankingEntry } from '../types/game';

const STORAGE_KEY = 'OVERCURRENT_DEFENSE_RANKINGS_V1';

const INITIAL_DEFAULT_RANKINGS: RankingEntry[] = [
  {
    id: 'rank-1',
    nickname: '전력수호신_강테슬라',
    character: '김그리드 (수석 엔지니어)',
    scope: 'GLOBAL',
    score: 9850,
    overloadRate: 14,
    cleared: true,
    date: '2026.10.18',
    timeTakenSec: 92,
  },
  {
    id: 'rank-2',
    nickname: '옴의법칙마스터',
    character: '최퓨즈 (회로 마스터)',
    scope: 'GLOBAL',
    score: 9420,
    overloadRate: 18,
    cleared: true,
    date: '2026.10.17',
    timeTakenSec: 104,
  },
  {
    id: 'rank-3',
    nickname: '스마트그리드_정주임',
    character: '이볼트 (변전소 점검원)',
    scope: 'NATIONAL',
    score: 8910,
    overloadRate: 21,
    cleared: true,
    date: '2026.10.16',
    timeTakenSec: 110,
  },
  {
    id: 'rank-4',
    nickname: '에코세이버77',
    character: '박에코 (절약 분석가)',
    scope: 'NATIONAL',
    score: 8340,
    overloadRate: 23,
    cleared: true,
    date: '2026.10.15',
    timeTakenSec: 118,
  },
  {
    id: 'rank-5',
    nickname: '단락방지특공대',
    character: '이볼트 (변전소 점검원)',
    scope: 'NATIONAL',
    score: 7920,
    overloadRate: 25,
    cleared: true,
    date: '2026.10.14',
    timeTakenSec: 125,
  },
  {
    id: 'rank-6',
    nickname: '빛고을_전기요정',
    character: '김그리드 (수석 엔지니어)',
    scope: 'CITY',
    score: 7460,
    overloadRate: 22,
    cleared: true,
    date: '2026.10.14',
    timeTakenSec: 130,
  },
  {
    id: 'rank-7',
    nickname: '블랙아웃_철벽방어',
    character: '최퓨즈 (회로 마스터)',
    scope: 'CITY',
    score: 6980,
    overloadRate: 26,
    cleared: true,
    date: '2026.10.13',
    timeTakenSec: 138,
  },
  {
    id: 'rank-8',
    nickname: '초고압_차단장인',
    character: '이볼트 (변전소 점검원)',
    scope: 'CITY',
    score: 6520,
    overloadRate: 28,
    cleared: true,
    date: '2026.10.12',
    timeTakenSec: 144,
  },
  {
    id: 'rank-9',
    nickname: '에너지절약왕',
    character: '박에코 (절약 분석가)',
    scope: 'CITY',
    score: 6150,
    overloadRate: 29,
    cleared: true,
    date: '2026.10.11',
    timeTakenSec: 152,
  },
  {
    id: 'rank-10',
    nickname: '한여름밤의안전',
    character: '김그리드 (수석 엔지니어)',
    scope: 'CITY',
    score: 5800,
    overloadRate: 30,
    cleared: true,
    date: '2026.10.10',
    timeTakenSec: 160,
  },
];

export function getRankings(): RankingEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_RANKINGS));
      return INITIAL_DEFAULT_RANKINGS;
    }
    const parsed: RankingEntry[] = JSON.parse(raw);
    return parsed.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch {
    return INITIAL_DEFAULT_RANKINGS;
  }
}

export function saveRanking(entry: Omit<RankingEntry, 'id' | 'rank'>): RankingEntry[] {
  const current = getRankings();
  const newEntry: RankingEntry = {
    ...entry,
    id: `rank-${Date.now()}`,
  };

  const combined = [...current, newEntry];
  // Sort descending by score
  combined.sort((a, b) => b.score - a.score);
  const top10 = combined.slice(0, 10).map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  return top10;
}
