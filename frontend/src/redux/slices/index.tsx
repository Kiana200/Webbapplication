import { combineReducers } from 'redux';

//Own files.
import auth from './auth';

export default combineReducers({
    auth: auth
});