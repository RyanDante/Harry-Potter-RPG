import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameMenu } from '@/components/GameMenu';
import { GameArena } from '@/components/GameArena';
import { AchievementNotification } from '@/components/AchievementNotification';
import { Achievement } from '@/data/achievements';

const Index = () => {
  const { gameState, startGame, castSpell, endGame, resetGame } = useGameState();
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);

  // Check for new achievements
  useEffect(() => {
    const lastKnownCount = parseInt(localStorage.getItem('achievementCount') || '0');
    const currentUnlocked = gameState.achievements.filter(a => a.unlocked);
    
    if (currentUnlocked.length > lastKnownCount) {
      const newOnes = currentUnlocked.slice(lastKnownCount);
      setNewAchievements(prev => [...prev, ...newOnes]);
      localStorage.setItem('achievementCount', currentUnlocked.length.toString());
    }
  }, [gameState.achievements]);

  // Auto-end game when a player's HP reaches 0
  useEffect(() => {
    if (gameState.phase === 'playing') {
      const deadPlayer = gameState.players.find(p => p.hp <= 0);
      if (deadPlayer) {
        const winner = gameState.players.find(p => p.hp > 0);
        if (winner) {
          endGame(winner.id);
        }
      }
    }
  }, [gameState.players, gameState.phase, endGame]);

  // Initialize background music (commented out for development)
  // useEffect(() => {
  //   const audio = new Audio('/magical-ambience.mp3');
  //   audio.loop = true;
  //   audio.volume = 0.3;
  //   setBackgroundMusic(audio);
    
  //   return () => {
  //     audio.pause();
  //     audio.currentTime = 0;
  //   };
  // }, []);

  const handleStartGame = (mode: typeof gameState.mode, difficulty: typeof gameState.difficulty) => {
    startGame(mode, difficulty);
    // backgroundMusic?.play();
  };

  const handleEndGame = () => {
    resetGame();
    // backgroundMusic?.pause();
  };

  const handleCastSpell = (spellInput: string) => {
    const result = castSpell(spellInput);
    
    // Play spell sound effect (commented out for development)
    // if (result.success) {
    //   const audio = new Audio(`/sounds/${spellInput.toLowerCase().replace(' ', '_')}.mp3`);
    //   audio.volume = 0.4;
    //   audio.play().catch(() => {
    //     // Fallback to generic spell sound
    //     const genericAudio = new Audio('/sounds/spell_cast.mp3');
    //     genericAudio.volume = 0.4;
    //     genericAudio.play().catch(() => {}); // Ignore if no sound files
    //   });
    // }
    
    return result;
  };

  const removeAchievementNotification = (index: number) => {
    setNewAchievements(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen">
      {/* Achievement Notifications */}
      {newAchievements.map((achievement, index) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => removeAchievementNotification(index)}
        />
      ))}

      {/* Main Game Content */}
      {gameState.mode === 'menu' ? (
        <GameMenu 
          onStartGame={handleStartGame}
          achievements={gameState.achievements}
        />
      ) : (
        <GameArena 
          gameState={gameState}
          onCastSpell={handleCastSpell}
          onEndGame={handleEndGame}
        />
      )}
    </div>
  );
};

export default Index;
