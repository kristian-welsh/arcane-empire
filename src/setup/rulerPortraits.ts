import portrait_0 from '../assets/ui/ruler_portraits/portrait_0.png';
import portrait_1 from '../assets/ui/ruler_portraits/portrait_1.png';
import portrait_2 from '../assets/ui/ruler_portraits/portrait_2.png';
import portrait_3 from '../assets/ui/ruler_portraits/portrait_3.png';
import portrait_4 from '../assets/ui/ruler_portraits/portrait_4.png';
import portrait_5 from '../assets/ui/ruler_portraits/portrait_5.png';
import portrait_6 from '../assets/ui/ruler_portraits/portrait_6.png';
import portrait_7 from '../assets/ui/ruler_portraits/portrait_7.png';
import portrait_8 from '../assets/ui/ruler_portraits/portrait_8.png';
import portrait_9 from '../assets/ui/ruler_portraits/portrait_9.png';
import portrait_10 from '../assets/ui/ruler_portraits/portrait_10.png';
import portrait_11 from '../assets/ui/ruler_portraits/portrait_11.png';
import portrait_12 from '../assets/ui/ruler_portraits/portrait_12.png';

export const portraitSources: string[] = [
  portrait_0,
  portrait_1,
  portrait_2,
  portrait_3,
  portrait_4,
  portrait_5,
  portrait_6,
  portrait_7,
  portrait_8,
  portrait_9,
  portrait_10,
  portrait_11,
  portrait_12,
];

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
