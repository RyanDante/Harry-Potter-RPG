export interface Spell {
  name: string;
  type: 'attack' | 'defense' | 'healing' | 'buff' | 'debuff' | 'special';
  damage?: number;
  healing?: number;
  blockAmount?: number;
  effect?: string;
  cooldown: number;
  staminaCost: number;
  castingTime: number;
  description: string;
  sound?: string;
}

export const SPELLS: Spell[] = [
  {
    name: "Expelliarmus",
    type: "attack",
    damage: 20,
    cooldown: 5,
    staminaCost: 15,
    castingTime: 1,
    description: "The Disarming Charm - forces opponent to drop their wand",
    sound: "expelliarmus"
  },
  {
    name: "Protego",
    type: "defense",
    blockAmount: 25,
    cooldown: 8,
    staminaCost: 20,
    castingTime: 1,
    description: "Shield Charm - creates a magical barrier",
    sound: "protego"
  },
  {
    name: "Stupefy",
    type: "attack",
    damage: 15,
    cooldown: 3,
    staminaCost: 10,
    castingTime: 1,
    description: "Stunning Spell - stuns the opponent",
    sound: "stupefy"
  },
  {
    name: "Episkey",
    type: "healing",
    healing: 25,
    cooldown: 10,
    staminaCost: 20,
    castingTime: 2,
    description: "Healing Spell - restores health",
    sound: "episkey"
  },
  {
    name: "Sectumsempra",
    type: "attack",
    damage: 35,
    cooldown: 12,
    staminaCost: 30,
    castingTime: 2,
    description: "Dark cutting curse - deals massive damage",
    sound: "sectumsempra"
  },
  {
    name: "Expecto Patronum",
    type: "special",
    damage: 20,
    healing: 15,
    cooldown: 15,
    staminaCost: 35,
    castingTime: 3,
    description: "Patronus Charm - attacks and heals simultaneously",
    sound: "patronum"
  },
  {
    name: "Avada Kedavra",
    type: "attack",
    damage: 60,
    cooldown: 25,
    staminaCost: 50,
    castingTime: 4,
    description: "The Killing Curse - ultimate attack",
    sound: "avada_kedavra"
  },
  {
    name: "Crucio",
    type: "debuff",
    damage: 10,
    effect: "paralyze",
    cooldown: 18,
    staminaCost: 25,
    castingTime: 2,
    description: "Cruciatus Curse - torture curse that paralyzes",
    sound: "crucio"
  },
  {
    name: "Imperio",
    type: "debuff",
    effect: "control",
    cooldown: 20,
    staminaCost: 30,
    castingTime: 3,
    description: "Imperius Curse - controls opponent's next action",
    sound: "imperio"
  },
  {
    name: "Petrificus Totalus",
    type: "debuff",
    effect: "freeze",
    cooldown: 8,
    staminaCost: 20,
    castingTime: 1,
    description: "Body-Bind Curse - freezes opponent for one turn",
    sound: "petrificus"
  },
  {
    name: "Diffindo",
    type: "attack",
    damage: 18,
    cooldown: 4,
    staminaCost: 12,
    castingTime: 1,
    description: "Severing Charm - cuts through defenses",
    sound: "diffindo"
  },
  {
    name: "Reducto",
    type: "attack",
    damage: 25,
    cooldown: 6,
    staminaCost: 18,
    castingTime: 1,
    description: "Reductor Curse - blasts obstacles apart",
    sound: "reducto"
  },
  {
    name: "Wingardium Leviosa",
    type: "buff",
    effect: "levitate",
    cooldown: 10,
    staminaCost: 15,
    castingTime: 2,
    description: "Levitation Charm - increases evasion",
    sound: "leviosa"
  },
  {
    name: "Lumos Maxima",
    type: "attack",
    damage: 12,
    effect: "blind",
    cooldown: 5,
    staminaCost: 10,
    castingTime: 1,
    description: "Blinding Light - damages and blinds opponent",
    sound: "lumos"
  },
  {
    name: "Finite Incantatem",
    type: "special",
    effect: "dispel",
    cooldown: 7,
    staminaCost: 15,
    castingTime: 1,
    description: "Counter-spell - removes all active effects",
    sound: "finite"
  }
];

// Fuzzy matching function using Levenshtein distance
export function findSpell(input: string): Spell | null {
  const normalizedInput = input.toLowerCase().trim();
  
  // Direct match first
  const directMatch = SPELLS.find(spell => 
    spell.name.toLowerCase() === normalizedInput
  );
  if (directMatch) return directMatch;

  // Fuzzy matching with Levenshtein distance
  let bestMatch: Spell | null = null;
  let bestDistance = Infinity;
  const maxDistance = 3; // Allow up to 3 character differences

  for (const spell of SPELLS) {
    const distance = levenshteinDistance(normalizedInput, spell.name.toLowerCase());
    if (distance <= maxDistance && distance < bestDistance) {
      bestDistance = distance;
      bestMatch = spell;
    }
  }

  return bestMatch;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}