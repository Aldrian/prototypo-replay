// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import './Replay.css';

const Replay = props => (
  <div className="Replay">
    Replay
    <div className="text">
        Hello Prototypo
    </div>
  </div>
);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
bindActionCreators(
  {
    selectAnotherFont: () => push('/selectFont'),
  },
  dispatch,
);

Replay.propTypes = {
    selectAnotherFont: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Replay));
