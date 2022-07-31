const fs = require('fs');
const path = require('path');

const BUILD_DIR_SOLIDITY = path.resolve(__dirname, '../solidity/build');
const CONTRACTS_DIR_SOLIDITY = path.join(BUILD_DIR_SOLIDITY, 'contracts');
const BUILD_DIR_RBTCWPROX = path.resolve(__dirname, '../rbtcwrapperproxy/build');
const CONTRACTS_DIR_RBTCWPROX = path.join(BUILD_DIR_RBTCWPROX, 'contracts');
const JSON_EXT = '.json';
const ABI_EXT = '.abi';
const BIN_EXT = '.bin';

const fileListAMM = fs.readdirSync(CONTRACTS_DIR_SOLIDITY);
const fileListWPROX = fs.readdirSync(CONTRACTS_DIR_RBTCWPROX);

fileListAMM.forEach((filename) => {
    if (filename.endsWith(JSON_EXT)) {
        const basename = path.basename(filename, JSON_EXT);
        const data = fs.readFileSync(path.join(CONTRACTS_DIR_SOLIDITY, filename));
        const jsonData = JSON.parse(data);
        const { abi, bytecode } = jsonData;
        if (abi) {
            fs.writeFileSync(path.format({
                dir: BUILD_DIR_SOLIDITY, name: basename, ext: ABI_EXT
            }), JSON.stringify(abi));
        }

        if (bytecode) {
            fs.writeFileSync(path.format({
                dir: BUILD_DIR_SOLIDITY, name: basename, ext: BIN_EXT
            }), bytecode.substring(2));
        }
    }
});

fileListWPROX.forEach((filename) => {
    if (filename.endsWith(JSON_EXT)) {
        const basename = path.basename(filename, JSON_EXT);
        const data = fs.readFileSync(path.join(CONTRACTS_DIR_RBTCWPROX, filename));
        const jsonData = JSON.parse(data);
        const { abi, bytecode } = jsonData;
        if (abi) {
            fs.writeFileSync(path.format({
                dir: BUILD_DIR_RBTCWPROX, name: basename, ext: ABI_EXT
            }), JSON.stringify(abi));
        }

        if (bytecode) {
            fs.writeFileSync(path.format({
                dir: BUILD_DIR_RBTCWPROX, name: basename, ext: BIN_EXT
            }), bytecode.substring(2));
        }
    }
});

const oldABI = './rbtcwrapperproxy/build/WRBTC.abi';
const newABI = './solidity/build/WRBTC.abi';
const oldBIN = './rbtcwrapperproxy/build/WRBTC.bin';
const newBIN = './solidity/build/WRBTC.bin';

fs.rename(oldABI, newABI, function (err) {
    if (err) throw err;
    console.log('WRBTC.abi Successfully moved');
    fs.unlink(oldABI, function () {    
        console.log('\n write operation on WRBTC.abi completed.');
        fs.copyFileSync(newABI, oldABI, fs.constants.COPYFILE_EXCL);    
    });
  });

fs.rename(oldBIN, newBIN, function (err) {
    if (err) throw err;
    console.log('WRBTC.bin Successfully moved');
    fs.unlink(oldBIN, function () {    
        console.log('\n write operation on WRBTC.bin completed.');
        fs.copyFileSync(newBIN, oldBIN, fs.constants.COPYFILE_EXCL);    
    });
  });