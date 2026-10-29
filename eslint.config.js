const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  prettierRecommended,
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: { Buffer: 'readonly', __dirname: 'readonly', process: 'readonly' },
    },
  },
  {
    ignores: ['dist/*', 'web-build/*', '.expo/*', '.claude/*', 'coverage/*'],
  },
]);
