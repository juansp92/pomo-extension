/*global chrome*/
import React, { Component } from 'react';
import BlockList from './BlockList';

class BlockForm extends Component {
  state = {
    urlString: '',
    blockedURLs: []
  };

  componentDidMount() {
    chrome.storage.sync.get(['blockedURLs'], data => {
      const savedURLs = data.blockedURLs;
      console.log('🎉 savedURLs!!! 🎉', savedURLs);
      this.setState({
        blockedURLs: savedURLs || []
      });
    });
  }

  handleChange = e => {
    const url = e.target.value;
    this.setState({
      urlString: url
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const newURL = this.createURL();

    this.setState(function(state) {
      return {
        blockedURLs: [newURL, ...state.blockedURLs]
      };
    });

    // need to wait for state to be set before running code below
    this.persistBlockList();
  };

  persistBlockList = () => {
    setTimeout(() => {
      const blockedURLs = this.state.blockedURLs.slice();

      try {
        chrome.storage.sync.set({ blockedURLs }, () => {
          console.log(`⬇️ Saved urls ${blockedURLs} to sync storage`);
        });
      } catch (e) {
        console.log('🚫 Something went wrong while saving URLs!', e);
      }
      this.setState({
        urlString: ''
      });

      chrome.storage.sync.get(['blockedURLs'], data => {
        console.log('fetching dataaaaa ⏱', data.blockedURLs);
      });
    }, 200);
  };

  createURL = () => {
    return {
      url: this.editString(this.state.urlString),
      id: Date.now()
    };
  };

  editString = url => {
    // this will only work with full URLs, copy pasted from browser
    let frontTrim = url.substring(url.indexOf(':'));
    const index = frontTrim.indexOf('/', 3) + 1;
    return '*' + frontTrim.substring(0, index) + '*';
  };

  render() {
    const { blockedURLs } = this.state;

    return (
      <div className="url-form">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            onChange={this.handleChange}
            value={this.state.urlString}
            placeholder="no more distractions!"
          />
          <button type="submit">BOOM!</button>
        </form>
        <BlockList blockedURLs={blockedURLs} />
      </div>
    );
  }
}

export default BlockForm;
