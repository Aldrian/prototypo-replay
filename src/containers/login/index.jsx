// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../../components/button/';
import { connectToPrototypo } from '../../data/user/';
//import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import './Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  render() {
    return (
      <div className="Login container">
        <p>Login to Prototypo</p>
        <form onSubmit={()=>{this.props.connectToPrototypo(this.state.email, this.state.password)}}>
            <input type="email" placeholder="your email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>
            <input type="password" placeholder="your password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
            <Button label="connect" onClick={()=>{this.props.connectToPrototypo(this.state.email, this.state.password)}} />
        </form>
        <div>
          {this.props.isConnecting
          ? (<span> Connecting, please wait....</span>)
          : (<span className="error">{this.props.errorMessage}</span>)
          }
        </div>
      </div>
    );
  }
}
 

const mapStateToProps = state => ({
  isConnecting: state.user.isConnecting,
  errorMessage: state.user.connectErrorMessage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {connectToPrototypo},
    dispatch,
  );

Login.propTypes = {
  connectToPrototypo: PropTypes.func.isRequired,
  isConnecting: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
