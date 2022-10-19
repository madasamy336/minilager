import { combineReducers } from 'redux'
import appConfigReducer from './appConfig/appConfigReducer';
import FaciltyReducer from'./faciltyList/faciltyReducer';

const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  faciltyList: FaciltyReducer
})

export default rootReducer