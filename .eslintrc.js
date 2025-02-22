module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "comma-dangle": ["error", "only-multiline"],
      "no-underscore-dangle": ["error", { "allow": ["_id", "_doc"] }],
      "no-param-reassign": ["error", { "props": false }]
    },
    "env": {
      "jest": true
    }
};
