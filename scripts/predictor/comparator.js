const { ethers } = require("ethers");
const fs = require('fs');
const revision = require('child_process');
var commHash = revision.execSync('git rev-parse HEAD');
commHash = commHash.toString().substring(0,commHash.length-1);
var origin = revision.execSync('git config --get remote.origin.url');
origin = origin.toString().substring(0,origin.length-1);
var branch = revision.execSync('git branch');
branch = branch.toString().substring(0,branch.length-1).slice(2);

const FIX_ID = 32 * 2;

console.log('------------------comparator script-----------------------', '\n');

const configContract = './contract_config.json';

// this is the main function; it takes the config JSON to guide the runs
// this config is still in the form of the path of a file
async function iterator(CfgC) {

    // we take the JSON object, from the path og the file
    // it is assumed that CfgC exists
    var F = require(CfgC);
    // we measure the length of the JSON object
    var L = Object.keys(F).length;

    // we start a stream of data to feed the report file
    var STR = initializeReport('./report');

    // the headers for both the report and the console
    STR.write('Prediction Report: Let us know if the code in this repo will produce smart contracts that will verify in a block explorer' + "\n");
    STR.write('Repository to be analysed: ' + '\n' + 'URL: ' + origin + '\n' + 'Branch: ' + branch + '\n' + 'Commit ' + commHash + '\n');
    console.log('Prediction Report: Let us know if the code in this repo will produce smart contracts that will verify in a block explorer', '\n');
    console.log('Repository to be analysed: ', '\n', 'URL: ', origin, '\n', 'Branch: ', branch, '\n', 'Commit ', commHash, '\n');
    
    // the loop to cycle through all the lists of contracts for all the networks described in CfgC
    for (let i = 0; i< L; ++i) {

        let ki = Object.keys(F)[i]; // this is the network id
        STR.write('contracts dpeloyed in the network id: ' + ki + '\n');
        console.log('contracts dpeloyed in the network id: ', ki, '\n');
        let vi = F[ki][2];          // this is the path to the JSON file with the list of contracts for that network id
        let Provi = F[ki][1];        // this is Sovryn's provider endpoint for that network id
        let pi = new ethers.providers.JsonRpcProvider(Provi); // ethers provider

        // we assume that the string vi is rightfully written
        if(fs.existsSync(vi)) {

            let C = require(vi);        // this is the JSON object with the data of contracts
            let Lc = Object.keys(C).length; // this is how many contract are listed in that JSON
            STR.write('checking ' + Lc + ' contracts.' + '\n');
            console.log('checking ', Lc, ' contracts.', '\n');
            
            // the loop to cycle through all the contracts of a network's list
            for (let j = 0; j < Lc ; ++j) {

                kj = Object.keys(C)[j]; // this is the name of the contract
                STR.write('checking element N°: ' + (j + 1) + ' from ' + Lc + ', the contract: ' +  kj + '\n');
                console.log('checking element N°: ', (j + 1),  ' from ', Lc, ', the contract: ', kj, '\n');
                let Ad = C[kj][0]       // this is the address of the deployment of that contract in that network id
                Ad = Ad.toLowerCase();
                let Pt = C[kj][1]       // this is the path of the JSON file produced by the compilation, with the predicted bytecode

                // we need assure that Pt is rightfully written
                if (Pt != null && Pt != undefined && Pt != './') {

                    // we need make sure that the file in the path Pt exists
                    if(fs.existsSync(Pt)) {

                        let Bytc = require(Pt); // this is the JSON object holding the compilation's bytecode
                        let B0 = Bytc['deployedBytecode'];  // This is the compilation's bytecode
                        let B1 = ethers.utils.isAddress(Ad) ? await pi.getCode(Ad) : '0x';      // This is the bytecode from the deployed contract in blockchain
                        let veredict = compare(B0, B1);     // true: it should verify; false: it won't verify
                        if(veredict) {
                        let success =  "the contract " + kj + ", deployed in the network N° " + ki + ", with the address " + Ad + " will successfully verify with the code of this repository";
                        STR.write(success);
                        console.log(success);
                        } else {
                            let fail = "the contract " + kj + ", deployed in the network N° " + ki + ", with the address " + Ad + " will NOT verify with the code of this repository";
                            STR.write(fail);
                            console.log(fail);
                        }
        

                    } else {

                        STR.write('the bytecode for the contract  ' + kj + 'is not in this repo' + '\n');
                        console.log('the bytecode for the contract  ', kj, 'is not in this repo', '\n');

                    }

                } else {

                    STR.write('the compilation for the contract  ' + kj + 'has not done yet' + '\n');
                    console.log('the compilation for the contract  ', kj, 'has not done yet', '\n');

                }

            }
            
        } else {

            STR.write('make sure that all JSON files are initialized, ' + vi + ' file not initialized' + '\n');
            console.log('make sure that all JSON files are initialized, ', vi, ' file not initialized', '\n');

        }


    }
    // bug: iterator do not verify if a given file exist or not in a path
    STR.end();

}

// this function guides the generation of stream of data for the report
function initializeReport(report_path) {
    // writtable streams with fs:
    // https://stackoverflow.com/questions/3459476/how-to-append-to-a-file-in-node/43370201#43370201
    // according to: https://nodejs.org/api/fs.html#file-system-flags
    // File system flag 'a': Open file for appending. The file is created if it does not exist.
    var stream = fs.createWriteStream(report_path, {flags:'a'});    
    return stream;
}

function compare(A, B) {

    bytes = select(A, B);
    bytes = reduce(bytes[0], bytes[1]);
    
    x = bytes[0] == bytes[1];
    
    // console.log(bytes[0], bytes[1]);
    return x;

}

function sizes(A,B) {

    return ((A.length == B.length) && isPair(A.length));

}

function select(A, B) {

    if (!sizes(A,B)) {
        console.log("sizes not equal or invalid");
        return ["wrong", "arguments"];
    }

    for (let i = A.length; i > 2; i--) {
        
        if (A[(i-1)]!=B[(i-1)]) {

            if (isPair(i)) {

                A = A.slice(0,i);
                B = B.slice(0,i);

            } else {

                A = A.slice(0,i+1);
                B = B.slice(0,i+1);

            }

            return [A, B];

        }

    }

}

function reduce(A, B) {

    if (!sizes(A,B) || A.length <= FIX_ID + 2) {
        console.log("sizes not equal, invalid or too short")
        return ["wrong", "arguments"]
    }

    x = A.length - FIX_ID;

    A = A.slice(0,x);
    B = B.slice(0,x);

    return [A, B];
}

function isPair(X) {

    return X % 2 == 0

}

iterator(configContract);