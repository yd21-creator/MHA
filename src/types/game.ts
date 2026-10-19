export type GamePage = 'COVER' | 'PROFILE' | 'SCOPE' | 'SETUP' | 'GAME' | 'RESULT';

export type GameScope = 'CITY' | 'NATIONAL' | 'GLOBAL';

export type EnvironmentMode = 'DAY' | 'NIGHT' | 'CYBER';

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  perk: string;
  perkDesc: string;
  baseResistanceBonus: number; // bonus Ω
  energySavings: number; // % bonus
}

export interface CircuitZone {
  id: string;
  name: string;
  iconName: string;
  description: string;
  voltage: number; // V (e.g. 220V)
  resistance: number; // R in Ohms (e.g. 22Ω -> 10A)
  current: number; // I = V / R
  targetCurrentMin: number; // Safe range min
  targetCurrentMax: number; // Safe range max
  maxSafeCurrent: number; // Above this causes zone overload
  isShortCircuit: boolean; // 단락(합선) 여부: R drops to ~0.2Ω!
  isBreakerTripped: boolean; // 차단기 내려감 여부
  fuseIntegrity: number; // 0 - 100%
  resistorSlots: number[]; // installed resistor values e.g. [10, 20]
  isPriority: boolean; // e.g., Hospital, Traffic control
}

export interface RankingEntry {
  id: string;
  rank?: number;
  nickname: string;
  character: string;
  scope: GameScope;
  score: number;
  overloadRate: number; // final %
  cleared: boolean;
  date: string;
  timeTakenSec: number;
}

export interface GameSettings {
  masterVolume: number;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  mode: EnvironmentMode;
  crtScanlines: boolean;
}
