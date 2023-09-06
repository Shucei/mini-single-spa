module.exports = {
    parserOptions: {
        ecmaVersion: 2020, // 2020的语法
    },
    env: {
        es6: true, // 启用除了modules以外的所有es6特性
        browser: true, // 浏览器环境
    },
    parser: '@typescript-eslint/parser', // 解析器
    extends: 'airbnb-base', // 继承airbnb规则 
    plugins: [
        '@typescript-eslint', // 使用@typescript-eslint/eslint-plugin插件
    ],
    rules: {
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产环境禁止使用debugger
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 生产环境禁止使用console
        'array-element-newline': ['error', 'consistent'], // 数组元素换行
        indent: ['error', 4, { MemberExpression: 0, SwitchCase: 1 }],
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        'comma-dangle': ['error', 'always-multiline'],
        semi: ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'max-len': ['error', 140],
        'no-new': 'off',
        'linebreak-style': 'off',
        'import/extensions': 'off',
        'eol-last': 'off',
        'no-shadow': 'off',
        'no-unused-vars': 'warn',
        'import/no-cycle': 'off',
        'arrow-parens': 'off',
        eqeqeq: 'off',
        'no-param-reassign': 'off',
        'import/prefer-default-export': 'off',
        'no-use-before-define': 'off',
        'no-continue': 'off',
        'prefer-destructuring': 'off',
        'no-plusplus': 'off',
        'prefer-const': 'off',
        'global-require': 'off',
        'no-prototype-builtins': 'off',
        'consistent-return': 'off',
        'vue/require-component-is': 'off',
        'prefer-template': 'off',
        'one-var-declaration-per-line': 'off',
        'one-var': 'off',
        'import/named': 'off',
        'object-curly-newline': 'off',
        'default-case': 'off',
        'import/order': 'off',
        'no-trailing-spaces': 'off',
        'func-names': 'off',
        radix: 'off',
        'no-unused-expressions': 'off',
        'no-underscore-dangle': 'off',
        'no-bitwise': 'off',
        'import/no-dynamic-require': 'off',
        'import/no-unresolved': 'off',
        'import/no-self-import': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-useless-path-segments': 'off',
        'import/newline-after-import': 'off',
        'no-path-concat': 'off',
        'no-useless-catch': 'off',
        'no-restricted-syntax': 'off',
    },
}