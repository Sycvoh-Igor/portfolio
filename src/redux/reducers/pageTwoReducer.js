import { PAGE_2_REQUEST, PAGE_2_SUCCESS, PAGE_2_ERROR } from 'redux/actions/pageTwoActions';

const initialState = {
	data: {},
	isLoading : true,
	isError : false
};

export default function (state = initialState, action) {
	switch (action.type) {
	case PAGE_2_REQUEST: {
		return initialState;
	}

	case PAGE_2_SUCCESS: {
		return Object.assign({}, state, { isLoading : false, isError : false, data: action.json });
	}

	case PAGE_2_ERROR: {
		return Object.assign({}, state, { isLoading : false, isError : true });
	}

	default: {
		return state;
	}
	}
}