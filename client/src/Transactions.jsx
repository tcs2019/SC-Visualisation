import React from 'react';
import { Form, Grid, Image, Transition } from 'semantic-ui-react'

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
        <div class="item" key={index}>
          <i class="ethereum icon"></i>
          <div class="content"> {variable.name} : {variable.value} </div>
        </div>
      );
    });

    const transactionList = this.state.transactions.map((transaction, index)  => {
      return (
        <div className="card" onClick={() => this.handleClick(transaction)}>
          <div className="content">
            <div className="header">
              <Image centered size='small' src='/ethereum.png' />
            </div>
            <div className="meta custom-overflow-hidden">{transaction.hash}</div>
            <div className="description">
              <p className="custom-overflow-hidden">Block #: {transaction.blockNumber}</p>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="custom-middle">
        <div className="ui center aligned grid custom-middle">
          <div className="ui center aligned fifteen wide column">
            {/* <h1 className="ui header">Contract Name</h1> */}
            <h1 className="ui header">Contract Address: {this.state.address} </h1>
          </div>
          <div className="ui center aligned fifteen wide column">
            <div className="cards-width ui cards custom-overflow-scroll" onClick={this.onClickHandler}>{transactionList}</div>
            <div className="ui clearing segment left aligned">
              <div className="ui two column very relaxed grid">
                <div className="column">
                  <div className="ui header">Transaction Info</div>
                  <div class="ui list">
                    <div class="item">
                      <i class="hashtag icon"></i>
                      <div class="content"> Block Hash: {this.state.blockHash} </div>
                    </div>
                    <div class="item">
                      <i class="cube icon"></i>
                      <div class="content"> Block Number: {this.state.blockNumber} </div>
                    </div>
                    <div class="item">
                      <i class="user icon"></i>
                      <div class="content"> From: {this.state.from} </div>
                    </div>
                    <div class="item">
                      <i class="file alternate icon"></i>
                      <div class="content"> Transaction Index: {this.state.transactionIndex} </div>
                    </div>
                    <div class="item">
                      <i class="sign-in icon"></i>
                      <div class="content"> Input: {this.state.input} </div>
                    </div>
                    <div class="item">
                      <i class="code icon"></i>
                      <div class="content"> Nonce: {this.state.nonce}</div>
                    </div>
                    <div class="item">
                      <i class="hotjar icon"></i>
                      <div class="content"> Gas: {this.state.gas}</div>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="ui header">Contract State Info</div>
                  <div class="ui list">{variableList}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  

  
}

export default Transactions;