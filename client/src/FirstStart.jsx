/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import axios from 'axios';

class FirstStart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      abiFile: null,
    };
  }

  onAddressChange = event => {
    this.setState({
      address: event.target.value,
    });
  };

  onABIChange = event => {
    this.setState({
      abiFile: event.target.files[0],
      // eslint-disable-next-line react/no-unused-state
      loaded: 0,
    });
  };

  onClickHandler = () => {
    const { address, abiFile } = this.state;

    axios.post('/address', { address }).then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log('Uploading ABI...');
        // eslint-disable-next-line no-undef
        const data = new FormData();
        data.append('file', abiFile);
        axios.post('/upload', data).then(result => {
          console.log(result.statusText);
          // eslint-disable-next-line no-undef
          window.location.href = '/';
        });
      } else {
        console.log(res.statusText);
      }
    });
  };

  renderContent() {
    return (
      <div className="ui middle aligned center aligned grid">
        <div className="eight wide column">
          <h1 className="ui header">Welcome</h1>
          <form className="ui form">
            <div className="field">
              <label htmlFor="address" align="left">
                Address
              </label>
              <input type="text" name="address" placeholder="Contract Address" onChange={this.onAddressChange} />
            </div>
            <div className="field">
              <label htmlFor="abi" align="left">
                ABI
              </label>
              <input type="file" name="abi" onChange={this.onABIChange} />
            </div>
            <button type="button" className="ui button" onClick={this.onClickHandler}>
              Start
            </button>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default FirstStart;
