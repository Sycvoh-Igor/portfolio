import { combineReducers } from 'redux';
import preloaderReducer from './preloaderReducer';
import homeReducer from './homeReducer';
import pageOneReducer from './pageOneReducer';
import pageTwoReducer from './pageTwoReducer';
import pageThreeReducer from './pageThreeReducer';
import pageFourReducer from './pageFourReducer';
import mailReducer from './mailReducer';
import soundReducer from './soundReducer';

export default combineReducers({
	preloader: preloaderReducer,
	home : homeReducer,
	page1 : pageOneReducer,
	page2 : pageTwoReducer,
	page3 : pageThreeReducer,
	page4 : pageFourReducer,
	mail: mailReducer,
	sound: soundReducer
});