import { useState, useCallback, useEffect } from 'react';
import { Spell, findSpell } from '@/data/spells';
import { Achievement, GameStats, checkAchievements, ACHIEVEMENTS } from '@/data/achievements';

export type GameMode = 'menu' | 'ai' | 'pvp';
export type Difficulty = 'easy' | 'normal' | 'hard';
export type GamePhase = 'setup' | 'playing' | 'casting' | 'ended';

export interface Player {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  isAI: boolean;
  cooldowns: Map<string, number>;
  statusEffects: Map<string, number>;
  titles: string[];
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  phase: GamePhase;
  currentPlayer: number;
  players: Player[];
  lastSpell?: {
    caster: string;
    spell: Spell;
    target: string;
    success: boolean;
  };
  turnTimer: number;
  gameStats: GameStats;
  achievements: Achievement[];
}

const initialPlayer = (id: string, name: string, isAI = false): Player => ({
  id,
  name,
  hp: 100,
  maxHp: 100,
  stamina: 100,
  maxStamina: 100,
  isAI,
  cooldowns: new Map(),
  statusEffects: new Map(),
  titles: []
});

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    mode: 'menu',
    difficulty: 'normal',
    phase: 'setup',
    currentPlayer: 0,
    players: [],
    turnTimer: 30,
    gameStats: {
      spellsCast: 0,
      correctSpells: 0,
      consecutiveCorrectSpells: 0,
      gamesWon: 0,
      gamesLost: 0,
      damageDealt: 0,
      damageTaken: 0,
      usedHealingSpells: false,
      perfectGames: 0,
      unforgivableCursesUsed: 0
    },
    achievements: [...ACHIEVEMENTS]
  });

  // AI logic for different difficulties
  const getAISpell = useCallback((aiPlayer: Player, opponent: Player): string => {
    const availableSpells = gameState.difficulty === 'easy' 
      ? ['Stupefy', 'Expelliarmus', 'Protego']
      : gameState.difficulty === 'normal'
      ? ['Stupefy', 'Expelliarmus', 'Protego', 'Diffindo', 'Reducto', 'Episkey']
      : ['Stupefy', 'Expelliarmus', 'Protego', 'Diffindo', 'Reducto', 'Episkey', 'Sectumsempra', 'Avada Kedavra'];

    if (gameState.difficulty === 'easy') {
      return availableSpells[Math.floor(Math.random() * availableSpells.length)];
    }

    if (gameState.difficulty === 'normal') {
      // Simple strategy: heal if low HP, attack otherwise
      if (aiPlayer.hp < 30 && aiPlayer.stamina >= 20) {
        return 'Episkey';
      }
      const attackSpells = availableSpells.filter(spell => !['Episkey', 'Protego'].includes(spell));
      return attackSpells[Math.floor(Math.random() * attackSpells.length)];
    }

    // Hard difficulty: Advanced AI strategy
    if (aiPlayer.hp < 25 && aiPlayer.stamina >= 20) {
      return 'Episkey';
    }
    if (opponent.hp < 30 && aiPlayer.stamina >= 30) {
      return 'Sectumsempra';
    }
    if (opponent.hp < 60 && aiPlayer.stamina >= 50) {
      return 'Avada Kedavra';
    }
    
    const strategicSpells = ['Expelliarmus', 'Stupefy', 'Diffindo', 'Reducto'];
    return strategicSpells[Math.floor(Math.random() * strategicSpells.length)];
  }, [gameState.difficulty]);

  const startGame = useCallback((mode: GameMode, difficulty: Difficulty) => {
    const players = mode === 'ai' 
      ? [
          initialPlayer('player1', 'Player 1'),
          initialPlayer('ai', 'Dark Wizard', true)
        ]
      : [
          initialPlayer('player1', 'Player 1'),
          initialPlayer('player2', 'Player 2')
        ];

    setGameState(prev => ({
      ...prev,
      mode,
      difficulty,
      phase: 'playing',
      players,
      currentPlayer: 0,
      gameStats: {
        ...prev.gameStats,
        usedHealingSpells: false,
        healthRemaining: undefined
      }
    }));
  }, []);

  const castSpell = useCallback((spellInput: string) => {
    const spell = findSpell(spellInput);
    if (!spell) {
      setGameState(prev => ({
        ...prev,
        gameStats: {
          ...prev.gameStats,
          spellsCast: prev.gameStats.spellsCast + 1,
          consecutiveCorrectSpells: 0
        }
      }));
      return { success: false, message: "Unknown spell!" };
    }

    const currentPlayer = gameState.players[gameState.currentPlayer];
    const targetPlayer = gameState.players[1 - gameState.currentPlayer];

    // Check stamina and cooldowns
    if (currentPlayer.stamina < spell.staminaCost) {
      return { success: false, message: "Not enough stamina!" };
    }

    if (currentPlayer.cooldowns.has(spell.name)) {
      return { success: false, message: `${spell.name} is on cooldown!` };
    }

    // Apply spell effects
    setGameState(prev => {
      const newPlayers = [...prev.players];
      const caster = newPlayers[prev.currentPlayer];
      const target = newPlayers[1 - prev.currentPlayer];

      // Consume stamina
      caster.stamina = Math.max(0, caster.stamina - spell.staminaCost);
      
      // Set cooldown
      caster.cooldowns.set(spell.name, spell.cooldown);

      let damage = 0;
      let healing = 0;

      // Apply spell effects
      switch (spell.type) {
        case 'attack':
          damage = spell.damage || 0;
          target.hp = Math.max(0, target.hp - damage);
          break;
        case 'healing':
          healing = spell.healing || 0;
          caster.hp = Math.min(caster.maxHp, caster.hp + healing);
          break;
        case 'defense':
          // Simplified: just reduce next attack damage
          break;
        case 'special':
          damage = spell.damage || 0;
          healing = spell.healing || 0;
          target.hp = Math.max(0, target.hp - damage);
          caster.hp = Math.min(caster.maxHp, caster.hp + healing);
          break;
      }

      // Update stats
      const newStats = { ...prev.gameStats };
      newStats.spellsCast += 1;
      newStats.correctSpells += 1;
      newStats.consecutiveCorrectSpells += 1;
      newStats.damageDealt += damage;

      if (spell.type === 'healing') {
        newStats.usedHealingSpells = true;
      }

      if (['Avada Kedavra', 'Crucio', 'Imperio'].includes(spell.name)) {
        newStats.unforgivableCursesUsed += 1;
      }

      return {
        ...prev,
        players: newPlayers,
        currentPlayer: 1 - prev.currentPlayer,
        phase: target.hp <= 0 ? 'ended' : 'playing',
        lastSpell: {
          caster: caster.name,
          spell,
          target: target.name,
          success: true
        },
        gameStats: newStats
      };
    });

    return { success: true, message: `${spell.name} cast successfully!` };
  }, [gameState.players, gameState.currentPlayer]);

  // Handle AI turns
  useEffect(() => {
    if (gameState.phase === 'playing' && 
        gameState.players[gameState.currentPlayer]?.isAI) {
      const timer = setTimeout(() => {
        const aiPlayer = gameState.players[gameState.currentPlayer];
        const opponent = gameState.players[1 - gameState.currentPlayer];
        const spellName = getAISpell(aiPlayer, opponent);
        castSpell(spellName);
      }, 1500); // AI delay for realism

      return () => clearTimeout(timer);
    }
  }, [gameState.phase, gameState.currentPlayer, gameState.players, getAISpell, castSpell]);

  // Regenerate stamina and reduce cooldowns
  useEffect(() => {
    if (gameState.phase === 'playing') {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          players: prev.players.map(player => ({
            ...player,
            stamina: Math.min(player.maxStamina, player.stamina + 2),
            cooldowns: new Map(
              Array.from(player.cooldowns.entries())
                .map(([spell, cooldown]) => [spell, cooldown - 1] as [string, number])
                .filter(([_, cooldown]) => (cooldown as number) > 0)
            )
          }))
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.phase]);

  const endGame = useCallback((winnerId: string) => {
    setGameState(prev => {
      const newStats = { ...prev.gameStats };
      const winner = prev.players.find(p => p.id === winnerId);
      
      if (winner?.id === 'player1' || winner?.id === 'player2') {
        newStats.gamesWon += 1;
        newStats.healthRemaining = winner.hp;
        
        if (prev.players.find(p => p.id !== winnerId)?.hp === 100) {
          newStats.perfectGames += 1;
        }
      } else {
        newStats.gamesLost += 1;
      }

      // Check for new achievements
      const newAchievements = checkAchievements(newStats, prev.achievements);
      const updatedAchievements = prev.achievements.map(achievement => ({
        ...achievement,
        unlocked: achievement.unlocked || newAchievements.some(na => na.id === achievement.id)
      }));

      return {
        ...prev,
        phase: 'ended',
        gameStats: newStats,
        achievements: updatedAchievements
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      mode: 'menu',
      phase: 'setup',
      players: [],
      currentPlayer: 0,
      lastSpell: undefined
    }));
  }, []);

  return {
    gameState,
    startGame,
    castSpell,
    endGame,
    resetGame
  };
}