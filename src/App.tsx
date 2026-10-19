import React, { useState, useEffect } from 'react';
import { GamePage, GameScope, CharacterProfile, GameSettings, RankingEntry } from './types/game';
import { Navbar } from './components/Navbar';
import { CoverPage } from './components/CoverPage';
import { ProfilePage } from './components/ProfilePage';
import { ScopePage } from './components/ScopePage';
import { SetupPage } from './components/SetupPage';
import { GameView } from './components/GameView';
import { ResultModal } from './components/ResultModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { getRankings, saveRanking } from './utils/storage';
import { sound } from './utils/audio';

// Visual assets generated
import heroCoverImg from './assets/images/hero_cover_city_1792397994775.jpg';
import substationBossImg from './assets/images/substation_core_1792398012131.jpg';

const DEFAULT_CHARACTER: CharacterProfile = {
  id: 'char-1',
  name: '김그리드',
  title: '스마트그리드 수석 엔지니어',
  avatar: '👨‍💼',
  perk: '정밀 전력 튜닝',
  perkDesc: '모든 구역의 목표 허용 전류 범위가 +15% 확대되어 관리가 쉬워집니다.',
  baseResistanceBonus: 2,
  energySavings: 10,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<GamePage>('COVER');
  const [nickname, setNickname] = useState<string>('전력수호자01');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterProfile>(DEFAULT_CHARACTER);
  const [selectedScope, setSelectedScope] = useState<GameScope>('CITY');

  const [settings, setSettings] = useState<GameSettings>({
    masterVolume: 0.5,
    bgmEnabled: true,
    sfxEnabled: true,
    mode: 'NIGHT',
    crtScanlines: true,
  });

  const [rankings, setRankings] = useState<RankingEntry[]>(() => getRankings());
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Result state
  const [lastResult, setLastResult] = useState<{
    isVictory: boolean;
    score: number;
    overloadRate: number;
    timeRemainingSec: number;
    currentEntryId: string;
  } | null>(null);

  // Handle Game Over
  const handleGameOver = (
    isVictory: boolean,
    score: number,
    overloadRate: number,
    timeRemainingSec: number
  ) => {
    sound.stopBGM();

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    const newTop10 = saveRanking({
      nickname: nickname.trim() || '익명의 엔지니어',
      character: selectedCharacter.name,
      scope: selectedScope,
      score,
      overloadRate: Math.round(overloadRate),
      cleared: isVictory,
      date: dateStr,
      timeTakenSec: 180 - timeRemainingSec,
    });

    setRankings(newTop10);

    const createdId = newTop10.find((r) => r.nickname === (nickname.trim() || '익명의 엔지니어'))?.id || '';

    setLastResult({
      isVictory,
      score,
      overloadRate,
      timeRemainingSec,
      currentEntryId: createdId,
    });
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handlePlayAgain = () => {
    setLastResult(null);
    setCurrentPage('GAME');
    if (settings.bgmEnabled) {
      sound.startBGM();
    }
  };

  const handleQuitToCover = () => {
    setLastResult(null);
    setCurrentPage('COVER');
    sound.stopBGM();
  };

  // Background Theme based on mode
  const bgThemeClass =
    settings.mode === 'DAY'
      ? 'bg-slate-950 text-slate-100'
      : settings.mode === 'CYBER'
      ? 'bg-purple-950/20 text-slate-100'
      : 'bg-slate-950 text-slate-100';

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 ${bgThemeClass}`}>
      {/* Top Bar Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          if (currentPage === 'GAME' && page !== 'GAME') {
            sound.stopBGM();
          }
          setCurrentPage(page);
        }}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* Main Pages Flow */}
      <main className="flex-1 flex flex-col">
        {/* Page 1: Cover Page */}
        {currentPage === 'COVER' && (
          <CoverPage
            coverImage={heroCoverImg}
            onStart={() => setCurrentPage('PROFILE')}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}

        {/* Page 2: Profile Page */}
        {currentPage === 'PROFILE' && (
          <ProfilePage
            nickname={nickname}
            onUpdateNickname={setNickname}
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
            onNext={() => setCurrentPage('SCOPE')}
            onBack={() => setCurrentPage('COVER')}
          />
        )}

        {/* Page 3: Scope Selection Page */}
        {currentPage === 'SCOPE' && (
          <ScopePage
            selectedScope={selectedScope}
            onSelectScope={setSelectedScope}
            onNext={() => setCurrentPage('SETUP')}
            onBack={() => setCurrentPage('PROFILE')}
          />
        )}

        {/* Page 4: Setup & Launch Page */}
        {currentPage === 'SETUP' && (
          <SetupPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onStartGame={() => setCurrentPage('GAME')}
            onBack={() => setCurrentPage('SCOPE')}
            scopeTitle={
              selectedScope === 'CITY'
                ? '도시 전력망 (City)'
                : selectedScope === 'NATIONAL'
                ? '국가 전력망 (National)'
                : '전세계 연계망 (Global)'
            }
            characterName={selectedCharacter.name}
          />
        )}

        {/* Page 5: Active In-Game Play */}
        {currentPage === 'GAME' && (
          <GameView
            key={`${selectedScope}-${selectedCharacter.id}`}
            scope={selectedScope}
            character={selectedCharacter}
            settings={settings}
            onGameOver={handleGameOver}
            bossImage={substationBossImg}
          />
        )}
      </main>

      {/* Result Modal upon Victory or Defeat */}
      {lastResult && (
        <ResultModal
          isVictory={lastResult.isVictory}
          score={lastResult.score}
          overloadRate={lastResult.overloadRate}
          timeRemainingSec={lastResult.timeRemainingSec}
          scope={selectedScope}
          characterName={selectedCharacter.name}
          rankings={rankings}
          currentEntryId={lastResult.currentEntryId}
          onPlayAgain={handlePlayAgain}
          onQuit={handleQuitToCover}
        />
      )}

      {/* Top 10 Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        rankings={rankings}
      />
    </div>
  );
}
