# json-sync

## Description

The `json-sync` tool is a Node.js utility that allows you to synchronize specific fields between two JSON files. This tool was born out of a personal need, I had never worked with Nodejs so it is a bit experimental, it may have bad practices or things that can be improved. If someone wants to contribute, welcome.

## Installation

```sh
npm install json-sync
```

## Usage

### Import the Tool

```javascript
const { syncJson } = require('json-sync');
```

### `syncJson` Function

The `syncJson` function takes the following parameters:

- `sourcePath` (string): Path to the source JSON file.
- `targetPath` (string): Path to the target JSON file.
- `fields` (array): List of fields to be synchronized.
- `options` (object, optional): Additional options for synchronization.

### Options

- `transform` (function): Transformation function applied to each field before synchronizing.
- `log` (boolean): Enable or disable operation logs. Enabled by default.
- `overwrite` (boolean): Allow or disallow overwriting existing fields in the target. Enabled by default.

### Example Usage

```javascript
const { syncJson } = require('json-sync');

const sourcePath = 'path/to/source.json';
const targetPath = 'path/to/target.json';
const fields = ['name', 'version', 'description'];

const options = {
  transform: (key, value) => value.toUpperCase(),
  log: true,
  overwrite: true,
};

syncJson(sourcePath, targetPath, fields, options);
```

### Command Line Usage

```sh
npm install -g json-sync
```

```sh
json-sync source.json target.json --fields name version description
```

### Adding to `scripts` in `package.json`

```json
{
  "scripts": {
    "sync-json": "json-sync source.json target.json --fields name version description"
  }
}
```

```sh
npm run sync-json
```

## Tests

```sh
npm test
```

## License

This tool is licensed under the [MIT License](LICENSE).
