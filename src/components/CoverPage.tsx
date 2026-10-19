import React from 'react';
import { Play, Trophy, Download, Zap, AlertTriangle, Activity, ArrowRight, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';
import { downloadStandaloneHtmlGame } from '../utils/exportHtml';

interface CoverPageProps {
  onStart: () => void;
  onOpenLeaderboard: () => void;
  coverImage: string;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  onStart,
  onOpenLeaderboard,
  coverImage,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden">
      {/* Background Hero Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={coverImage}
          alt="블랙아웃 위기의 사이버 레트로 도시 전경"
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/30 to-slate-950/90" />
      </div>

      {/* Main Content Hero */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-8 flex-1 flex flex-col justify-center items-center text-center">
        {/* Quiet Meta Line */}
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>전기 절약 교육 & 과학 시뮬레이션</span>
          <span aria-hidden="true">·</span>
          <span>옴의 법칙(V=IR)</span>
          <span aria-hidden="true">·</span>
          <span>단락(합선) 비상 대응</span>
        </div>

        {/* Main Title with Retro Glow */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-4 font-pixel drop-shadow-lg text-balance">
          과전류를 <span className="text-amber-400 underline decoration-amber-500/50 decoration-wavy">차단하라!</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-8 font-medium leading-relaxed drop-shadow">
          폭염으로 인한 전력 수요 폭증과 위험천만한 단락(합선) 사고!
          <br className="hidden sm:inline" />
          옴의 법칙으로 전류의 균형을 맞추고, 도시의 대정전(Blackout)을 막아내라!
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => {
              sound.playSwitchClick();
              onStart();
            }}
            className="flex items-center gap-2 px-7 py-3.5 text-base font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-150 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>게임 시작하기</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => {
              sound.playSwitchClick();
              onOpenLeaderboard();
            }}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-100 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>명예의 전당 (Top 10)</span>
          </button>

          <button
            onClick={() => {
              sound.playSwitchClick();
              downloadStandaloneHtmlGame();
            }}
            className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-300 bg-slate-900/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>단일 HTML 다운로드</span>
          </button>
        </div>

        {/* 3 Core Scientific & Educational Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left max-w-4xl">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>옴의 법칙 (V = I × R)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              전압(V)이 일정할 때, 저항(R)을 키우면 전류(I)는 감소하고 저항을 줄이면 전류는 폭증합니다. 적정 저항을 조절해 부품 소손을 방지하세요.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>단락(합선) 현상 대처</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              저항이 0Ω에 가깝게 전선이 직접 닿으면 순간적으로 수천 A의 과전류가 흘러 화재가 발생합니다. 즉시 차단기를 내려 회로를 격리하세요.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-sm">
              <Activity className="w-4 h-4" />
              <span>전기 절약과 스마트 관리</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              전기를 마구 낭비하면 전력망 과부하로 정전이 일어납니다. 대기전력 차단, 적정 냉방온도 준수로 지구와 전력망을 함께 지켜냅시다!
            </p>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <footer className="relative z-10 px-6 py-4 border-t border-slate-800/80 bg-slate-950/70 text-center text-xs text-slate-500">
        <span>한국 스마트 전력망 안전 교육 프로젝트</span>
        <span className="mx-2" aria-hidden="true">·</span>
        <span>물리 과학 교육용 시뮬레이션 게임</span>
      </footer>
    </div>
  );
};
