import { PAGE_3_REQUEST, PAGE_3_SUCCESS, PAGE_3_ERROR } from 'redux/actions/pageThreeActions';

const initialState = {
	data: {},
	isLoading : true,
	isError : false
};

export default function (state = initialState, action) {
	switch (action.type) {
	case PAGE_3_REQUEST: {
		return initialState;
	}

	case PAGE_3_SUCCESS: {
		return Object.assign({}, state, { isLoading : false, isError : false, data: action.json });
	}

	case PAGE_3_ERROR: {
		return Object.assign({}, state, { isLoading : false, isError : true });
	}

	default: {
		return state;
	}
	}
}