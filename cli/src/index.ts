#!/usr/bin/env node
import { runCli } from './cli';

runCli(process.argv.slice(2)).then((code) => {
  if (code !== 0) {
    process.exitCode = code;
  }
});
