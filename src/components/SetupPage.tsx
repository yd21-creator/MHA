import React from 'react';
import { ArrowLeft, Play, Volume2, Sun, Moon, Monitor, Sliders, ShieldCheck, Zap, AlertTriangle, Clock } from 'lucide-react';
import { GameSettings, EnvironmentMode } from '../types/game';
import { sound } from '../utils/audio';

interface SetupPageProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onStartGame: () => void;
  onBack: () => void;
  scopeTitle: string;
  characterName: string;
}

export const SetupPage: React.FC<SetupPageProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
  onBack,
  scopeTitle,
  characterName,
}) => {
  const handleVolumeChange = (vol: number) => {
    onUpdateSettings({ masterVolume: vol });
    sound.setMasterVolume(vol);
    sound.playDialStep(600);
  };

  const handleModeChange = (mode: EnvironmentMode) => {
    sound.playSwitchClick();
    onUpdateSettings({ mode });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-amber-400 font-code uppercase">STEP 03 / 03</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">작전 개시 브리핑 및 환경 설정</h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>난이도 변경</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Column: Mission Briefing */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-amber-400 font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>작전 요강 (Mission Rules)</span>
          </div>

          <div className="space-y-3.5 text-xs text-slate-300 mb-6">
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
              <span className="font-bold text-emerald-400 block mb-1">🎯 최종 승리 조건</span>
              <span>5단계 변전소 클라이맥스를 돌파하고, <b>도시 과부하율을 30% 이하</b>로 안정화시키면 승리!</span>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
              <span className="font-bold text-rose-400 block mb-1">💀 패배 조건</span>
              <span>전력망 과부하 게이지가 <b>100%</b>에 도달하거나, <b>제한시간 (3분 / 180초)</b> 초과 시 대정전!</span>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
              <span className="font-bold text-amber-300 block mb-1">⚡ 옴의 법칙 핵심 조작</span>
              <span><b>전류(I) = 전압(V) ÷ 저항(R)</b>. 전류가 너무 높으면 저항(R)을 올려 전류를 낮추고, 단락(합선) 발생 시 즉시 차단기를 내려 전력을 끊으세요.</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400">
            <span>참여 요원: <b className="text-white">{characterName}</b></span>
            <span>선택 전력망: <b className="text-amber-400">{scopeTitle}</b></span>
          </div>
        </div>

        {/* Right Column: Audio & Mode Settings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-cyan-400 font-bold text-base">
              <Sliders className="w-5 h-5" />
              <span>시스템 환경 설정</span>
            </div>

            {/* Audio Settings */}
            <div className="mb-6 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    마스터 볼륨
                  </span>
                  <span className="text-amber-400 font-code">{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.masterVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.sfxEnabled}
                    onChange={(e) => {
                      sound.playSwitchClick();
                      onUpdateSettings({ sfxEnabled: e.target.checked });
                    }}
                    className="accent-amber-400 rounded"
                  />
                  <span>효과음 (SFX) 켜기</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.bgmEnabled}
                    onChange={(e) => {
                      sound.playSwitchClick();
                      onUpdateSettings({ bgmEnabled: e.target.checked });
                    }}
                    className="accent-amber-400 rounded"
                  />
                  <span>레트로 신스 BGM 켜기</span>
                </label>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-4">
              <span className="block text-xs font-semibold text-slate-300 mb-2">
                플레이 환경 테마
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('DAY')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    settings.mode === 'DAY'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-4 h-4 mb-1.5 text-amber-400" />
                  <span>낮 피크</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('NIGHT')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    settings.mode === 'NIGHT'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-4 h-4 mb-1.5 text-cyan-400" />
                  <span>열대야 밤</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('CYBER')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    settings.mode === 'CYBER'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4 mb-1.5 text-purple-400" />
                  <span>사이버 레트로</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            * 게임 플레이 중에도 상단 메뉴에서 사운드와 모드를 자유롭게 변경할 수 있습니다.
          </div>
        </div>
      </div>

      {/* Big Launch Button */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            sound.playSwitchClick();
            if (settings.bgmEnabled) {
              sound.startBGM();
            }
            onStartGame();
          }}
          className="group inline-flex items-center gap-3 px-10 py-4 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 text-lg font-black rounded-xl shadow-xl shadow-amber-500/20 transition-all cursor-pointer font-pixel"
        >
          <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          <span>전력망 제어 작전 개시 (GAME START)</span>
        </button>
      </div>
    </div>
  );
};
