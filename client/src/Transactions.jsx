import React from 'react';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.contract.address,
      abi: props.contract.abi,
      state: props.contract.state,
      transactions: props.contract.transactions,
      blockHash: props.contract.transactions[0].blockHash,
      blockNumber: props.contract.transactions[0].blockNumber,
      from: props.contract.transactions[0].from,
      transactionIndex: props.contract.transactions[0].transactionIndex,
      nonce: props.contract.transactions[0].nonce,
      gas: props.contract.transactions[0].gas,
      input: props.contract.transactions[0].input,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (transaction) => {
    // alert(transaction);
    this.setState({
      blockHash: transaction.blockHash,
      blockNumber: transaction.blockNumber,
      from: transaction.from,
      transactionIndex: transaction.transactionIndex,
      nonce: transaction.nonce,
      gas: transaction.gas,
      input: transaction.input,
    })
  };


  render() {
    const variableList = this.state.state.map(function(variable, index) {
      return (
        <li key={index}>
          {variable.name} : {variable.value}
        </li>
      );
    });

    const transactionList = this.state.transactions.map((transaction, index)  => {
      return (
        <div className="card" onClick={() => this.handleClick(transaction)}>
          <div className="content">
            <div className="header">Transaction Icon</div>
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
          <h1 className="ui header">Contract Address: {this.state.address} </h1>
        </div>
      </div>
      <div className="cards-width ui cards custom-overflow-scroll" onClick={this.onClickHandler}>{transactionList}</div>
      <div className="ui two column very relaxed grid">
        <div className="column">
          <div>Transaction Info</div>
          <ul>
            <li>Block Hash: {this.state.blockHash}</li>
            <li>Block Number: {this.state.blockNumber}</li>
            <li>From: {this.state.from}</li>
            <li>Transaction Index: {this.state.transactionIndex}</li>
            <li>Input: {this.state.input}</li>
            <li>Nonce: {this.state.nonce}</li>
            <li>Gas: {this.state.gas}</li>
          </ul>
        </div>
        <div className="column">
          <div>Contract State Info</div>
          <ul>{variableList}</ul>
        </div>
      </div>
    </div>
    );
  }
 
  

  
}

export default Transactions;