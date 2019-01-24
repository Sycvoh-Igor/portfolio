import { PAGE_4_REQUEST, PAGE_4_SUCCESS, PAGE_4_ERROR } from 'redux/actions/pageFourActions';

const initialState = {
	data: {},
	isLoading : true,
	isError : false
};

export default function (state = initialState, action) {
	switch (action.type) {
	case PAGE_4_REQUEST: {
		return initialState;
	}

	case PAGE_4_SUCCESS: {
		return Object.assign({}, state, { isLoading : false, isError : false, data: action.json });
	}

	case PAGE_4_ERROR: {
		return Object.assign({}, state, { isLoading : false, isError : true });
	}

	default: {
		return state;
	}
	}
}