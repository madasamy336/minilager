import { combineReducers } from 'redux'
import appConfigReducer from './appConfig/appConfigReducer';
import FaciltyReducer from'./faciltyList/faciltyReducer';
import unitFilterListReducer from './unitList/unitListReducer';

const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  unitFilter: unitFilterListReducer,
  faciltyList: FaciltyReducer
})

export default rootReducer