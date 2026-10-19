import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Zap, AlertTriangle, Clock, BatteryCharging, Flame, Award, ArrowRight, RefreshCw } from 'lucide-react';
import { CircuitZone, GameScope, CharacterProfile, GameSettings } from '../types/game';
import { CircuitCard } from './CircuitCard';
import { SubstationBoss } from './SubstationBoss';
import { sound } from '../utils/audio';

interface GameViewProps {
  scope: GameScope;
  character: CharacterProfile;
  settings: GameSettings;
  onGameOver: (isVictory: boolean, score: number, overloadRate: number, timeRemainingSec: number) => void;
  bossImage: string;
}

export const GameView: React.FC<GameViewProps> = ({
  scope,
  character,
  settings,
  onGameOver,
  bossImage,
}) => {
  // 5 Stages Definition
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes
  const [overload, setOverload] = useState<number>(55.0); // Start at 55%
  const [score, setScore] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(100);
  const [stageClearedNotice, setStageClearedNotice] = useState<string | null>(null);

  // Initialize Zones based on Scope
  const [zones, setZones] = useState<CircuitZone[]>(() => {
    const baseZones: CircuitZone[] = [
      {
        id: 'z-hospital',
        name: '중앙 종합병원',
        iconName: 'Hospital',
        description: '응급실 생명유지장치 가동 중. 전력 중단 절대 불가!',
        voltage: 220,
        resistance: 18,
        current: 12.2,
        targetCurrentMin: 10.0,
        targetCurrentMax: 14.0,
        maxSafeCurrent: 20.0,
        isShortCircuit: false,
        isBreakerTripped: false,
        fuseIntegrity: 100,
        resistorSlots: [10, 8],
        isPriority: true,
      },
      {
        id: 'z-residential',
        name: '대단지 아파트 주거구역',
        iconName: 'Home',
        description: '폭염으로 인한 전 세대 에어컨 동시 가동 과부하 발생!',
        voltage: 220,
        resistance: 10,
        current: 22.0,
        targetCurrentMin: 11.0,
        targetCurrentMax: 15.0,
        maxSafeCurrent: 22.0,
        isShortCircuit: false,
        isBreakerTripped: false,
        fuseIntegrity: 90,
        resistorSlots: [10],
        isPriority: false,
      },
      {
        id: 'z-traffic',
        name: '도심 교통망 & 신호체계',
        iconName: 'Car',
        description: '도심 주요 교차로 신호등 및 지하철 순환선 급전망',
        voltage: 220,
        resistance: 22,
        current: 10.0,
        targetCurrentMin: 9.0,
        targetCurrentMax: 13.0,
        maxSafeCurrent: 18.0,
        isShortCircuit: false,
        isBreakerTripped: false,
        fuseIntegrity: 100,
        resistorSlots: [22],
        isPriority: true,
      },
    ];

    if (scope === 'NATIONAL' || scope === 'GLOBAL') {
      baseZones.push(
        {
          id: 'z-railway',
          name: '고속철도 KTX 전철변전소',
          iconName: 'Train',
          description: '전국 간선 철도 전철 급전 구역. 과전류 발생 시 열차 비상정차',
          voltage: 380,
          resistance: 25,
          current: 15.2,
          targetCurrentMin: 13.0,
          targetCurrentMax: 18.0,
          maxSafeCurrent: 26.0,
          isShortCircuit: false,
          isBreakerTripped: false,
          fuseIntegrity: 85,
          resistorSlots: [25],
          isPriority: true,
        },
        {
          id: 'z-datacenter',
          name: '국가 공공 데이터센터',
          iconName: 'Server',
          description: '전국 전력망 감시 및 행정 서버 수용 IDC 냉각팬 과부하',
          voltage: 220,
          resistance: 14,
          current: 15.7,
          targetCurrentMin: 12.0,
          targetCurrentMax: 16.0,
          maxSafeCurrent: 24.0,
          isShortCircuit: false,
          isBreakerTripped: false,
          fuseIntegrity: 95,
          resistorSlots: [14],
          isPriority: false,
        }
      );
    }

    if (scope === 'GLOBAL') {
      baseZones.push(
        {
          id: 'z-spaceport',
          name: '국제 우주센터 발사장',
          iconName: 'Rocket',
          description: '극저온 로켓 연료 공급 및 위성 관제 통신 초고압 전력망',
          voltage: 440,
          resistance: 30,
          current: 14.6,
          targetCurrentMin: 12.0,
          targetCurrentMax: 16.0,
          maxSafeCurrent: 25.0,
          isShortCircuit: false,
          isBreakerTripped: false,
          fuseIntegrity: 100,
          resistorSlots: [30],
          isPriority: true,
        },
        {
          id: 'z-quantum',
          name: '양자컴퓨팅 슈퍼연구소',
          iconName: 'Cpu',
          description: '초전도 냉각기 가동 구역. 저항 오차 발생 시 초전도 파괴 위험',
          voltage: 380,
          resistance: 24,
          current: 15.8,
          targetCurrentMin: 14.0,
          targetCurrentMax: 18.0,
          maxSafeCurrent: 26.0,
          isShortCircuit: false,
          isBreakerTripped: false,
          fuseIntegrity: 90,
          resistorSlots: [24],
          isPriority: false,
        }
      );
    }

    return baseZones;
  });

  // Track if stage 4 boss is beaten
  const [isBossDefeated, setIsBossDefeated] = useState(false);

  // Main game tick loop (1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time over check
          if (overload <= 30.0 && currentStage === 5) {
            onGameOver(true, score + 2000, overload, 0);
          } else {
            onGameOver(false, score, overload, 0);
          }
          return 0;
        }
        return prev - 1;
      });

      // Calculate physics update across all circuits
      setZones((prevZones) => {
        let totalCurrentExceed = 0;
        let safeCount = 0;

        const updated = prevZones.map((z) => {
          if (z.isBreakerTripped) return z;

          const activeResistance = z.isShortCircuit ? 0.2 : z.resistance;
          const curr = z.voltage / activeResistance;

          // Fuse degradation under overcurrent
          let nextFuse = z.fuseIntegrity;
          if (curr > z.maxSafeCurrent) {
            nextFuse = Math.max(0, nextFuse - 4);
          }

          // Automatically trip if fuse blows out completely
          const willTrip = nextFuse <= 0;
          if (willTrip && !z.isBreakerTripped) {
            sound.playSpark();
          }

          if (curr > z.targetCurrentMax) {
            totalCurrentExceed += curr - z.targetCurrentMax;
          } else if (curr >= z.targetCurrentMin && curr <= z.targetCurrentMax) {
            safeCount++;
          }

          return {
            ...z,
            current: parseFloat(curr.toFixed(1)),
            fuseIntegrity: nextFuse,
            isBreakerTripped: willTrip ? true : z.isBreakerTripped,
          };
        });

        // Update Overload meter based on grid performance
        setOverload((prevOverload) => {
          let delta = 0;
          if (totalCurrentExceed > 5) {
            delta = 1.2 + totalCurrentExceed * 0.15;
          } else if (safeCount >= Math.ceil(prevZones.length * 0.7)) {
            // Well-balanced grid recovers overload!
            const reduction = 0.8 + (character.energySavings / 100);
            delta = -reduction;
          }

          const newOverload = Math.max(5, Math.min(100, prevOverload + delta));
          if (newOverload >= 100) {
            sound.playDefeat();
            onGameOver(false, score, 100, timeLeft);
          }
          return parseFloat(newOverload.toFixed(1));
        });

        // Energy SP regeneration when circuits are safe
        setEnergy((prevSP) => Math.min(100, prevSP + (safeCount > 0 ? 2 : 0)));

        return updated;
      });

      // Passive score accumulation
      setScore((s) => s + 10);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStage, score, overload, timeLeft, character, onGameOver]);

  // Stage Advancement Engine
  useEffect(() => {
    // Stage 1 -> 2: When player stabilizes initial overload below 50%
    if (currentStage === 1 && overload <= 48) {
      setCurrentStage(2);
      setScore((s) => s + 500);
      sound.playVictory();
      setStageClearedNotice('1단계 통과: 기초 전력망 안정화 완료! 2단계 전압 변동에 대응하세요.');
      // Stage 2 event: Grid voltage fluctuation
      setZones((prev) =>
        prev.map((z) => ({
          ...z,
          voltage: z.voltage === 220 ? 240 : 400,
        }))
      );
    }
    // Stage 2 -> 3: When overload falls below 42%
    else if (currentStage === 2 && overload <= 42) {
      setCurrentStage(3);
      setScore((s) => s + 800);
      sound.playVictory();
      setStageClearedNotice('2단계 통과: 옴의 법칙 저항 매칭 성공! 3단계 위기 심화 및 퓨즈 보호 가동.');
      // Stage 3 event: Random short circuit in residential or railway zone
      setTimeout(() => {
        setZones((prev) => {
          const targetIdx = 1; // residential
          const copy = [...prev];
          if (copy[targetIdx]) {
            copy[targetIdx] = { ...copy[targetIdx], isShortCircuit: true };
            sound.playSpark();
            sound.playAlarm();
          }
          return copy;
        });
      }, 1500);
    }
    // Stage 3 -> 4: When overload falls below 36%
    else if (currentStage === 3 && overload <= 36) {
      setCurrentStage(4);
      setScore((s) => s + 1200);
      sound.playAlarm();
      setStageClearedNotice('3단계 통과: 긴급 단락 진압 완료! 4단계 중앙 변전소 대형 보스전 돌입!');
    }
    // Stage 4 -> 5: When boss is defeated and overload <= 34%
    else if (currentStage === 4 && isBossDefeated) {
      setCurrentStage(5);
      setScore((s) => s + 2000);
      sound.playVictory();
      setStageClearedNotice('4단계 통과: 중앙 변전소 폭발 저지 완료! 5단계 과부하율 30% 이하 최종 안정화 돌입!');
    }
    // Stage 5 Victory check: When overload <= 30%
    else if (currentStage === 5 && overload <= 30.0) {
      sound.playVictory();
      onGameOver(true, score + timeLeft * 10 + 3000, overload, timeLeft);
    }
  }, [currentStage, overload, isBossDefeated, score, timeLeft, onGameOver]);

  // Adjust resistance handler
  const handleAdjustResistance = (zoneId: string, delta: number) => {
    sound.playDialStep(550 + delta * 20);
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== zoneId) return z;
        const newR = Math.max(2, Math.min(120, z.resistance + delta));
        return {
          ...z,
          resistance: newR,
          current: parseFloat((z.voltage / (z.isShortCircuit ? 0.2 : newR)).toFixed(1)),
        };
      })
    );
  };

  const handleSetResistance = (zoneId: string, value: number) => {
    sound.playDialStep(650);
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== zoneId) return z;
        return {
          ...z,
          resistance: value,
          current: parseFloat((z.voltage / (z.isShortCircuit ? 0.2 : value)).toFixed(1)),
        };
      })
    );
  };

  // Toggle Breaker (Relay)
  const handleToggleBreaker = (zoneId: string) => {
    sound.playSwitchClick();
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== zoneId) return z;
        const nextTripped = !z.isBreakerTripped;

        // If tripping during short circuit, isolate the short!
        let nextShort = z.isShortCircuit;
        let nextR = z.resistance;
        if (nextTripped && z.isShortCircuit) {
          nextShort = false; // Isolated & repaired!
          nextR = Math.max(20, z.resistance); // auto add safety resistance
        }

        return {
          ...z,
          isBreakerTripped: nextTripped,
          isShortCircuit: nextShort,
          resistance: nextR,
        };
      })
    );
  };

  // Replace blown fuse
  const handleReplaceFuse = (zoneId: string) => {
    if (energy < 10) {
      sound.playAlarm();
      return;
    }
    sound.playSwitchClick();
    setEnergy((e) => Math.max(0, e - 10));
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== zoneId) return z;
        return {
          ...z,
          fuseIntegrity: 100,
          isBreakerTripped: false,
        };
      })
    );
  };

  return (
    <div className={`min-h-[calc(100vh-65px)] pb-12 ${settings.crtScanlines ? 'crt-scanlines' : ''}`}>
      {/* HUD Header Bar */}
      <div className="sticky top-[57px] z-40 bg-slate-950/95 border-b border-slate-800 px-6 py-3 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Stage Progression Pills */}
          <div className="flex items-center gap-1.5 font-code">
            {[1, 2, 3, 4, 5].map((st) => (
              <div
                key={st}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  currentStage === st
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/50'
                    : currentStage > st
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {st}단계
              </div>
            ))}
            <span className="text-xs text-slate-400 ml-2 font-sans font-medium hidden sm:inline">
              {currentStage === 1 && '사건 발생: 초기 과전류 방어'}
              {currentStage === 2 && '기초 복구: 전압 변동 저항 튜닝'}
              {currentStage === 3 && '위기 심화: 필수 인프라 우선 배분 & 단락 격리'}
              {currentStage === 4 && '대형 보스전: 중앙 변전소 단락 폭발 저지'}
              {currentStage === 5 && '최종 안정화: 과부하 30% 이하 달성'}
            </span>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-4 text-xs font-code">
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>TIME:</span>
              <b className="text-white tabular-nums">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </b>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
              <span>SP:</span>
              <b className="text-amber-400 tabular-nums">{energy}</b>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <span>SCORE:</span>
              <b className="text-amber-400 tabular-nums">{score}</b>
            </div>
          </div>
        </div>

        {/* Global Overload Meter */}
        <div className="max-w-6xl mx-auto mt-2.5">
          <div className="flex justify-between items-center text-xs mb-1 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>도시 전력망 과부하율 (Overload)</span>
              <span className="text-slate-500 font-normal">| 100% 도달 시 대정전!</span>
            </span>
            <span className="font-code">
              현재: <b
                className={`tabular-nums ${
                  overload <= 30
                    ? 'text-emerald-400 font-extrabold'
                    : overload <= 60
                    ? 'text-amber-400'
                    : 'text-rose-400 font-black animate-pulse'
                }`}
              >
                {overload.toFixed(1)}%
              </b>{' '}
              <span className="text-slate-500 font-normal">(목표: ≤ 30.0%)</span>
            </span>
          </div>

          <div className="relative w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
            {/* 30% Target Line Marker */}
            <div
              className="absolute top-0 bottom-0 z-20 border-r-2 border-emerald-400 border-dashed"
              style={{ left: '30%' }}
              title="승리 목표선 (30%)"
            />
            {/* Overload Fill Bar */}
            <div
              className={`h-full transition-all duration-500 ${
                overload <= 30
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                  : overload <= 60
                  ? 'bg-amber-400'
                  : 'bg-rose-500 shadow-md shadow-rose-500/50'
              }`}
              style={{ width: `${overload}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage Clear Banner Notification */}
      {stageClearedNotice && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{stageClearedNotice}</span>
            </span>
            <button
              onClick={() => setStageClearedNotice(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Main Board Container */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        {/* Stage 4 Boss Battle Mode */}
        {currentStage === 4 && !isBossDefeated ? (
          <SubstationBoss
            bossImage={bossImage}
            onSuccess={() => {
              setIsBossDefeated(true);
              setOverload((ov) => Math.max(15, ov - 15));
            }}
          />
        ) : null}

        {/* Circuit Zones Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>핵심 회로망 실시간 제어 센터 ({zones.length}개 구역)</span>
            </h2>
            <span className="text-xs text-slate-400">
              * V=IR: 저항을 올리면 전류가 감소하여 과전류를 차단합니다.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {zones.map((zone) => (
              <CircuitCard
                key={zone.id}
                zone={zone}
                onAdjustResistance={handleAdjustResistance}
                onSetResistance={handleSetResistance}
                onToggleBreaker={handleToggleBreaker}
                onReplaceFuse={handleReplaceFuse}
                energy={energy}
              />
            ))}
          </div>
        </div>

        {/* Smart Energy Saving Action Bar */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              스마트 전력 제어 팁: 전류(I)가 안전 정격 범위에 머물면 도시 과부하율이 자동으로 감소합니다.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Emergency cooling pulse: costs 30 SP to shave off 5% overload
                if (energy >= 30) {
                  sound.playSwitchClick();
                  setEnergy((e) => e - 30);
                  setOverload((o) => Math.max(5, o - 5));
                } else {
                  sound.playAlarm();
                }
              }}
              disabled={energy < 30}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 disabled:opacity-40 text-cyan-300 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>긴급 냉각 펌프 가동 (-30 SP / 과부하 -5%)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
