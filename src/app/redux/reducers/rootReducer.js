import { combineReducers } from 'redux'
import appConfigReducer from './appConfig/appConfigReducer';

const rootReducer = combineReducers({
  appConfig: appConfigReducer
})

export default rootReducer