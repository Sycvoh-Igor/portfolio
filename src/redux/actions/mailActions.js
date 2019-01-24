import config from 'etc/config';
import fetch from 'isomorphic-fetch';

const apiHost  = config.apiHost;
const dataPath = config.mailData;

export const MAIL_REQUEST = 'MAIL_REQUEST';
export const MAIL_SUCCESS = 'MAIL_SUCCESS';
export const MAIL_ERROR = 'MAIL_ERROR';


export function mailClear() {
	return { type: MAIL_REQUEST };
}

export function startRequest() {
	return { type: MAIL_REQUEST };
}

export function receivePosts(json) {
	return {
		type : MAIL_SUCCESS,
		data: json
	};
}

export function errorPosts() {
	return {
		type: MAIL_ERROR
	};
}

export function fetchMail(params) {
	return (dispatch) => {
		dispatch(startRequest());

		return fetch(`${apiHost}${dataPath}`, {
			headers : {
				'Accept': 'text/plain',
				'Content-Type': 'application/json'
			},
			method : 'post',
			body : JSON.stringify(params)
		}).then(response => {
			if (response.status !== 200) {
				throw Error(response.statusText);
			}
			return response.json();
		}).then(json => {
			if (json) {
				return dispatch(receivePosts(json));
			}
		}).catch(() => dispatch(errorPosts()));
	};
}