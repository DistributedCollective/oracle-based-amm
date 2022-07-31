const fs = require('fs');
const prettier = require("prettier");

// 1. extract the contents of addSOV.json in a local variable
var localV = require('../solidity/utils/addSOV.json');
// 2. extract the contents of config_rsk.json in another local variable
var anotherV = require('../solidity/utils/config_rsk.json');
// 3. store the WRBTC address on the localV.reserves.address spot
localV.reserves[0].address = anotherV.RBTC.addr;
// 4. stringify localV
localV = prettier.format(JSON.stringify(localV),{ semi: false, parser: "json" });
// 5. create a random new file with the new content of localV
fs.writeFileSync('./solidity/utils/random.json',localV);
// 6. move that file to addSOV.json
fs.rename('./solidity/utils/random.json', './solidity/utils/addSOV.json', function (err) {
    if (err) throw err;
    console.log('\n addSOV.json' + ' Successfully updated');
  });