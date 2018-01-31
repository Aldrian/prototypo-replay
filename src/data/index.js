import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import font from './font';
import user from './user';
import createdFonts from './createdFonts';

export default combineReducers({
  routing: routerReducer,
  font,
  user,
  createdFonts,
});
