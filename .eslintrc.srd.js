// SRD-Focused ESLint Configuration
// Simple, Reliable, DRY Development

module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'unused-imports'
  ],
  rules: {
    // SIMPLE: Reduce complexity and improve readability
    'complexity': ['error', 10],                    // Max cyclomatic complexity
    'max-lines-per-function': ['error', 50],        // Max lines per function
    'max-params': ['error', 4],                     // Max function parameters
    'max-depth': ['error', 4],                      // Max nesting depth
    'max-lines': ['error', 300],                    // Max lines per file
    'max-statements': ['error', 20],                // Max statements per function

    // RELIABLE: Prevent errors and ensure consistency
    'no-console': 'warn',                           // Warn on console usage
    'no-debugger': 'error',                         // Error on debugger
    'no-unused-vars': 'error',                      // Error on unused variables
    'unused-imports/no-unused-imports': 'error',    // Remove unused imports
    'unused-imports/no-unused-vars': 'error',       // Error on unused vars
    'no-var': 'error',                              // Use const/let instead of var
    'prefer-const': 'error',                        // Prefer const over let
    'no-implicit-coercion': 'error',                // Prevent type coercion
    'no-implicit-globals': 'error',                 // Prevent global variables

    // DRY: Prevent duplication and improve maintainability
    'no-duplicate-imports': 'error',                // No duplicate imports
    'simple-import-sort/imports': 'error',          // Sort imports
    'simple-import-sort/exports': 'error',          // Sort exports
    'no-duplicate-case': 'error',                   // No duplicate case labels
    'no-duplicate-keys': 'error',                   // No duplicate object keys

    // Code clarity and consistency
    'prefer-arrow-callback': 'error',               // Prefer arrow functions
    'arrow-spacing': 'error',                       // Consistent arrow spacing
    'object-shorthand': 'error',                    // Use object shorthand
    'prefer-template': 'error',                     // Prefer template literals
    'template-curly-spacing': 'error',              // Consistent template spacing

    // TypeScript specific rules for reliability
    '@typescript-eslint/no-explicit-any': 'warn',   // Warn on any type
    '@typescript-eslint/no-unused-vars': 'error',   // Error on unused vars
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn'
  },
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  }
};


