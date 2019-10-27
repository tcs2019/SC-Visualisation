/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const express = require('express');
const fileIO = require('../controllers/fileIO');
const web3JS = require('../controllers/web3JS');

const router = express.Router();

let address = '';
let abi = '';
const transactions = [];
let latestBlock = 0;

router.get('/contract', async function(req, res, next) {
  if (address !== '') {
    try {
      // collect all functions that can be called
      web3JS.encodeFunctionSignature(address);
      abi = fileIO.parseJson(address);

      // TODO: call() for current states
      const state = await web3JS.getContractCurrentState(address, abi);

      res.json({ address, abi, state });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

router.get('/transaction', async function(req, res, next) {
  // return latest transactions in blocks
  const latest = await web3JS.getLatestTransactions(address, latestBlock);
  if (transactions.length < 1) {
    for (let i = 0; i < latest.length; i++) {
      transactions.unshift(latest[i]);
    }
  } else {
    for (let i = 0; i < latest.length; i++) {
      if (latest[i].blockNumber > latestBlock) {
        transactions.unshift(latest[i]);
      }
    }
  }

  if (transactions.length > 0) {
    latestBlock = transactions[transactions.length - 1].blockNumber;
    res.json(transactions);
  } else {
    res.sendStatus(404);
  }
});

router.post('/address', function(req, res, next) {
  address = req.body.address;
  if (address !== '') {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

router.post('/upload', function(req, res, next) {
  fileIO.uploadFile(req, res, address);
});

module.exports = router;
