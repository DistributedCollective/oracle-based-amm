#!/usr/bin/env node

/**
 * Simple helper to print the EIP-55 checksum version of an address.
 *
 * Usage:
 *   node checksum_address.js 0xdeadbeef...
 */

const Web3 = require('web3');

const [, , input] = process.argv;

if (!input) {
  console.error('Usage: node checksum_address.js <address>');
  process.exit(1);
}

try {
  const normalized = input.startsWith('0x') ? input : `0x${input}`;
  const checksummed = Web3.utils.toChecksumAddress(normalized);
  console.log(checksummed);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
