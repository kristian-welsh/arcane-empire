import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '576px',
      md: '780px',
      lg: '780px',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
} satisfies Config;
