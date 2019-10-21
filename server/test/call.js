const Web3 = require('web3');
const fileIO = require('../controllers/fileIO');
const config = require('../config.json');

const contractAddress = '0x29fb26cb478732e4aCa709a8C25f4e7132681Ea1';
const contractABI = fileIO.parseABI(contractAddress);

const web3Connection = new Web3(new Web3.providers.HttpProvider(config.ETH_Host));

const callContract = new web3Connection.eth.Contract(contractABI, contractAddress);

callContract.methods.addElementToArray(200).send({
  from: config.ETH_Account,
  gasPrice: 0,
  gas: web3Connection.utils.toHex(6000000),
});

callContract.methods.changeString('This string is changed again').send({
  from: config.ETH_Account,
  gasPrice: 0,
  gas: web3Connection.utils.toHex(6000000),
});
