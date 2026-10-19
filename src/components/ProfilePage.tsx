import React, { useState } from 'react';
import { User, Dices, ArrowRight, ArrowLeft, ShieldCheck, Zap, BatteryCharging, Wrench } from 'lucide-react';
import { CharacterProfile } from '../types/game';
import { sound } from '../utils/audio';

const AVAILABLE_CHARACTERS: CharacterProfile[] = [
  {
    id: 'char-1',
    name: '김그리드',
    title: '스마트그리드 수석 엔지니어',
    avatar: '👨‍💼',
    perk: '정밀 전력 튜닝',
    perkDesc: '모든 구역의 목표 허용 전류 범위가 +15% 확대되어 관리가 쉬워집니다.',
    baseResistanceBonus: 2,
    energySavings: 10,
  },
  {
    id: 'char-2',
    name: '이볼트',
    title: '중앙변전소 안전 점검원',
    avatar: '👷‍♂️',
    perk: '초고속 단락 복구',
    perkDesc: '단락(합선) 발생 시 비상 차단기 쿨다운이 50% 단축되고 신속하게 차단합니다.',
    baseResistanceBonus: 5,
    energySavings: 5,
  },
  {
    id: 'char-3',
    name: '박에코',
    title: '에너지 절약 환경 분석가',
    avatar: '👩‍🔬',
    perk: '고효율 에너지 세이버',
    perkDesc: '과부하 게이지 감소 속도가 +25% 증가하고 에너지 자원 소모를 대폭 줄입니다.',
    baseResistanceBonus: 0,
    energySavings: 25,
  },
  {
    id: 'char-4',
    name: '최퓨즈',
    title: '전기회로 마스터 장인',
    avatar: '🧑‍💻',
    perk: '옴의 법칙 계산 극대화',
    perkDesc: '저항 조절 시 획득하는 추가 점수 +30% 및 퓨즈 내구성 +20% 증가.',
    baseResistanceBonus: 4,
    energySavings: 15,
  },
];

const RANDOM_NICKNAMES = [
  '전력수호자',
  '빛의엔지니어',
  '테슬라연구원',
  '단락차단요원',
  '에코스마트',
  '쿨링마스터',
  '옴의법칙해결사',
  '그리드세이버',
  '과전류헌터',
  '변전소지킴이',
];

interface ProfilePageProps {
  nickname: string;
  onUpdateNickname: (name: string) => void;
  selectedCharacter: CharacterProfile;
  onSelectCharacter: (char: CharacterProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  nickname,
  onUpdateNickname,
  selectedCharacter,
  onSelectCharacter,
  onNext,
  onBack,
}) => {
  const [errorMsg, setErrorMsg] = useState('');

  const handleRandomize = () => {
    sound.playDialStep(650);
    const rand = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    const num = Math.floor(10 + Math.random() * 90);
    onUpdateNickname(`${rand}_${num}`);
    setErrorMsg('');
  };

  const handleNext = () => {
    if (!nickname.trim()) {
      setErrorMsg('닉네임을 1자 이상 입력해 주세요.');
      sound.playAlarm();
      return;
    }
    sound.playSwitchClick();
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-amber-400 font-code uppercase">STEP 01 / 03</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">전력 관리자 프로필 설정</h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>표지로 돌아가기</span>
        </button>
      </div>

      {/* Nickname Input Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 mb-8">
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          관리자 닉네임 (랭킹 등록용)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                onUpdateNickname(e.target.value.slice(0, 15));
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="닉네임을 입력하세요 (최대 15자)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors text-sm font-medium"
            />
          </div>
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span>랜덤 생성</span>
          </button>
        </div>
        {errorMsg && <p className="text-rose-400 text-xs mt-2">{errorMsg}</p>}
      </div>

      {/* Character Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white">특성화 캐릭터 선택</h3>
          <span className="text-xs text-slate-400">플레이 스타일에 맞는 캐릭터를 선택하세요</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AVAILABLE_CHARACTERS.map((char) => {
            const isSelected = selectedCharacter.id === char.id;
            return (
              <div
                key={char.id}
                onClick={() => {
                  sound.playSwitchClick();
                  onSelectCharacter(char);
                }}
                className={`p-5 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl p-2.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                    {char.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white text-base truncate">{char.name}</h4>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>선택됨</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2 truncate">{char.title}</p>
                    <div className="text-xs text-amber-300/90 font-medium mb-1">
                      ⚡ 특기: {char.perk}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{char.perkDesc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          이전으로
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold rounded-lg transition-colors shadow-md shadow-amber-500/15 cursor-pointer"
        >
          <span>다음 단계: 전력망 범위 선택</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
