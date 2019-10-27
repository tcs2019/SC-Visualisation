/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const Web3 = require('web3');
const fileIO = require('./fileIO');
const config = require('../config.json');

const Web3JS = {
  encodeFunctionSignature(address) {
    const abi = fileIO.parseABI(address);
    const web3Connection = new Web3(new Web3.providers.HttpProvider(config.ETH_Host));
    const funcTable = [];
    for (let i = 0; i < abi.length; i++) {
      const tempInput = [];

      let funcSignature = `${abi[i].name}(`;

      for (let j = 0; j < abi[i].inputs.length; j++) {
        if (j !== abi[i].inputs.length - 1) {
          funcSignature += `${abi[i].inputs[j].internalType},`;
        } else {
          funcSignature += abi[i].inputs[j].internalType;
        }
        tempInput.push(abi[i].inputs[j].internalType);
      }
      funcSignature += ')';

      const tempSignature = {
        name: abi[i].name,
        inputs: tempInput,
        signature: funcSignature,
        encodeSignature: web3Connection.eth.abi.encodeFunctionSignature(funcSignature),
      };

      funcTable.push(tempSignature);
    }

    fileIO.writeFunctionSignature(funcTable);
  },

  async getLatestTransactions(address, oldLatestBlock) {
    const web3Connection = new Web3(new Web3.providers.HttpProvider(config.ETH_Host));
    const functionsList = fileIO.readFunctionSignature();
    const toContract = [];
    const latestBlock = await web3Connection.eth.getBlockNumber();

    if (oldLatestBlock === 0) {
      const blockInfo = await web3Connection.eth.getBlock(latestBlock).catch(console.error);

      // geting transactions in 1 block
      for (let i = 0; i < blockInfo.transactions.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await web3Connection.eth
          .getTransaction(blockInfo.transactions[i])
          .then(function(result) {
            if (result.to === address) {
              toContract.push(result);
            }
          })
          .catch(console.error);
      }
    } else {
      while (oldLatestBlock + 1 <= latestBlock) {
        // eslint-disable-next-line no-await-in-loop
        const blockInfo = await web3Connection.eth.getBlock(oldLatestBlock + 1).catch(console.error);

        // geting transactions in 1 block
        for (let i = 0; i < blockInfo.transactions.length; i++) {
          // eslint-disable-next-line no-await-in-loop
          await web3Connection.eth
            .getTransaction(blockInfo.transactions[i])
            .then(function(result) {
              if (result.to === address) {
                toContract.push(result);
              }
            })
            .catch(console.error);
        }
        oldLatestBlock += 1;
      }
    }

    // REF: https://ethereum.stackexchange.com/questions/34555/how-to-get-value-of-input-parameters-from-transaction-history?rq=1
    for (let i = 0; i < toContract.length; i++) {
      let inputFunc;

      for (let j = 0; j < functionsList.length; j++) {
        if (toContract[i].input.substring(0, 10) === functionsList[j].encodeSignature) {
          inputFunc = `${functionsList[j].name}(`;
          const temp = await web3Connection.eth.abi.decodeParameters(
            functionsList[j].inputs,
            toContract[i].input.substring(11)
          );
          // eslint-disable-next-line no-underscore-dangle
          for (let k = 0; k < temp.__length__; k++) {
            inputFunc += temp[k.toString()];
          }
          inputFunc += ')';
        }
      }
      toContract[i].input = inputFunc;
    }

    return toContract;
  },

  async getContractCurrentState(address, variables) {
    const functionsList = fileIO.readFunctionSignature();
    const contractABI = fileIO.parseABI(address);
    const web3Connection = new Web3(new Web3.providers.HttpProvider(config.ETH_Host));
    const callContract = new web3Connection.eth.Contract(contractABI, address);

    const state = [];
    const signatures = [];

    for (let i = 0; i < variables.length; i++) {
      for (let j = 0; j < functionsList.length; j++) {
        if (variables[i].attributes.name === functionsList[j].name) {
          // get parametters
          const temp = {
            name: variables[i].attributes.name,
            signature: functionsList[j].signature,
            inputs: functionsList[j].inputs.length,
          };
          signatures.push(temp);
        }
      }
    }

    for (let i = 0; i < signatures.length; i++) {
      if (signatures[i].inputs === 0) {
        const temp = await callContract.methods[signatures[i].name]().call();
        state.push({
          name: signatures[i].name,
          value: temp,
        });
      } else {
        const arrayLength = await callContract.methods.getArrayLength().call();
        const tempArr = [];
        for (let j = 0; j < arrayLength; j++) {
          const tempElement = await callContract.methods[signatures[i].name](j).call();
          tempArr.push(tempElement);
        }

        state.push({
          name: signatures[i].name,
          value: `[ ${tempArr.join(',')} ]`,
        });
      }
    }

    return state;
  },
};

module.exports = Web3JS;
