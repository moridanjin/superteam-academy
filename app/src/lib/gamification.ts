/** XP required to reach a given level: 100 * level * (level + 1) / 2 */
export function xpForLevel(level: number): number {
  return 100 * level * ((level + 1) / 2);
}

export function levelFromXp(totalXp: number): number {
  let level = 0;
  while (xpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

export function xpProgressInLevel(
  totalXp: number,
  level: number
): { current: number; required: number; pct: number } {
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const required = nextLevelXp - currentLevelXp;
  const current = totalXp - currentLevelXp;
  const pct = required > 0 ? Math.round((current / required) * 100) : 100;
  return { current, required, pct };
}
