import './Main.css';
import React from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import Transactions from './Transactions';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.contract.address,
      abi: props.contract.abi,
      state: props.contract.state,
      transactions: [],
    };
  }

  componentDidMount() {
    axios
      .get('/transaction')
      .then(res => {
        this.setState({ transactions: res.data });
      })
      .catch(error => {
        console.log(error);
        // TODO: set time out and send another request
      });
  }

  renderContent() {
    const { address, abi, transactions } = this.state;
    if (address === null || abi === null || transactions.length < 1) {
      return <Spinner />;
    }
    return <Transactions contract={this.state} />;
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default Main;
