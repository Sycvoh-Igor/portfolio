import { PAGE_1_REQUEST, PAGE_1_SUCCESS, PAGE_1_ERROR } from 'redux/actions/pageOneActions';

const initialState = {
	data: {},
	isLoading : true,
	isError : false
};

export default function (state = initialState, action) {
	switch (action.type) {
	case PAGE_1_REQUEST: {
		return initialState;
	}

	case PAGE_1_SUCCESS: {
		return Object.assign({}, state, { isLoading : false, isError : false, data: action.json });
	}

	case PAGE_1_ERROR: {
		return Object.assign({}, state, { isLoading : false, isError : true });
	}

	default: {
		return state;
	}
	}
}