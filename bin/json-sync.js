#!/usr/bin/env node

const { syncJson } = require('../index');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const argv = yargs
  .usage('Usage: json-sync <source> <target> [options]')
  .demandCommand(2)
  .option('fields', {
    alias: 'f',
    array: true,
    describe: 'List of fields to sync',
    demandOption: true,
  })
  .option('overwrite', {
    alias: 'o',
    type: 'boolean',
    default: true,
    describe: 'Allow overwriting existing fields in the target',
  })
  .help('h')
  .alias('h', 'help').argv;

const [sourcePath, targetPath] = argv._;
const fields = argv.fields;
const options = {
  overwrite: argv.overwrite,
  log: true,
};

syncJson(sourcePath, targetPath, fields, options);
