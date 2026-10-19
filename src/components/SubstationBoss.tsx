import React, { useState, useEffect } from 'react';
import { AlertTriangle, Flame, ShieldAlert, Zap, CheckCircle2, RotateCcw, Power } from 'lucide-react';
import { sound } from '../utils/audio';

interface SubstationBossProps {
  onSuccess: () => void;
  bossImage: string;
}

export const SubstationBoss: React.FC<SubstationBossProps> = ({
  onSuccess,
  bossImage,
}) => {
  const [isBreakerTripped, setIsBreakerTripped] = useState(false);
  const [r1, setR1] = useState(4); // Shunt
  const [r2, setR2] = useState(6); // Step-down
  const [r3, setR3] = useState(6); // Surge limiter
  const [isFixed, setIsFixed] = useState(false);

  const voltage = 400; // 400V Industrial Substation
  const totalResistance = isBreakerTripped ? (r1 + r2 + r3) : 0.18; // 0.18Ω when shorted!
  const current = isBreakerTripped ? (voltage / (r1 + r2 + r3)) : (voltage / 0.18);
  const targetCurrent = 25; // 25A (requires total R = 16Ω)

  const isCurrentTargetMatched = Math.abs(current - targetCurrent) <= 1.0;

  useEffect(() => {
    sound.playAlarm();
    sound.playSpark();
  }, []);

  const handleTripMaster = () => {
    sound.playSwitchClick();
    setIsBreakerTripped(!isBreakerTripped);
  };

  const handleVerifyAndNormalize = () => {
    if (!isBreakerTripped) {
      sound.playAlarm();
      return;
    }
    if (isCurrentTargetMatched) {
      sound.playVictory();
      setIsFixed(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      sound.playAlarm();
    }
  };

  return (
    <div className="relative rounded-2xl border-2 border-rose-500 bg-slate-950 p-6 overflow-hidden shadow-2xl shadow-rose-950/50 mb-8">
      {/* Background Graphic Scrim */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src={bossImage} alt="중앙 변전소 폭발 방지 보스전" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/80" />
      </div>

      <div className="relative z-10">
        {/* Boss Alert Banner */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-rose-900/60 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600/30 text-rose-400 border border-rose-500/50 animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 font-pixel uppercase tracking-wider">
                  STAGE 04 · 대형 보스전
                </span>
                <span className="text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">
                  중앙 변전소 대형 단락(합선) 비상!
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                초고압 400V 메인 트랜스포머 폭발 저지
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">목표 안전 정격 전류</span>
            <span className="text-lg font-extrabold text-emerald-400 font-code tabular-nums">
              {targetCurrent} A (오차 ±1A)
            </span>
          </div>
        </div>

        {/* Status Screen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center font-code">
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">인가 전압 (V)</span>
            <span className="text-lg font-bold text-white">{voltage} V</span>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">합선 합성 저항 (R₁ + R₂ + R₃)</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                !isBreakerTripped ? 'text-rose-400 animate-pulse' : 'text-amber-400'
              }`}
            >
              {!isBreakerTripped ? '0.18 Ω (합선 단락!)' : `${r1 + r2 + r3} Ω`}
            </span>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">폭주 과전류 (I)</span>
            <span
              className={`text-xl font-black tabular-nums ${
                !isBreakerTripped || current > 50
                  ? 'text-rose-400 animate-bounce'
                  : isCurrentTargetMatched
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {!isBreakerTripped ? '2,222.2 A (위험!)' : `${current.toFixed(1)} A`}
            </span>
          </div>
        </div>

        {/* Step 1: Master Breaker Switch */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center">1</span>
              <span>1단계: 합선된 메인 차단기 즉시 TRIP (전력 차단)</span>
            </div>
            <p className="text-xs text-slate-300">
              저항이 0Ω에 가까운 상태에서 전력을 통전하면 변전소가 즉시 폭발합니다. 차단기를 먼저 내려 안전을 확보하세요.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTripMaster}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              isBreakerTripped
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isBreakerTripped ? '차단기 격리 완료 (회로 수정 가능)' : '비상 메인 차단기 TRIP (OFF)'}</span>
          </button>
        </div>

        {/* Step 2: 3-Stage Resistor Bank Puzzle */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 mb-6">
          <div className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center">2</span>
            <span>2단계: 옴의 법칙(I = V / R) 저항 뱅크 밸런싱 퍼즐</span>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            전압 400V에서 목표 전류 25A를 흘리려면, <b>총 저항(R₁ + R₂ + R₃)이 16Ω</b>이 되어야 합니다!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* R1 */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">션트 저항 (R₁)</span>
                <span className="text-amber-400 font-code font-bold">{r1} Ω</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                disabled={!isBreakerTripped}
                value={r1}
                onChange={(e) => {
                  sound.playDialStep(400 + parseInt(e.target.value) * 20);
                  setR1(parseInt(e.target.value));
                }}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded cursor-pointer disabled:opacity-30"
              />
            </div>

            {/* R2 */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">강압 저항 (R₂)</span>
                <span className="text-amber-400 font-code font-bold">{r2} Ω</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                disabled={!isBreakerTripped}
                value={r2}
                onChange={(e) => {
                  sound.playDialStep(400 + parseInt(e.target.value) * 20);
                  setR2(parseInt(e.target.value));
                }}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded cursor-pointer disabled:opacity-30"
              />
            </div>

            {/* R3 */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">서지 제한 저항 (R₃)</span>
                <span className="text-amber-400 font-code font-bold">{r3} Ω</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                disabled={!isBreakerTripped}
                value={r3}
                onChange={(e) => {
                  sound.playDialStep(400 + parseInt(e.target.value) * 20);
                  setR3(parseInt(e.target.value));
                }}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded cursor-pointer disabled:opacity-30"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Verify and Re-engage Master Power */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          <div className="text-xs text-slate-300">
            현재 합성 저항: <b className="text-amber-400 font-code text-sm">{r1 + r2 + r3} Ω</b> / 계산 전류:{' '}
            <b
              className={`font-code text-sm ${
                isCurrentTargetMatched ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {(voltage / (r1 + r2 + r3)).toFixed(1)} A
            </b>{' '}
            (목표: 25.0 A)
          </div>

          <button
            type="button"
            disabled={!isBreakerTripped || !isCurrentTargetMatched || isFixed}
            onClick={handleVerifyAndNormalize}
            className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${
              isCurrentTargetMatched && isBreakerTripped
                ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-500 opacity-60 pointer-events-none'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isFixed ? '변전소 복구 성공! 정상화 진행 중...' : '변전소 전원 재투입 & 정상화 완료'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
