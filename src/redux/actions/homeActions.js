import config from 'etc/config';
import fetch from 'isomorphic-fetch';

const apiHost = config.apiHost;
const homeData = config.homeData;

export const HOME_REQUEST = 'HOME_REQUEST';
export const HOME_SUCCESS = 'HOME_SUCCESS';
export const HOME_ERROR = 'HOME_ERROR';


function startRequest() {
	return {
		type: HOME_REQUEST
	};
}

function receivePosts(json) {
	return {
		type: HOME_SUCCESS,
		json
	};
}

function errorPosts() {
	return {
		type: HOME_ERROR
	};
}

export function unloadHome() {
	return {
		type: HOME_REQUEST
	};
}

export function fetchHome() {
	return (dispatch) => {
		dispatch(startRequest());

		return fetch(`${apiHost}${homeData}`).then(
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