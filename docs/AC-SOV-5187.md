# Extra corner cases & invariant tests (foundry)  

## Description  

Add fuzz tests and invariants tests for:  

- lending: add/remove liquidity  

- borrowing and margin trading: open/close/liquidate/rollover  

- staking/unstaking  

- AMM: deposit, withdraw, swap  

## Accents  

- parameters that can be potentially manipulated with focus on rollovers and liquidations as well as interest rates.  

- consider large amounts of deposits because flash loans can be used.  

- build a map of dependencies - focus on dynamic parameters and external calls.  

## File Architecture  

It is fine to keep tests in the respective repositories. but note these tests aren't supposed to be regular unit tests because they will run longer, so they should be isolated from unit tests, otherwise CI will fail and running it locally will take ages.  

### Suggested Architecture  

```log
AMM/
├─ security/
│  ├─ foundry/                 # isolated Foundry project
│  │  ├─ foundry.toml
│  │  ├─ tests/
│  │  │  ├─ invariant/         # invariants (Forge)
│  │  │  └─ helpers/
│  │  └─ Makefile
│  ├─ echidna/                 # isolated Echidna harnesses
│  │  ├─ echidna.yaml
│  │  └─ <Contract>Harness.t.sol
│  ├─ reports/                 # outputs, seeds, counter-examples
│  └─ README.md
└─ .github/
   └─ workflows/
      ├─ security.yml          # CI for security/*
      └─ (existing workflows)
```