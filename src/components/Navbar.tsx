import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, Download, ShieldAlert } from 'lucide-react';
import { GamePage, GameSettings } from '../types/game';
import { sound } from '../utils/audio';
import { downloadStandaloneHtmlGame } from '../utils/exportHtml';

interface NavbarProps {
  currentPage: GamePage;
  onNavigate: (page: GamePage) => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenLeaderboard: () => void;
  inGameScore?: number;
  inGameTime?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  settings,
  onUpdateSettings,
  onOpenLeaderboard,
  inGameScore,
  inGameTime,
}) => {
  const toggleAudio = () => {
    const nextSfx = !settings.sfxEnabled;
    onUpdateSettings({ sfxEnabled: nextSfx, bgmEnabled: nextSfx });
    if (nextSfx) {
      sound.setMasterVolume(settings.masterVolume);
      sound.playSwitchClick();
      if (currentPage === 'GAME') sound.startBGM();
    } else {
      sound.stopBGM();
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand wordmark (single line) */}
      <div
        onClick={() => onNavigate('COVER')}
        className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group select-none"
      >
        <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:border-amber-400 transition-colors">
          <ShieldAlert className="w-5 h-5" />
        </span>
        <span className="text-base font-extrabold tracking-tight text-white font-pixel group-hover:text-amber-400 transition-colors">
          과전류를 차단하라!
        </span>
      </div>

      {/* Zone 2: Single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onNavigate('COVER')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentPage === 'COVER' ? 'text-amber-400 font-semibold' : ''}`}
        >
          시작 표지
        </button>
        <button
          onClick={() => onNavigate('PROFILE')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentPage === 'PROFILE' ? 'text-amber-400 font-semibold' : ''}`}
        >
          프로필 설정
        </button>
        <button
          onClick={() => onNavigate('SCOPE')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentPage === 'SCOPE' ? 'text-amber-400 font-semibold' : ''}`}
        >
          전력망 범위
        </button>
        <button
          onClick={() => onNavigate('SETUP')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentPage === 'SETUP' ? 'text-amber-400 font-semibold' : ''}`}
        >
          운영 브리핑
        </button>
        <button
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-slate-300"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>명예의 전당</span>
        </button>
      </nav>

      {/* Zone 3: Actions (Sound toggle, Standalone HTML download, or In-game indicators) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {currentPage === 'GAME' && inGameScore !== undefined && (
          <div className="hidden sm:flex items-center gap-3 text-xs font-code text-slate-400 mr-2">
            <span>
              SCORE: <b className="text-amber-400 tabular-nums">{inGameScore}</b>
            </span>
            {inGameTime !== undefined && (
              <span>
                TIME:{' '}
                <b className="text-cyan-400 tabular-nums">
                  {Math.floor(inGameTime / 60)}:{(inGameTime % 60).toString().padStart(2, '0')}
                </b>
              </span>
            )}
          </div>
        )}

        {/* Standalone HTML Download Button */}
        <button
          onClick={() => downloadStandaloneHtmlGame()}
          title="오프라인에서도 바로 실행 가능한 단일 HTML 파일 다운로드"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">단일 HTML 저장</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          title={settings.sfxEnabled ? '사운드 끄기' : '사운드 켜기'}
          className={`p-2 rounded-lg border transition-colors ${
            settings.sfxEnabled
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {settings.sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {currentPage !== 'GAME' && (
          <button
            onClick={() => onNavigate('GAME')}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm shadow-amber-500/20 whitespace-nowrap shrink-0"
          >
            게임 플레이
          </button>
        )}
      </div>
    </header>
  );
};
