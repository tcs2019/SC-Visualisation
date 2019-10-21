/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';

const Transactions = props => {
  const { contract } = props;
  console.log(contract);
  const variableList = contract.state.map(function(variable, index) {
    return (
      <li key={index}>
        {variable.name} : {variable.value}
      </li>
    );
  });

  const transactionList = contract.transactions.map(function(transaction, index) {
    return (
      <div className="card">
        <div className="content">
          <div className="header">Transaction</div>
          <div className="meta custom-overflow-hidden">{transaction.hash}</div>
          <div className="description">
            <p className="custom-overflow-hidden">Block #: {transaction.blockNumber}</p>
            <p>Gas: {transaction.gas}</p>
            <p>Gas Price: {transaction.gasPrice}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="ui center aligned grid">
        <div className="column">
          <h1 className="ui header">Contract Address: {contract.address} </h1>
        </div>
      </div>
      <div className="cards-width ui cards custom-overflow-scroll">{transactionList}</div>
      <div className="ui two column very relaxed grid">
        <div className="column">
          <div>Transaction Info</div>
          {/* <ul>{variableList}</ul> */}
        </div>
        <div className="column">
          <div>Contract State Info</div>
          <ul>{variableList}</ul>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
