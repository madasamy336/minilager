import { combineReducers } from 'redux'
import appConfigReducer from './appConfig/appConfigReducer';
import FaciltyReducer from'./faciltyList/faciltyReducer';
import unitFilterListReducer from './unitList/unitListReducer';
import LoginReducer from './login/LoginReducer';
import rentDetailsReducer from './rentdetails/rentDetailsReducer'

const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  unitFilter: unitFilterListReducer,
  faciltyList: FaciltyReducer,
  login:LoginReducer,
  rentdetail: rentDetailsReducer

  
})

export default rootReducer