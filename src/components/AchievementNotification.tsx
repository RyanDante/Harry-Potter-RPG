import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/data/achievements';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <Card className="parchment max-w-sm">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div className="font-magical text-lg text-gradient-gold">
              Achievement Unlocked!
            </div>
          </div>
          <div className="font-cinzel font-bold text-primary">
            {achievement.name}
          </div>
          <div className="text-sm text-muted-foreground font-cinzel">
            {achievement.description}
          </div>
          {achievement.title && (
            <Badge variant="secondary" className="font-cinzel">
              New Title: {achievement.title}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}