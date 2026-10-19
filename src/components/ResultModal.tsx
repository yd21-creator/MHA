import React from 'react';
import { Trophy, RotateCcw, Home, Download, CheckCircle2, AlertOctagon, Zap, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { RankingEntry, GameScope } from '../types/game';
import { downloadStandaloneHtmlGame } from '../utils/exportHtml';
import { sound } from '../utils/audio';

interface ResultModalProps {
  isVictory: boolean;
  score: number;
  overloadRate: number;
  timeRemainingSec: number;
  scope: GameScope;
  characterName: string;
  rankings: RankingEntry[];
  currentEntryId: string;
  onPlayAgain: () => void;
  onQuit: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isVictory,
  score,
  overloadRate,
  timeRemainingSec,
  scope,
  characterName,
  rankings,
  currentEntryId,
  onPlayAgain,
  onQuit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100">
        {/* Banner Header */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center p-3.5 rounded-2xl mb-3 ${
              isVictory
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isVictory ? <Award className="w-10 h-10" /> : <AlertOctagon className="w-10 h-10" />}
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-black font-pixel mb-2 ${
              isVictory ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {isVictory ? '도시 전력망 방어 성공! (MISSION COMPLETE)' : '도시 대정전 발생 (BLACKOUT FAILURE)'}
          </h2>

          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {isVictory
              ? '축하합니다! 옴의 법칙과 신속한 단락 차단으로 과부하율 30% 이하를 달성하고 중앙 변전소를 구출했습니다!'
              : '전력망 과부하가 임계치를 초과했거나 제한 시간이 종료되어 광역 대정전(Blackout)이 발생했습니다.'}
          </p>
        </div>

        {/* Score Breakdown Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/80 border border-slate-800 rounded-xl mb-6 text-center font-code">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">최종 점수</span>
            <span className="text-lg font-black text-amber-400 tabular-nums">{score}점</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">전력망 과부하율</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                overloadRate <= 30 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {overloadRate.toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">남은 시간</span>
            <span className="text-lg font-bold text-cyan-400 tabular-nums">
              {Math.floor(timeRemainingSec / 60)}분 {timeRemainingSec % 60}초
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">방어 구역</span>
            <span className="text-sm font-bold text-white mt-1 block">
              {scope === 'CITY' ? '도시' : scope === 'NATIONAL' ? '국가' : '전세계'}
            </span>
          </div>
        </div>

        {/* Energy Conservation Awareness Message */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5 text-sm">
            <HeartHandshake className="w-4 h-4" />
            <span>일상 속 전기 절약 및 스마트 전력 관리 실천 메시지</span>
          </div>
          <p className="mb-2">
            전기는 우리 생활에 필수적이지만, 무분별하게 과도하게 사용하면 발전소와 전력망에 극심한 과부하가 발생하여 대규모 정전(블랙아웃)으로 이어집니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>• 쓰지 않는 가전의 <b>대기전력 플러그 뽑기</b></div>
            <div>• 여름철 실내 적정 냉방온도 <b>26℃ 준수하기</b></div>
            <div>• 피크 시간대(오후 2~5시) <b>고전력 가전 분산 사용</b></div>
            <div>• 노후 콘센트 점검으로 <b>단락(합선) 화재 사전 예방</b></div>
          </div>
        </div>

        {/* Top 10 Leaderboard Preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>실시간 명예의 전당 (Top 10 랭킹)</span>
            </h3>
            <span className="text-[11px] text-slate-400">점수 순 내림차순 정렬</span>
          </div>

          <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold sticky top-0">
                <tr>
                  <th className="py-2 px-3">순위</th>
                  <th className="py-2 px-3">닉네임</th>
                  <th className="py-2 px-3">난이도</th>
                  <th className="py-2 px-3 text-right">점수</th>
                  <th className="py-2 px-3 text-right">과부하율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-code">
                {rankings.map((entry, idx) => {
                  const isCurrent = entry.id === currentEntryId;
                  return (
                    <tr
                      key={entry.id || idx}
                      className={isCurrent ? 'bg-amber-500/20 font-bold text-amber-300' : 'hover:bg-slate-800/40'}
                    >
                      <td className="py-2 px-3 font-bold">
                        {idx === 0 ? '🥇 1위' : idx === 1 ? '🥈 2위' : idx === 2 ? '🥉 3위' : `${idx + 1}위`}
                      </td>
                      <td className="py-2 px-3 font-sans truncate max-w-[120px]">
                        {entry.nickname} {isCurrent && '👈 (나)'}
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-400">
                        {entry.scope === 'CITY' ? '도시' : entry.scope === 'NATIONAL' ? '국가' : '전세계'}
                      </td>
                      <td className="py-2 px-3 text-right text-amber-400 tabular-nums">
                        {entry.score.toLocaleString()}점
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                        {entry.overloadRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buttons Action Group */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              sound.playSwitchClick();
              downloadStandaloneHtmlGame();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>단일 HTML 파일 다운로드</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playSwitchClick();
                onQuit();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>종료하기</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playSwitchClick();
                onPlayAgain();
              }}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>한번 더 플레이하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
