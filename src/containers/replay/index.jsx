// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { animateChanges } from '../../data/font';
import Button from '../../components/button';
import ContentEditable from '../../components/contentEditable/';
import './Replay.css';

class Replay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalTime: 300,
      word: 'Hello Prototypo'
    };
  }
  render() {
    return (
      <div className="Replay">
        <Button label="Select another font" onClick={()=>{this.props.selectAnotherFont()}} />
        <div className="settings">
          <p>
            Interval time: <input type="number" placeholder="in ms" value={this.state.intervalTime} onChange={(e) => this.setState({intervalTime: e.target.value})}/>
          </p>
        </div>
        <div className="text">
          <ContentEditable         
            html={`<span>${this.state.word}</span>`}  
            disabled={false}
            onChange={(event) => {
              this.setState({ word: event.target.value.replace(/<\/?span[^>]*>/g, '').replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, '') });
            }}
          />
        </div>
        <Button label="Animate changes" onClick={()=>{this.props.animateChanges(this.state.intervalTime, this.state.word)}} /> 
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
bindActionCreators(
  {
    selectAnotherFont: () => push('/selectFont'),
    animateChanges,
  },
  dispatch,
);

Replay.propTypes = {
    selectAnotherFont: PropTypes.func.isRequired,
    animateChanges: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Replay));
