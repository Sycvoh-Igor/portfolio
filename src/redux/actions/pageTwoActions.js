import config from 'etc/config';
import fetch from 'isomorphic-fetch';

const apiHost = config.apiHost;
const dataPath = config.pageTwoData;

export const PAGE_2_REQUEST = 'PAGE_2_REQUEST';
export const PAGE_2_SUCCESS = 'PAGE_2_SUCCESS';
export const PAGE_2_ERROR = 'PAGE_2_ERROR';


function startRequest() {
	return {
		type: PAGE_2_REQUEST
	};
}

function receivePosts(json) {
	return {
		type: PAGE_2_SUCCESS,
		json
	};
}

function errorPosts() {
	return {
		type: PAGE_2_ERROR
	};
}

export function unloadPage() {
	return {
		type: PAGE_2_REQUEST
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