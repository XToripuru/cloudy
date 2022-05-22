module.exports = {
    'parser': '@babel/eslint-parser',
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
        'node': true,
        'jest': true,
    },
    'extends': ['eslint:recommended', 'plugin:react/recommended'],
    'parserOptions': {
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true,
            'jsx': true
        },
        'sourceType': 'module'
    },
    'plugins': ['react'],
    'rules': {
        'react/prop-types': ['off'],
        'semi': ['error', 'always'],
        'no-console': ['warn', { 'allow': ['info', 'error'] }]
    },
    "eslint.workingDirectories": [
        {"mode": "auto"}
    ],
};