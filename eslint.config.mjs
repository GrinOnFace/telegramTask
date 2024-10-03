import globals from 'globals';
import js from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            import: eslintPluginImport,
        },
        rules: {
            'indent': ['error', 4],
            'no-mixed-spaces-and-tabs': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'no-trailing-spaces': 'error',
            'eol-last': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'space-infix-ops': 'error',
            'keyword-spacing': ['error', { before: true, after: true }],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'space-before-function-paren': ['error', 'never'],
            'space-before-blocks': 'error',
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.mjs'],
                },
            },
        },
        ignores: [
            'node_modules/**',
        ],
    },
];
