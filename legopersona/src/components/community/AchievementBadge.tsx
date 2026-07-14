import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  legoImage: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  isLikedByUser: boolean;
  tags: PostTags;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  createdAt: Date;
}

export interface PostTags {
  hairColor: HairColor;
  hasGlasses: boolean;
  hasBeard: boolean;
  beardColor?: BeardColor;
  skinTone: SkinTone;
}

export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white' | 'none';
export type BeardColor = 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white';
export type SkinTone = 'light' | 'medium' | 'dark';

export type SortOption = 'newest' | 'popularity' | 'most-discussed';

export interface FilterState {
  hairColors: HairColor[];
  hasGlasses: boolean | null;
  hasBeard: boolean | null;
  beardColors: BeardColor[];
  skinTones: SkinTone[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  requirement?: string;
  isUnlocked: boolean;
  unlockedAt?: Date | string | null;
  progress?: number;
  target?: number;
  total?: number;
}


interface AchievementBadgeProps {
  achievement: Achievement;
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  'brick-starter': '🧱',
  'master-builder': '🏗️',
  'crowd-favorite': '⭐',
  'community-leader': '💬',
  'social-butterfly': '🦋',
  trendsetter: '🔥',
};

const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  const total = achievement.target ?? achievement.total;
  const badgeIcon = achievement.icon ?? ACHIEVEMENT_ICONS[achievement.id] ?? '🏅';
  const progressPercent = total
    ? Math.min((achievement.progress || 0) / total * 100, 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-2xl border-2 transition-all h-full min-h-[180px]${
        achievement.isUnlocked
          ? 'bg-gradient-to-br from-secondary/30 to-secondary/10 border-secondary shadow-card'
          : 'bg-muted/50 border-border opacity-75'
      }`}
    >
      {/* Badge Icon */}
      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
            achievement.isUnlocked
              ? 'bg-secondary shadow-lego'
              : 'bg-muted-foreground/20'
          }`}
        >
          {achievement.isUnlocked ? (
            badgeIcon
          ) : (
            <Lock className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1">
          <h4 className={`font-display font-bold ${achievement.isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
            {achievement.name}
          </h4>
          <p className={`text-sm mt-0.5 ${achievement.isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
            {achievement.description}
          </p>

          {/* Progress bar for locked achievements */}
          {!achievement.isUnlocked && total && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{achievement.progress || 0} / {total}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          )}

          {/* Unlocked date */}
          {achievement.isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-primary mt-2 font-medium">
              ✓ Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Shine effect for unlocked badges */}
      {achievement.isUnlocked && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent transform rotate-12" />
        </div>
      )}
    </motion.div>
  );
};

export default AchievementBadge;
