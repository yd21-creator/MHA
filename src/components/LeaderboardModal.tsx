import React from 'react';
import { Trophy, X, Download } from 'lucide-react';
import { RankingEntry } from '../types/game';
import { downloadStandaloneHtmlGame } from '../utils/exportHtml';
import { sound } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: RankingEntry[];
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  rankings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">명예의 전당 (Top 10 랭킹)</h3>
              <p className="text-xs text-slate-400">도시 전력망을 구출한 최고 점수 기록실</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playSwitchClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rankings Table */}
        <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-800/80 mb-5">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold sticky top-0">
              <tr>
                <th className="py-2.5 px-3">순위</th>
                <th className="py-2.5 px-3">관리자 닉네임</th>
                <th className="py-2.5 px-3">범위</th>
                <th className="py-2.5 px-3 text-right">점수</th>
                <th className="py-2.5 px-3 text-right">과부하율</th>
                <th className="py-2.5 px-3 text-right">일자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-code">
              {rankings.map((entry, idx) => (
                <tr key={entry.id || idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold">
                    {idx === 0 ? '🥇 1위' : idx === 1 ? '🥈 2위' : idx === 2 ? '🥉 3위' : `${idx + 1}위`}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-white truncate max-w-[120px]">
                    {entry.nickname}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">
                    {entry.scope === 'CITY' ? '도시' : entry.scope === 'NATIONAL' ? '국가' : '전세계'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-400 font-bold tabular-nums">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                    {entry.overloadRate}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 tabular-nums">
                    {entry.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playSwitchClick();
              downloadStandaloneHtmlGame();
            }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>단일 HTML 게임 다운로드</span>
          </button>
          <button
            onClick={() => {
              sound.playSwitchClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
