module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  overrides: [
    {
      /* Turns off typescript rules for js files. ie webpack.config.js and node scripts */
      files: ['*.js'],
      parser: 'espree',
      extends: [
        'standard'
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-empty-function': 0
      },
    }
  ],
  plugins: [
    'react',
    'jest',
    '@typescript-eslint'
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    '@typescript-eslint/member-delimiter-style': 0
  }
}
