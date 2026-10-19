import React from 'react';
import { ArrowLeft, ArrowRight, Building2, Globe2, Map, CheckCircle2, Flame, AlertOctagon, Cpu } from 'lucide-react';
import { GameScope } from '../types/game';
import { sound } from '../utils/audio';

interface ScopeOption {
  id: GameScope;
  title: string;
  badge: string;
  difficulty: string;
  difficultyColor: string;
  zoneCount: number;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

const SCOPES: ScopeOption[] = [
  {
    id: 'CITY',
    title: '도시 전력망 (City Grid)',
    badge: '추천 / 입문',
    difficulty: '보통 (Normal)',
    difficultyColor: 'text-emerald-400',
    zoneCount: 3,
    description: '국지적 폭염으로 아파트 및 상가 에어컨 사용 급증. 3개 핵심 구역의 기초 회로를 제어합니다.',
    features: [
      '3개 회로 제어 구역 (주거단지, 종합병원, 도심상업지구)',
      '안정적인 전압 변동폭 (220V 기준)',
      '단락(합선) 발생 빈도: 낮음 (1회 예고형)',
      '옴의 법칙(V=IR) 기본 조작 습득에 최적화',
    ],
    icon: <Building2 className="w-8 h-8 text-emerald-400" />,
  },
  {
    id: 'NATIONAL',
    title: '국가 전력망 (National Grid)',
    badge: '도전 / 실전',
    difficulty: '어려움 (Hard)',
    difficultyColor: 'text-amber-400',
    zoneCount: 5,
    description: '전국적인 폭염 특보 발효! 고속철도와 데이터센터 등 국가 기간 인프라의 과전류를 방어해야 합니다.',
    features: [
      '5개 회로 제어 구역 (+고속철도망, 국가데이터센터)',
      '고전압 라인 가동 (220V ~ 380V 가변)',
      '단락(합선) 발생 빈도: 보통 (2~3회 불시 발생)',
      '구역별 전력 우선순위 차등 배분 필요',
    ],
    icon: <Map className="w-8 h-8 text-amber-400" />,
  },
  {
    id: 'GLOBAL',
    title: '전세계 연계망 (Global Supergrid)',
    badge: '극한 / 마스터',
    difficulty: '전문가 (Expert)',
    difficultyColor: 'text-rose-400',
    zoneCount: 7,
    description: '전 지구적 기상이변으로 인한 대규모 전력 마비 위기! 초복잡 회로망과 연쇄 단락에 맞서세요.',
    features: [
      '7개 회로 제어 구역 (+우주기지, 양자컴퓨터, 스마트메가폴리스)',
      '초고압 트랜스포머 가동 (최대 440V 급변)',
      '단락(합선) 연쇄 스파크 및 급속 과열 발생',
      '신속한 저항 교체 및 멀티태스킹 컨트롤 요구',
    ],
    icon: <Globe2 className="w-8 h-8 text-rose-400" />,
  },
];

interface ScopePageProps {
  selectedScope: GameScope;
  onSelectScope: (scope: GameScope) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ScopePage: React.FC<ScopePageProps> = ({
  selectedScope,
  onSelectScope,
  onNext,
  onBack,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-amber-400 font-code uppercase">STEP 02 / 03</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">전력망 방어 범위(난이도) 선택</h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>프로필로 돌아가기</span>
        </button>
      </div>

      <p className="text-sm text-slate-300 mb-6">
        범위가 넓어질수록 감시하고 저항(R)을 배치해야 할 회로 구역이 늘어나며, 예기치 못한 단락(합선) 사고의 빈도가 증가합니다.
      </p>

      {/* Scope Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {SCOPES.map((scope) => {
          const isSelected = selectedScope === scope.id;
          return (
            <div
              key={scope.id}
              onClick={() => {
                sound.playSwitchClick();
                onSelectScope(scope.id);
              }}
              className={`flex flex-col justify-between p-6 rounded-xl border transition-all cursor-pointer relative select-none ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    {scope.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-400 block">{scope.badge}</span>
                    <span className={`text-xs font-bold ${scope.difficultyColor}`}>
                      {scope.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{scope.title}</h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">{scope.description}</p>

                <div className="border-t border-slate-800/80 pt-3 mb-4 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-400 mb-1">시스템 특성:</div>
                  {scope.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">제어 회로수: <b className="text-white">{scope.zoneCount}개</b></span>
                {isSelected ? (
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <CheckCircle2 className="w-4 h-4" />
                    선택됨
                  </span>
                ) : (
                  <span className="text-slate-500 hover:text-slate-300">클릭하여 선택</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          이전으로
        </button>
        <button
          onClick={() => {
            sound.playSwitchClick();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold rounded-lg transition-colors shadow-md shadow-amber-500/15 cursor-pointer"
        >
          <span>다음 단계: 세부 설정 및 브리핑</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
