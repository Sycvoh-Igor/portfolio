import config from 'etc/config';
import fetch from 'isomorphic-fetch';

const apiHost = config.apiHost;
const dataPath = config.pageThreeData;

export const PAGE_3_REQUEST = 'PAGE_3_REQUEST';
export const PAGE_3_SUCCESS = 'PAGE_3_SUCCESS';
export const PAGE_3_ERROR = 'PAGE_3_ERROR';


function startRequest() {
	return {
		type: PAGE_3_REQUEST
	};
}

function receivePosts(json) {
	return {
		type: PAGE_3_SUCCESS,
		json
	};
}

function errorPosts() {
	return {
		type: PAGE_3_ERROR
	};
}

export function unloadPage() {
	return {
		type: PAGE_3_REQUEST
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