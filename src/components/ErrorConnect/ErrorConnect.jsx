import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './ErrorConnect.scss';

const propTypes = {
	local: PropTypes.string,
	path: PropTypes.string
};

const defaultProps = {
	local: 'ru',
	path: ''
};

class ErrorConnect extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const { local, path } = this.props;

		return (
			<div className='connect_error'>
				{(local === 'ru') &&
				<div>
					Ошибка соединения с сервером!<br/>
					Попробуйте <a href={`/${local}${path}`}>обновить страницу.</a>
				</div>}
				{(local === 'ua') &&
				<div>
					{'Помилка з\'єднання з сервером!'}<br/>
					Спробуйте <a href={`/${local}${path}`}>оновити сторінку.</a>
				</div>}
				{(local === 'en') &&
				<div>
					{'Error connecting to server!'}<br/>
					Try <a href={`/${local}${path}`}>reload page.</a>
				</div>}
			</div>
		);
	}

}

ErrorConnect.propTypes = propTypes;
ErrorConnect.defaultProps = defaultProps;


export default ErrorConnect;