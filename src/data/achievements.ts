export interface Achievement {
  id: string;
  name: string;
  description: string;
  title?: string;
  condition: (stats: GameStats) => boolean;
  unlocked: boolean;
}

export interface GameStats {
  spellsCast: number;
  correctSpells: number;
  consecutiveCorrectSpells: number;
  gamesWon: number;
  gamesLost: number;
  damageDealt: number;
  damageTaken: number;
  healthRemaining?: number;
  usedHealingSpells: boolean;
  perfectGames: number;
  unforgivableCursesUsed: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_spell",
    name: "First Incantation",
    description: "Cast your first spell correctly",
    title: "Novice Spellcaster",
    condition: (stats) => stats.correctSpells >= 1,
    unlocked: false
  },
  {
    id: "spell_streak",
    name: "Perfect Pronunciation",
    description: "Cast 5 correct spells in a row",
    title: "Precise Duelist",
    condition: (stats) => stats.consecutiveCorrectSpells >= 5,
    unlocked: false
  },
  {
    id: "first_victory",
    name: "First Victory",
    description: "Win your first duel",
    title: "Duel Winner",
    condition: (stats) => stats.gamesWon >= 1,
    unlocked: false
  },
  {
    id: "narrow_victory",
    name: "Narrow Escape",
    description: "Win with 10 HP or less remaining",
    title: "Survivor",
    condition: (stats) => stats.gamesWon >= 1 && (stats.healthRemaining || 0) <= 10,
    unlocked: false
  },
  {
    id: "no_healing",
    name: "Pure Combatant",
    description: "Win without using healing spells",
    title: "Combat Purist",
    condition: (stats) => stats.gamesWon >= 1 && !stats.usedHealingSpells,
    unlocked: false
  },
  {
    id: "perfect_game",
    name: "Flawless Victory",
    description: "Win without taking any damage",
    title: "Untouchable",
    condition: (stats) => stats.perfectGames >= 1,
    unlocked: false
  },
  {
    id: "spell_master",
    name: "Spellcasting Mastery",
    description: "Cast 50 spells correctly",
    title: "Spell Master",
    condition: (stats) => stats.correctSpells >= 50,
    unlocked: false
  },
  {
    id: "veteran_duelist",
    name: "Veteran Duelist",
    description: "Win 10 duels",
    title: "Duel Veteran",
    condition: (stats) => stats.gamesWon >= 10,
    unlocked: false
  },
  {
    id: "dark_arts",
    name: "Dark Arts Practitioner",
    description: "Use an Unforgivable Curse",
    title: "Dark Wizard",
    condition: (stats) => stats.unforgivableCursesUsed >= 1,
    unlocked: false
  },
  {
    id: "unstoppable",
    name: "Unstoppable Force",
    description: "Deal 500 total damage across all games",
    title: "Destroyer",
    condition: (stats) => stats.damageDealt >= 500,
    unlocked: false
  }
];

export function checkAchievements(stats: GameStats, achievements: Achievement[]): Achievement[] {
  return achievements.filter(achievement => 
    !achievement.unlocked && achievement.condition(stats)
  );
}