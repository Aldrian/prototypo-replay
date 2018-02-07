import { templateNames } from 'prototypo-library';
import { push } from 'react-router-redux';
import union from 'lodash.union';
import keys from 'lodash.keys';
import reduce from 'lodash.reduce';
import isEqual from 'lodash.isequal';
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
  createdFont: undefined,
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
        createdFont: action.createdFont,
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
        console.log('Creating ' + fontName + ' from ' + templateNames[templates[res.Variant.family.template]]);
        dispatch(createPrototypoFactory()).then((prototypoFontFactory) => {
            prototypoFontFactory
            .createFont(fontName, templateNames[templates[res.Variant.family.template]])
            .then((createdFont) => {
              console.log(createdFont)
              // Get differences between base and current values
              const currentValues = res.Variant.values;
              const baseValues = createdFont.values;
              const allkeys = union(keys(createdFont.values), keys(currentValues));
              const difference = reduce(
                allkeys,
                (result, key) => {
                  if (!isEqual(baseValues[key], currentValues[key])) {
                    result[key] = currentValues[key];
                  }
                  return result;
                },
                {},
              );
              dispatch({
                type: IMPORTED,
                template: res.Variant.family.template,
                values: difference,
                createdFont,
              });
              createdFont.changeParams({});
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

export const animateChanges = (intervalTime, framesNumber, word) => (dispatch, getState) => {
  const { createdFont, values } = getState().font;
  console.log(values);
  createdFont.reset();
  const paramKeys = Object.keys(values);
  let paramIndex = 0;
  var intervalId = setInterval(function(){
    if (paramIndex < paramKeys.length){
      createdFont.tween(paramKeys[paramIndex], values[paramKeys[paramIndex]], framesNumber, intervalTime, () => {}, word)
      paramIndex++;
    } else {
      clearInterval(intervalId);
    }
  }, intervalTime * 1000);
}
