import { MAIL_REQUEST, MAIL_SUCCESS, MAIL_ERROR } from 'redux/actions/mailActions';

const initialState = {
	isLoading : false,
	isError : false,
	data : {}
};

export default function (state = initialState, action) {
	switch (action.type) {
	case MAIL_REQUEST: {
		return { isLoading : true, isError : true, data: {} };
	}

	case MAIL_SUCCESS: {
		return Object.assign({}, state, { isLoading: false, isError: false, data: action.data });
	}

	case MAIL_ERROR: {
		return { isLoading : false, isError : true, data: {} };
	}

	default: {
		return state;
	}
	}
}