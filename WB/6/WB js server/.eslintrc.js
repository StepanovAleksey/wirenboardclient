module.exports = {
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/ban-types': 'warn',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn',
    },
};
