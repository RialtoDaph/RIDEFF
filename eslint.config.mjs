import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/**', 'node_modules/**', 'rideff_handoff/**', 'next-env.d.ts'] },
  {
    // 1:1 ports of the handoff prototypes (scripts/dc-port): keep the original logic
    // untouched rather than restyling it; type checking is off in these files.
    files: ['src/components/dc/**'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@next/next/no-img-element': 'off',
      'prefer-const': 'off',
    },
  },
];

export default config;
