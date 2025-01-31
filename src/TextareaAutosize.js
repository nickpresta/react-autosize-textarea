import React from 'react';
import autosize from 'autosize';

const UPDATE = 'autosize:update',
  DESTROY = 'autosize:destroy',
  RESIZED = 'autosize:resized';

export default class TextareaAutosize extends React.Component {

  static propTypes = {
    onResize: React.PropTypes.func
  };

  static defaultProps = {
    rows: 1
  };

  getTextareaDOMNode = () => (
    this.refs.textarea.nodeType === 1 ?
      this.refs.textarea :
      React.findDOMNode(this.refs.textarea)
  );

  componentDidMount() {
    autosize(this.getTextareaDOMNode());
    if (this.props.onResize) {
      this.getTextareaDOMNode().addEventListener(RESIZED, this.props.onResize);
    }
  }

  componentWillUnmount() {
    if (this.props.onResize) {
      this.getTextareaDOMNode().removeEventListener(RESIZED, this.props.onResize);
    }
    this.dispatchEvent(DESTROY);
  }

  dispatchEvent = (EVENT_TYPE, defer) => {
    const event = document.createEvent('Event');
    event.initEvent(EVENT_TYPE, true, false);
    const dispatch = () => this.getTextareaDOMNode().dispatchEvent(event);
    if (defer) {
      setTimeout(dispatch);
    } else {
      dispatch();
    }
  };

  getValue = ({ valueLink, value }) => valueLink ? valueLink.value : value;

  render() {
    const { children, ...props } = this.props;
    return (
      <textarea {...props} ref='textarea'>
        {children}
      </textarea>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.getValue(nextProps) !== this.getValue(this.props)) {
      this.dispatchEvent(UPDATE, true);
    }
  }

}
