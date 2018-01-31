import { templateNames } from 'prototypo-library';
import { push } from 'react-router-redux';
import { GraphQLClient } from 'graphql-request';
import { createPrototypoFactory } from '../createdFonts';
import { getVariantInfos } from '../queries';
import { GRAPHQL_PROTOTYPO_API } from '../constants';

export const CREATE = 'font/CREATE';
export const ANIMATE = 'font/ANIMATE';
export const IMPORT = 'font/IMPORT';
export const IMPORTED = 'font/IMPORTED';
export const ERROR = 'font/ERROR';

const initialState = {
  fontName: 'replay',
  values: {},
  template: {},
  isFetching: false,
  errorMessage: '',
};

const templates = {
  'elzevir.ptf': 'ELZEVIR',
  'venus.ptf': 'GROTESK',
  'john-fell.ptf': 'FELL',
  'gfnt.ptf': 'SPECTRAL',
  'antique.ptf': 'ANTIQUE',
};



export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE:
      return {
        ...state,
      };

    case IMPORT:
      return {
        ...state,
        isFetching: true,
        errorMessage: '',
      };

    case IMPORTED:
      return {
        ...state,
        isFetching: false,
        errorMessage: '',
        values: action.values,
        template: action.template,
      };

    case ANIMATE:
      return {
        ...state,
      };

    case ERROR:
        return {
            ...state,
            isFetching: false,
            errorMessage: '',
        };

    default: 
        return {
            ...state,
        }

    }
};

export const importVariant = variantId => (dispatch, getState) => {
    dispatch({ type: IMPORT });
    const token = getState().user.token;
    const client = new GraphQLClient(GRAPHQL_PROTOTYPO_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    client.request(
      getVariantInfos(variantId)
    )
    .then((res) => {
        const { fontName } = getState().font;
        dispatch(createPrototypoFactory()).then((prototypoFontFactory) => {
            prototypoFontFactory
            .createFont(fontName, templateNames[templates[res.Variant.family.template]])
            .then((createdFont) => {
              dispatch({
                type: IMPORTED,
                template: res.Variant.family.template,
                values: res.Variant.values,
              });
              dispatch(push('/replay'));
            });
        });    
    })
    .catch(error => {
      dispatch({
        type: ERROR,
        errorMessage: 'Could not fetch variant infos: ' + error,
      });
    }); 
};
