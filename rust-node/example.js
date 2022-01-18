#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mylib = require('.');

console.log('mylib', mylib);
console.log('A:', mylib.hello());
console.log('B:', mylib.get_by_id(123));
console.log('C:', mylib.get_num_cpus());
console.log('D:', mylib.hash('FOOBAR'));
console.log('D1:', mylib.hash('FOOBAR', 'spooky'));
console.log('D2:', mylib.hash('FOOBAR', 'metro'));
