import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { GameState } from '@/hooks/useGameState';
import { Spell } from '@/data/spells';
import { SpellGuide } from '@/components/SpellGuide';

interface GameArenaProps {
  gameState: GameState;
  onCastSpell: (spell: string) => { success: boolean; message: string };
  onEndGame: () => void;
}

export function GameArena({ gameState, onCastSpell, onEndGame }: GameArenaProps) {
  const [spellInput, setSpellInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const currentPlayer = gameState.players[gameState.currentPlayer];
  const opponent = gameState.players[1 - gameState.currentPlayer];
  const isPlayerTurn = currentPlayer && !currentPlayer.isAI;

  const handleSpellCast = async () => {
    if (!spellInput.trim()) return;

    setIsAnimating(true);
    const result = onCastSpell(spellInput.trim());
    
    toast({
      title: result.success ? "Spell Cast!" : "Spell Failed!",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    setSpellInput('');
    
    // Animation duration
    setTimeout(() => setIsAnimating(false), 800);
  };

  const getStatusEffectDisplay = (player: typeof currentPlayer) => {
    if (!player) return null;
    
    const effects = Array.from(player.statusEffects.entries());
    if (effects.length === 0) return null;

    return (
      <div className="flex gap-1 mt-2">
        {effects.map(([effect, duration]) => (
          <Badge key={effect} variant="outline" className="text-xs">
            {effect} ({duration})
          </Badge>
        ))}
      </div>
    );
  };

  const getCooldownDisplay = (player: typeof currentPlayer) => {
    if (!player) return null;
    
    const cooldowns = Array.from(player.cooldowns.entries());
    if (cooldowns.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-1 mt-2">
        {cooldowns.map(([spell, cooldown]) => (
          <Badge key={spell} variant="secondary" className="text-xs">
            {spell}: {cooldown}s
          </Badge>
        ))}
      </div>
    );
  };

  if (gameState.phase === 'ended') {
    const winner = gameState.players.find(p => p.hp > 0);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="parchment max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="font-magical text-3xl text-gradient-gold">
              {winner?.isAI ? "Dark Arts Triumph!" : "Victory Achieved!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xl font-cinzel">
              {winner?.name} emerges victorious!
            </div>
            <div className="text-muted-foreground">
              Final HP: {winner?.hp}/{winner?.maxHp}
            </div>
            <Button 
              className="magic-button w-full font-cinzel"
              onClick={onEndGame}
            >
              Return to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Arena Header */}
      <div className="text-center">
        <h1 className="text-4xl font-magical text-gradient-gold">
          ⚡ Duel in Progress ⚡
        </h1>
        <p className="text-lg font-cinzel text-muted-foreground mt-2">
          {isPlayerTurn ? "Your turn to cast a spell" : `${currentPlayer?.name}'s turn`}
        </p>
      </div>

      {/* Player Stats */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Player 1 */}
        <Card className={`parchment ${gameState.currentPlayer === 0 ? 'spell-glow' : ''} ${isAnimating && gameState.currentPlayer === 0 ? 'animate-spell-cast' : ''}`}>
          <CardHeader>
            <CardTitle className="font-magical text-xl text-center">
              {gameState.players[0]?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between font-cinzel">
                <span>Health</span>
                <span>{gameState.players[0]?.hp}/{gameState.players[0]?.maxHp}</span>
              </div>
              <Progress 
                value={(gameState.players[0]?.hp / gameState.players[0]?.maxHp) * 100} 
                className="health-bar h-3"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between font-cinzel">
                <span>Stamina</span>
                <span>{gameState.players[0]?.stamina}/{gameState.players[0]?.maxStamina}</span>
              </div>
              <Progress 
                value={(gameState.players[0]?.stamina / gameState.players[0]?.maxStamina) * 100} 
                className="stamina-bar h-3"
              />
            </div>
            {getStatusEffectDisplay(gameState.players[0])}
            {getCooldownDisplay(gameState.players[0])}
          </CardContent>
        </Card>

        {/* Player 2/AI */}
        <Card className={`parchment ${gameState.currentPlayer === 1 ? 'spell-glow' : ''} ${isAnimating && gameState.currentPlayer === 1 ? 'animate-spell-cast' : ''}`}>
          <CardHeader>
            <CardTitle className="font-magical text-xl text-center">
              {gameState.players[1]?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between font-cinzel">
                <span>Health</span>
                <span>{gameState.players[1]?.hp}/{gameState.players[1]?.maxHp}</span>
              </div>
              <Progress 
                value={(gameState.players[1]?.hp / gameState.players[1]?.maxHp) * 100} 
                className="health-bar h-3"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between font-cinzel">
                <span>Stamina</span>
                <span>{gameState.players[1]?.stamina}/{gameState.players[1]?.maxStamina}</span>
              </div>
              <Progress 
                value={(gameState.players[1]?.stamina / gameState.players[1]?.maxStamina) * 100} 
                className="stamina-bar h-3"
              />
            </div>
            {getStatusEffectDisplay(gameState.players[1])}
            {getCooldownDisplay(gameState.players[1])}
          </CardContent>
        </Card>
      </div>

      {/* Last Spell Cast */}
      {gameState.lastSpell && (
        <Card className="parchment max-w-md mx-auto">
          <CardContent className="text-center py-4">
            <div className="font-magical text-lg text-gradient-magic">
              ✨ {gameState.lastSpell.caster} cast {gameState.lastSpell.spell.name}!
            </div>
            <div className="text-sm text-muted-foreground font-cinzel mt-1">
              {gameState.lastSpell.spell.description}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spell Input */}
      {isPlayerTurn && (
        <Card className="parchment max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-magical text-xl text-center">
              📜 Cast Your Spell
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={spellInput}
                onChange={(e) => setSpellInput(e.target.value)}
                placeholder="Type your spell (e.g., Expelliarmus, Stupefy...)"
                className="font-cinzel text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSpellCast()}
                disabled={isAnimating}
              />
              <Button 
                className="magic-button font-cinzel px-8"
                onClick={handleSpellCast}
                disabled={!spellInput.trim() || isAnimating}
              >
                {isAnimating ? '⏳' : '🪄'} Cast
              </Button>
            </div>
            <div className="text-sm text-muted-foreground font-cinzel text-center">
              Don't worry about exact spelling - magic is forgiving! ✨
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Turn Indicator */}
      {!isPlayerTurn && gameState.phase === 'playing' && (
        <Card className="parchment max-w-md mx-auto">
          <CardContent className="text-center py-6">
            <div className="font-magical text-xl text-gradient-magic floating-spark">
              🧙‍♂️ {currentPlayer?.name} is casting...
            </div>
            <div className="text-sm text-muted-foreground font-cinzel mt-2">
              The dark arts are being channeled...
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Controls */}
      <div className="text-center">
        <Button 
          variant="outline" 
          className="font-cinzel"
          onClick={onEndGame}
        >
          🏃‍♂️ Retreat from Duel
        </Button>
      </div>

      {/* Spell Guide */}
      <SpellGuide />
    </div>
  );
}