import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Popup } from 'semantic-ui-react';

export default class ChannelMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      messageData: '',
      senderAddress: null,
      timeStamp: '',
      messageAuthorAlias: '',
    };
  }
  componentDidMount() {
    this.fetchMessage();
  }

  componentDidUpdate(prevProps) {
    if (this.props.channelIndex !== prevProps.channelIndex) {
      this.fetchMessage();
    }
  }

  async fetchMessage() {
    const messageData = await this.props.drizzle.contracts.DappChat.methods
      .getReplyData(this.props.channelIndex, this.props.messageIndex)
      .call();

    const messageAuthorAlias = await this.props.drizzle.contracts.DappChat.methods.aliases(messageData[1]).call();
    this.setState({
      messageData: messageData[0],
      senderAddress: messageData[1],
      timeStamp: messageData[3],
      messageAuthorAlias,
    });
  }

  checkSender() {
    if (this.props.userAddress === this.state.senderAddress) {
      return [ 'messageContainerRight', 'speech-bubble-right' ];
    }
    return [ 'messageContainerLeft', 'speech-bubble-left' ];
  }

  createBlockie() {
    return (
      <Popup
        content={this.state.senderAddress}
        flowing
        hoverable
        trigger={<img alt="blockie" className="blockies" src={makeBlockie(this.state.senderAddress)} />}
      />
    );
  }

  render() {
    let timeStamp;
    if (this.state.timeStamp) {
      const date = new Date(this.state.timeStamp * 1000);
      timeStamp = (
        <div className="timeStamp">
          {date.getHours()}:{date.getMinutes()}
        </div>
      );
    }
    let blockie;
    if (this.state.senderAddress) {
      blockie = this.createBlockie();
    }

    const messageOrientation = this.checkSender();
    return (
      <div>
        <div className={messageOrientation[0]}>
          <div>
            {blockie}
            <div>{this.state.messageAuthorAlias}</div>
          </div>
          <div className={messageOrientation[1]}>
            <div>{this.state.messageData}</div>
            <div>{timeStamp ? timeStamp : ''}</div>
          </div>
        </div>
      </div>
    );
  }
}
