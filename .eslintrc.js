module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
    'airbnb-typescript/base',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    'import/prefer-default-export': 'off',
    "no-unused-expressions": 0,
    // "no-shadow": [2, {"hoist": "never"}],
    "new-cap": [2, {"capIsNewExceptions": ["Router"]}],
    "no-param-reassign": 0,
    "strict": [0, "global"],
    "max-len": [1, 300, 2],
    "import/no-unresolved": 0,
    "import/newline-after-import": 0,
    "import/extensions": 0,
    "import/first": 0,
    "camelcase": 0,
    "no-confusing-arrow": 0,
    "arrow-parens": 0,
    "no-underscore-dangle": 0,
    "arrow-body-style": 0,
    "no-console": ["error", { "allow": ["warn", "error", "info"] }],
    "global-require": 0,
    "@typescript-eslint/camelcase": 0,
    "prefer-arrow-callback": 0,
    "no-nested-ternary": 0,
    'new-cap': 0,
    'lines-between-class-members': 0,
    'class-methods-use-this': 0,
    'max-classes-per-file': 0,
    '@typescript-eslint/indent': 0,
    'object-curly-newline': 0,
    'prefer-destructuring': 0,
    'no-extra-boolean-cast': 0
  },
};
