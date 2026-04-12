import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],

      // use <img> for external SVG charts that don't need Next.js image optimization
      '@next/next/no-img-element': 'off',

      // allow `any` when reading raw i18n data structures
      '@typescript-eslint/no-explicit-any': 'off',

      // not needed with Next.js JSX transform
      'react/react-in-jsx-scope': 'off',
    },
  },
];

export default eslintConfig;
