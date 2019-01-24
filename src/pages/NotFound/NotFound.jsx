import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { setLoaderPos } from 'redux/actions/preloaderActions';
import { hidePreloader } from 'redux/actions/preloaderActions';
import DelayLink from 'components/DelayLink';
import SoundButton from 'components/SoundButton';
import * as colorSheme from 'etc/colorSheme.json';

import './NotFound.scss';

const propTypes = {
	match:  PropTypes.object,
	dispatch: PropTypes.func
};

const defaultTitle = {
	ru: 'Страница не найдена | Сычев Игорь',
	ua: 'Сторінка відсутня | Сичов Ігор',
	en: 'Page not found | Sychov Igor'
};

class NotFound extends Component {

	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		this.props.dispatch(hidePreloader());
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleClick(e) {
		const x = e.clientX;
		const y = e.clientY;

		this.props.dispatch(setLoaderPos({
			top: y,
			left: x,
			width: 0,
			height: 0,
			marginTop: 0,
			marginLeft: 0
		}));
	}

	render() {
		const { match } = this.props;
		const local = (match && match.params) ? match.params[0] : 'ru';
		const pTitle = defaultTitle[local];
		const metaColor = colorSheme.error[1];

		return (
			<div className='page_not_found'>
				<MetaTags>
					<title>{pTitle}</title>
					<meta name='theme-color' content={metaColor} />
					<meta name='msapplication-navbutton-color' content={metaColor} />
				</MetaTags>
				<SoundButton />
				{(local === 'ru') &&
					<div className='pnf__content'>
						<div>
							Страница не найдена!<br/>
							<DelayLink to='/ru' exact >
								<span onClick={this.handleClick}>Перейти на главную.</span>
							</DelayLink>
						</div>
					</div>
				}
				{(local === 'ua') &&
					<div className='pnf__content'>
						<div>
							Сторінка відсутня!<br/>
							<DelayLink to='/ua' exact >
								<span onClick={this.handleClick}>Перейти на головну.</span>
							</DelayLink>
						</div>
					</div>
				}
				{(local === 'en') &&
					<div className='pnf__content'>
						<div>
							Page not found!<br/>
							<DelayLink to='/en' exact >
								<span onClick={this.handleClick}>Go to home page.</span>
							</DelayLink>
						</div>
					</div>
				}
			</div>
		);
	}

}

NotFound.propTypes = propTypes;

export default connect(null)(NotFound);