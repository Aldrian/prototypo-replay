// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { importVariant } from '../../data/font';
import './SelectFont.css';

const SelectFont = props => (
  <div className="SelectFont container">
    <div>
          {props.isFetching
          ? (<span> Connecting, please wait....</span>)
          : (<span className="error">{props.errorMessage}</span>)
          }
        </div>
    <ul className="family-list row">
    {
      props.projects.map(project => (
        <li className="family col-lg-3 col-md-4 col-sm-6" key={`family-${project.id}`}>
          {project.name}
          <ul>
            {project.variants.map(variant => (
              <li className="variant" key={`variant-${variant.id}`} onClick={() => { props.importVariant(variant.id); }}>{variant.name}</li>
            ))}
          </ul>
        </li>
      ))
    }
    </ul>
  </div>
);

const mapStateToProps = state => ({
  projects: state.user.projects,
  isFetching: state.font.isFetching,
  errorMessage: state.font.errorMessage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { importVariant },
    dispatch,
  );

SelectFont.propTypes = {
  importVariant: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      variants: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
        })
      )
    })
  )
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectFont));
