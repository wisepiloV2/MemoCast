import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    // 👇 AQUÍ SE AGREGAN LAS REGLAS DE FORMATEO 👇
    rules: {
      // 1. Estética y Formateo (Acomodan el código)
      'quotes': ['error', 'single'],           // Fuerza el uso de comillas simples ('')
      'semi': ['error', 'always'],             // Fuerza el uso de punto y coma al final (;)
      'indent': ['error', 2],                  // Fuerza la indentación a 2 espacios
      'no-multiple-empty-lines': ['error', { max: 1 }], // Evita múltiples saltos de línea vacíos
      'comma-dangle': ['error', 'always-multiline'], // Fuerza la coma final en objetos/arrays multilínea
      'eol-last': ['error', 'always'],         // Obliga a que el archivo termine con una línea en blanco
      
      // 2. Buenas prácticas de React / TypeScript
      '@typescript-eslint/no-unused-vars': 'warn', // Te avisa si declaras una variable y no la usas
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
])