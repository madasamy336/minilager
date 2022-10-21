import { combineReducers } from 'redux'
import appConfigReducer from './appConfig/appConfigReducer';
import FaciltyReducer from'./faciltyList/faciltyReducer';
import unitFilterListReducer from './unitList/unitListReducer';
import LoginReducer from './login/LoginReducer';

const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  unitFilter: unitFilterListReducer,
  faciltyList: FaciltyReducer,
  login:LoginReducer
  
})

export default rootReducer