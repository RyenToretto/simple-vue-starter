module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true,
    "mocha": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential"
  ],
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
  },
  "rules": {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "indent": ["warn", 2],
    "linebreak-style": ["warn", "unix"],
    "quotes": ["warn", "single"],
    "semi": ["warn", "always"],
    "no-unused-vars": ["warn"],
  },
};
