import config from 'etc/config';
import fetch from 'isomorphic-fetch';

const apiHost = config.apiHost;
const dataPath = config.pageOneData;

export const PAGE_1_REQUEST = 'PAGE_1_REQUEST';
export const PAGE_1_SUCCESS = 'PAGE_1_SUCCESS';
export const PAGE_1_ERROR = 'PAGE_1_ERROR';


function startRequest() {
	return {
		type: PAGE_1_REQUEST
	};
}

function receivePosts(json) {
	return {
		type: PAGE_1_SUCCESS,
		json
	};
}

function errorPosts() {
	return {
		type: PAGE_1_ERROR
	};
}

export function unloadPage() {
	return {
		type: PAGE_1_REQUEST
	};
}

export function fetchPage() {
	return (dispatch) => {
		dispatch(startRequest());

		return fetch(`${apiHost}${dataPath}`).then(
			response => {
				if (response.status !== 200) {
					throw Error(response.statusText);
				}
				return response.json();
			}
		).then(
			json => {
				if (json) {
					return dispatch(receivePosts(json));
				}
			}
		).catch(() => dispatch(errorPosts()));
	};
}