/* eslint-disable no-plusplus */
const multer = require('multer');
const fs = require('fs');
const config = require('../config.json');

const FileIO = {
  uploadFile(req, res, address) {
    const storage = multer.diskStorage({
      // eslint-disable-next-line no-shadow
      destination(req, file, cb) {
        cb(null, 'public');
      },
      // eslint-disable-next-line no-shadow
      filename(req, file, cb) {
        cb(null, `${address}.json`);
      },
    });

    const upload = multer({ storage }).single('file');

    upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      }
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).send(req.file);
    });
  },

  // return variable list in contract
  parseJson(address) {
    const jsonString = fs.readFileSync(`./public/${address}.json`);
    const abi = JSON.parse(jsonString);

    if (abi.length !== undefined) {
      // this is a normal ABI => Handle variable from normal ABI
      return abi;
    }
    const contractDescriptor = Object.getOwnPropertyDescriptor(abi.sources, Object.getOwnPropertyNames(abi.sources));
    const temp = contractDescriptor.value.legacyAST.children[1].children;
    const variables = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].name !== 'FunctionDefinition') {
        variables.push(temp[i]);
      }
    }
    return variables;
  },

  // return normal ABI
  parseABI(address) {
    const jsonString = fs.readFileSync(`./public/${address}.json`);
    const abi = JSON.parse(jsonString);

    if (abi.length !== undefined) {
      // this is a normal ABI
      return abi;
    }
    const contractDescriptor = Object.getOwnPropertyDescriptor(
      abi.contracts,
      Object.getOwnPropertyNames(abi.contracts)
    );

    const contractNameDescriptor = Object.getOwnPropertyDescriptor(
      contractDescriptor.value,
      Object.getOwnPropertyNames(contractDescriptor.value)[0]
    );

    return contractNameDescriptor.value.abi;
  },

  writeFunctionSignature(funcTable) {
    const fileName = `${config.ETH_JSON_Deployed_Folder}/${config.ETH_Function_Table}`;
    fs.writeFileSync(fileName, JSON.stringify(funcTable));
  },

  readFunctionSignature() {
    const fileName = `${config.ETH_JSON_Deployed_Folder}/${config.ETH_Function_Table}`;
    return JSON.parse(fs.readFileSync(fileName));
  },
};

module.exports = FileIO;
