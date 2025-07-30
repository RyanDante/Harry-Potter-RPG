import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameMode, Difficulty } from '@/hooks/useGameState';

interface GameMenuProps {
  onStartGame: (mode: GameMode, difficulty: Difficulty) => void;
  achievements: { name: string; title?: string; unlocked: boolean }[];
}

export function GameMenu({ onStartGame, achievements }: GameMenuProps) {
  const unlockedTitles = achievements
    .filter(a => a.unlocked && a.title)
    .map(a => a.title);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-magical text-gradient-gold drop-shadow-lg">
            Wizarding Duels
          </h1>
          <p className="text-xl text-muted-foreground font-cinzel">
            Enter the arena and prove your magical prowess
          </p>
        </div>

        {/* Player Titles */}
        {unlockedTitles.length > 0 && (
          <Card className="parchment">
            <CardHeader className="text-center">
              <CardTitle className="font-magical text-2xl">Your Titles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {unlockedTitles.map((title, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="font-cinzel text-sm px-3 py-1"
                  >
                    {title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Mode Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Mode */}
          <Card className="parchment hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <CardTitle className="font-magical text-2xl text-gradient-magic">
                🧙‍♂️ Duel the Dark Arts
              </CardTitle>
              <CardDescription className="font-cinzel">
                Face an AI opponent with escalating difficulty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  className="magic-button w-full font-cinzel"
                  onClick={() => onStartGame('ai', 'easy')}
                >
                  🌟 Apprentice (Easy)
                </Button>
                <Button 
                  className="magic-button w-full font-cinzel"
                  onClick={() => onStartGame('ai', 'normal')}
                >
                  ⚡ Adept (Normal)
                </Button>
                <Button 
                  className="magic-button w-full font-cinzel"
                  onClick={() => onStartGame('ai', 'hard')}
                >
                  🔥 Master (Hard)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PvP Mode */}
          <Card className="parchment hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <CardTitle className="font-magical text-2xl text-gradient-gold">
                ⚔️ Wizard's Duel
              </CardTitle>
              <CardDescription className="font-cinzel">
                Challenge a friend in local multiplayer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="magic-button w-full h-32 font-cinzel text-lg"
                onClick={() => onStartGame('pvp', 'normal')}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🤝</div>
                  <div>Local Duel</div>
                  <div className="text-sm opacity-80">Two wizards, one device</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Summary */}
        <Card className="parchment">
          <CardHeader className="text-center">
            <CardTitle className="font-magical text-xl">Magical Accomplishments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-lg font-cinzel">
                {achievements.filter(a => a.unlocked).length} / {achievements.length} Achievements Unlocked
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="parchment">
          <CardHeader>
            <CardTitle className="font-magical text-xl text-center">How to Cast Spells</CardTitle>
          </CardHeader>
          <CardContent className="font-cinzel space-y-2">
            <p>• Type spell names in the magical grimoire (e.g., "Expelliarmus", "Stupefy")</p>
            <p>• Each spell has stamina cost and cooldown - choose wisely!</p>
            <p>• Watch your opponent's health and your own stamina</p>
            <p>• Unlock achievements and earn prestigious wizarding titles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}