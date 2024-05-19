export const portraitSources: string[] = [];
for (let i = 0; i <= 12; i++) {
  import(`../assets/ui/ruler_portraits/portrait_${i}.png`).then((result) => {
    portraitSources.push(result.default);
  });
}

export const getSeededPortraitForName = (name: string): string => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 6) - hash + char;
    hash = hash & hash;
  }

  const index = Math.abs(hash) % portraitSources.length;

  return portraitSources[index];
};
