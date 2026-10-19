import React from 'react';
import { ShieldAlert, Zap, AlertTriangle, Power, RotateCcw, Activity, ShieldCheck, Flame } from 'lucide-react';
import { CircuitZone } from '../types/game';
import { sound } from '../utils/audio';

interface CircuitCardProps {
  zone: CircuitZone;
  onAdjustResistance: (zoneId: string, delta: number) => void;
  onSetResistance: (zoneId: string, value: number) => void;
  onToggleBreaker: (zoneId: string) => void;
  onReplaceFuse: (zoneId: string) => void;
  energy: number;
}

export const CircuitCard: React.FC<CircuitCardProps> = ({
  zone,
  onAdjustResistance,
  onSetResistance,
  onToggleBreaker,
  onReplaceFuse,
  energy,
}) => {
  const current = zone.isBreakerTripped
    ? 0
    : zone.isShortCircuit
    ? parseFloat((zone.voltage / 0.2).toFixed(1))
    : parseFloat((zone.voltage / zone.resistance).toFixed(1));

  const isSafe = !zone.isBreakerTripped && current >= zone.targetCurrentMin && current <= zone.targetCurrentMax;
  const isOvercurrent = !zone.isBreakerTripped && current > zone.targetCurrentMax;
  const isUndercurrent = !zone.isBreakerTripped && current < zone.targetCurrentMin && current > 0;

  return (
    <div
      className={`relative rounded-xl border p-5 transition-all overflow-hidden ${
        zone.isShortCircuit
          ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-900/30 animate-pulse'
          : zone.isBreakerTripped
          ? 'bg-slate-900/40 border-slate-800 opacity-80'
          : isOvercurrent
          ? 'bg-amber-950/30 border-amber-500/80'
          : 'bg-slate-900/80 border-slate-800'
      }`}
    >
      {/* Short Circuit Warning Banner */}
      {zone.isShortCircuit && (
        <div className="flex items-center justify-between bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md mb-3 animate-bounce">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>⚡ 단락(합선) 발생! 저항 0.2Ω 급감 &amp; 초과전류 폭주!</span>
          </span>
          <span className="text-[11px] underline">즉시 차단기 TRIP 필요</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-base truncate">{zone.name}</h3>
            {zone.isPriority && (
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-1.5 py-0.5 rounded">
                생명유지/핵심
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate">{zone.description}</p>
        </div>

        {/* Status Indicator */}
        <div className="text-right shrink-0">
          {zone.isBreakerTripped ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">
              <Power className="w-3 h-3 text-rose-400" />
              <span>차단됨 (OFF)</span>
            </span>
          ) : zone.isShortCircuit ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 bg-rose-900 px-2 py-1 rounded animate-pulse">
              <AlertTriangle className="w-3 h-3 text-rose-300" />
              <span>단락 폭발위험</span>
            </span>
          ) : isSafe ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-1 rounded">
              <ShieldCheck className="w-3 h-3" />
              <span>안전 정격</span>
            </span>
          ) : isOvercurrent ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-700/80 px-2 py-1 rounded">
              <Activity className="w-3 h-3 text-amber-400 animate-spin" />
              <span>과전류 발생</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-300 bg-blue-950/60 px-2 py-1 rounded">
              전력 부족
            </span>
          )}
        </div>
      </div>

      {/* Realtime Circuit Physics Readout */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 border border-slate-800/90 rounded-lg mb-4 text-center font-code">
        <div>
          <span className="text-[11px] text-slate-400 block mb-0.5">전압 (V)</span>
          <span className="text-sm font-bold text-white tabular-nums">{zone.voltage} V</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block mb-0.5">저항 (R)</span>
          <span
            className={`text-sm font-bold tabular-nums ${
              zone.isShortCircuit ? 'text-rose-400 underline font-black' : 'text-amber-400'
            }`}
          >
            {zone.isShortCircuit ? '0.2 Ω (단락)' : `${zone.resistance} Ω`}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block mb-0.5">흐르는 전류 (I)</span>
          <span
            className={`text-sm font-extrabold tabular-nums ${
              zone.isBreakerTripped
                ? 'text-slate-500'
                : zone.isShortCircuit || current > zone.maxSafeCurrent
                ? 'text-rose-400 text-base'
                : isSafe
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {zone.isBreakerTripped ? '0.0 A' : `${current} A`}
          </span>
        </div>
      </div>

      {/* Target Current Visual Gauge */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
          <span>
            목표 안전 구간: <b className="text-emerald-400 font-code">{zone.targetCurrentMin}A ~ {zone.targetCurrentMax}A</b>
          </span>
          <span className="text-[11px]">
            최대 허용: <b className="text-rose-400 font-code">{zone.maxSafeCurrent}A</b>
          </span>
        </div>
        <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          {/* Safe Zone Marker */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-500/30 border-x border-emerald-400"
            style={{
              left: `${(zone.targetCurrentMin / (zone.maxSafeCurrent * 1.3)) * 100}%`,
              width: `${((zone.targetCurrentMax - zone.targetCurrentMin) / (zone.maxSafeCurrent * 1.3)) * 100}%`,
            }}
          />
          {/* Current Indicator Marker */}
          {!zone.isBreakerTripped && (
            <div
              className={`absolute top-0 bottom-0 transition-all duration-300 ${
                zone.isShortCircuit
                  ? 'bg-rose-500 w-full'
                  : current > zone.maxSafeCurrent
                  ? 'bg-rose-500'
                  : isSafe
                  ? 'bg-emerald-400'
                  : 'bg-amber-400'
              }`}
              style={{
                width: zone.isShortCircuit
                  ? '100%'
                  : `${Math.min(100, (current / (zone.maxSafeCurrent * 1.3)) * 100)}%`,
              }}
            />
          )}
        </div>
      </div>

      {/* Resistor Adjustment Controls */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
          <span>옴의 법칙(V=IR) 저항 조절</span>
          <span className="text-slate-400 text-[11px]">
            저항(R) ⬆ ➔ 전류(I) ⬇
          </span>
        </div>

        {/* Step buttons & Slider */}
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            disabled={zone.isBreakerTripped || zone.resistance <= 5}
            onClick={() => onAdjustResistance(zone.id, -5)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold rounded border border-slate-700 transition-colors"
          >
            -5Ω
          </button>
          <button
            type="button"
            disabled={zone.isBreakerTripped || zone.resistance <= 1}
            onClick={() => onAdjustResistance(zone.id, -1)}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold rounded border border-slate-700 transition-colors"
          >
            -1Ω
          </button>

          <input
            type="range"
            min="5"
            max="120"
            step="1"
            disabled={zone.isBreakerTripped}
            value={zone.resistance}
            onChange={(e) => onSetResistance(zone.id, parseInt(e.target.value, 10))}
            className="flex-1 accent-amber-400 bg-slate-950 h-2 rounded cursor-pointer disabled:opacity-30"
          />

          <button
            type="button"
            disabled={zone.isBreakerTripped || zone.resistance >= 119}
            onClick={() => onAdjustResistance(zone.id, 1)}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold rounded border border-slate-700 transition-colors"
          >
            +1Ω
          </button>
          <button
            type="button"
            disabled={zone.isBreakerTripped || zone.resistance >= 115}
            onClick={() => onAdjustResistance(zone.id, 5)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold rounded border border-slate-700 transition-colors"
          >
            +5Ω
          </button>
        </div>

        {/* Quick Component Installation Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 mr-1">직렬 저항 모듈:</span>
          {[10, 22, 35, 50].map((rVal) => (
            <button
              key={rVal}
              type="button"
              disabled={zone.isBreakerTripped}
              onClick={() => {
                sound.playDialStep(700);
                onSetResistance(zone.id, rVal);
              }}
              className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                zone.resistance === rVal
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              {rVal}Ω
            </button>
          ))}
        </div>
      </div>

      {/* Breaker Switch and Fuse Integrity Section */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        {/* Fuse Integrity */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">퓨즈 수명:</span>
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                zone.fuseIntegrity > 50
                  ? 'bg-emerald-400'
                  : zone.fuseIntegrity > 20
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${zone.fuseIntegrity}%` }}
            />
          </div>
          <span className="text-[11px] font-code text-slate-300 tabular-nums">
            {Math.round(zone.fuseIntegrity)}%
          </span>
          {zone.fuseIntegrity <= 0 && (
            <button
              type="button"
              onClick={() => onReplaceFuse(zone.id)}
              className="text-[11px] text-amber-400 underline font-bold ml-1 hover:text-amber-300"
            >
              교체(-10 SP)
            </button>
          )}
        </div>

        {/* Breaker Trip / Reset Switch Button */}
        <button
          type="button"
          onClick={() => onToggleBreaker(zone.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            zone.isBreakerTripped
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20'
              : zone.isShortCircuit
              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-bounce'
              : 'bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{zone.isBreakerTripped ? '차단기 재투입 (ON)' : '긴급 차단기 TRIP (OFF)'}</span>
        </button>
      </div>
    </div>
  );
};
