# 🔎 Solver

> Solver integrates [Solhint](https://github.com/protofire/solhint) (a [Solidity](https://solidity.readthedocs.io) linter) in [Visual Studio Code](https://code.visualstudio.com). 

## 🚀 Usage

Once installed, the extension will be activated every time you will open a Solidity file.

The way it works is very simple:
- **If you opened a single file:** the rules defined in the settings of the extension will be used.
- **If you opened a folder:** the extension is going to look for a `.solhint.json` file in the current workspace and use the rules defined inside this file.

*Note: If you did not defined any rule in the settings of the extension, or if the `solhint.json` file is missing, all the Solhint rules are going to be activated.*

## 🔧 Extension Settings

The following settings are available:

### `solver.delay`

When the current file has been edited, this defines how much time (in millisecond) the extension will wait before triggering a new linting. Exemple:

```json=
  "solver.delay": 500
```

### `solver.warningStyle`

The style applied to the warning messages. Example:

```json=
"solver.warningStyle": {
  "border": "1px solid #f39c12",
  "borderStyle": "dashed"
}
```

### `solver.errorStyle`

The style applied to the error messages. Example:

```json=
"solver.warningStyle": {
  "border": "1px solid #c0392b",
  "borderStyle": "dashed"
}
```

### `solver.config`

This defines all the rules related to Solhint. You can simply copy / paste the content of a `.solhint.json` file in here. Example:

```json=
"solver.config": {
  "extends": "solhint:default",
  "plugins": [],
  "rules": {
    "quotes": "warn",
    "const-name-snakecase": "off",
    "avoid-suicide": "error",
    "avoid-sha3": "warn",
    "avoid-tx-origin:": "warn",
    "not-rely-on-time": "warn",
    "not-rely-on-block-hash": "warn",
    "space-after-comma": "warn",
    "no-spaces-before-semicolon": "warn"
  }
}
```

## 🐛 Known Issues

Here are the known issues, I'll try to fix them as soon as possible:

- When the rules are changed (in the settings or in the `solhint.json` file), the new configuration may not be directly used in the current file
- Plugins are not supported yet
- This extension does not implement Solidity syntax highlighting

