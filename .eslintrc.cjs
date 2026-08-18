module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist/', 'node_modules/', 'build/', '.git', 'backup_screens/'],
  rules: {
    // Add any custom rules here
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};