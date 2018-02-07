// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { request } from 'graphql-request';
import { GRAPHQL_API } from '../../data/constants';
import './bootstrap-reboot.css';
import './bootstrap-grid.css';
import './App.css';

import { logout } from '../../data/user';
import { createPrototypoFactory } from '../../data/createdFonts';

import ProtectedRoute from '../../components/protectedRoute/';

import Login from '../login/';
import Replay from '../replay/';
import SelectFont from '../selectFont/';
import Button from '../../components/button/';


class App extends React.Component {
  constructor(props) {
    super(props);
    props.createPrototypoFactory();
  }
  render() {
    const { isLoggedIn, hasSelectedFont } = this.props;
    return (
      <main className="App">
        <div className="container nav">
        {this.props.isLoggedIn
          ? (<Button label="Logout" onClick={()=>{this.props.logout()}} />)
          : false
        }
        </div>
        <Switch>
          <Route exact path="/" component={Login} />
          <ProtectedRoute
            exact
            requirement={isLoggedIn}
            path="/selectFont"
            component={SelectFont}
          />
          <ProtectedRoute
            exact
            requirement={hasSelectedFont}
            path="/replay"
            component={Replay}
          />
        </Switch>
      </main>
    );
  }
}

App.propTypes = {
  hasSelectedFont: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

App.defaultProps = {};

const mapStateToProps = state => ({
  isLoggedIn: state.user.projects.length > 0,
  hasSelectedFont: Object.keys(state.font.template).length > 0,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({
    logout,
    createPrototypoFactory,
  }, dispatch);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
