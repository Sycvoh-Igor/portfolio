import config from 'etc/config';
import fetch from 'isomorphic-fetch';

const apiHost = config.apiHost;
const dataPath = config.pageFourData;

export const PAGE_4_REQUEST = 'PAGE_4_REQUEST';
export const PAGE_4_SUCCESS = 'PAGE_4_SUCCESS';
export const PAGE_4_ERROR = 'PAGE_4_ERROR';


function startRequest() {
	return {
		type: PAGE_4_REQUEST
	};
}

function receivePosts(json) {
	return {
		type: PAGE_4_SUCCESS,
		json
	};
}

function errorPosts() {
	return {
		type: PAGE_4_ERROR
	};
}

export function unloadPage() {
	return {
		type: PAGE_4_REQUEST
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