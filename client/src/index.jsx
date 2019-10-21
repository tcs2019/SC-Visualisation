/* eslint-disable react/no-unused-state */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import FirstStart from './FirstStart';
import Main from './Main';
import Spinner from './Spinner';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      abi: null,
      state: null,
    };
  }

  componentDidMount() {
    axios
      .get('/contract')
      .then(res => {
        this.setState({ address: res.data.address, abi: res.data.abi, state: res.data.state });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.setState({ address: '', abi: '' });
        }
      });
  }

  renderContent() {
    const { address, abi } = this.state;
    if (address === null || abi === null) {
      return <Spinner message="Getting contract information" />;
    }

    if (address === '' || abi === '') {
      return <FirstStart />;
    }

    return <Main contract={this.state} />;
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.querySelector('#root'));
