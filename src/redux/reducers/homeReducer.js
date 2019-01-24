import { HOME_REQUEST, HOME_SUCCESS, HOME_ERROR } from 'redux/actions/homeActions';

const initialState = {
	data: {},
	isLoading : true,
	isError : false
};

export default function (state = initialState, action) {
	switch (action.type) {
	case HOME_REQUEST: {
		return initialState;
	}

	case HOME_SUCCESS: {
		return Object.assign({}, state, { isLoading : false, isError : false, data: action.json });
	}

	case HOME_ERROR: {
		return Object.assign({}, state, { isLoading : false, isError : true });
	}

	default: {
		return state;
	}
	}
}