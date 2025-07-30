import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SPELLS } from '@/data/spells';

export function SpellGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const spellsByType = SPELLS.reduce((acc, spell) => {
    if (!acc[spell.type]) acc[spell.type] = [];
    acc[spell.type].push(spell);
    return acc;
  }, {} as Record<string, typeof SPELLS>);

  const typeColors = {
    attack: 'destructive',
    defense: 'secondary',
    healing: 'default',
    buff: 'outline',
    debuff: 'secondary',
    special: 'default'
  } as const;

  const typeIcons = {
    attack: '⚔️',
    defense: '🛡️',
    healing: '💚',
    buff: '✨',
    debuff: '🔮',
    special: '🌟'
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="magic-button font-cinzel"
          >
            📖 Spell Guide {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card className="parchment max-w-md max-h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle className="font-magical text-lg">Magical Grimoire</CardTitle>
              <CardDescription>Reference for all available spells</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(spellsByType).map(([type, spells]) => (
                <div key={type} className="space-y-2">
                  <h3 className="font-cinzel font-semibold text-sm flex items-center gap-2">
                    {typeIcons[type as keyof typeof typeIcons]} 
                    {type.charAt(0).toUpperCase() + type.slice(1)} Spells
                  </h3>
                  <div className="space-y-1">
                    {spells.map((spell) => (
                      <div key={spell.name} className="text-xs space-y-1 p-2 rounded border border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="font-cinzel font-medium">{spell.name}</span>
                          <Badge 
                            variant={typeColors[spell.type as keyof typeof typeColors]}
                            className="text-xs"
                          >
                            {spell.staminaCost} ⚡
                          </Badge>
                        </div>
                        <div className="text-muted-foreground">
                          {spell.description}
                        </div>
                        <div className="flex gap-2 text-xs">
                          {spell.damage && <span>⚔️ {spell.damage} dmg</span>}
                          {spell.healing && <span>💚 {spell.healing} heal</span>}
                          {spell.blockAmount && <span>🛡️ {spell.blockAmount} block</span>}
                          <span>⏱️ {spell.cooldown}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}