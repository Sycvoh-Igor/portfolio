import { LOADER_SHOW, LOADER_HIDE, APP_LOADED, PAGE_LOADED, PAGE_UNLOADED, LOADER_LINK, LOADER_POS } from 'redux/actions/preloaderActions';

const initialState = {
	isShow : true,
	appLoaded: false,
	pageLoaded: false,
	link: '',
	position: {
		top: '50%',
		left: '50%',
		width: 140,
		height: 140
	}
};

export default function (state = initialState, action) {
	switch (action.type) {
	case LOADER_SHOW:
		return Object.assign({}, state, { isShow : true });

	case LOADER_HIDE:
		return Object.assign({}, state, { isShow : false });

	case APP_LOADED:
		return Object.assign({}, state, { appLoaded : true, pageLoaded: true });

	case PAGE_LOADED:
		return Object.assign({}, state, { pageLoaded: true });

	case PAGE_UNLOADED:
		return Object.assign({}, state, { pageLoaded: false });

	case LOADER_LINK:
		return Object.assign({}, state, { link : action.link });

	case LOADER_POS:
		return Object.assign({}, state, { position : action.data });

	default:
		return state;
	}
}