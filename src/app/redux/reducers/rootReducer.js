import { combineReducers } from 'redux'
import appConfigReducer from './appConfig/appConfigReducer';
import unitFilterListReducer from './unitList/unitListReducer';

const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  unitFilter: unitFilterListReducer
})

export default rootReducer