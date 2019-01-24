import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import routes from 'routes';
import PreLoader from 'components/PreLoader';

import './App.scss';

global.THREE = require('three');

const propTypes = {
	isMuted: PropTypes.bool
};


class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isChrome: false
		};
	}

	componentDidMount() {
		this.testIsChrome();

		const audio = new Audio();

		audio.volume = 0.03;
		audio.loop = true;
		audio.muted = this.props.isMuted;
		this._audio = audio;
		setTimeout(() => {
			audio.play();
		}, 1000);

		audio.onerror = () => {
			console.log('main audio error');
			this._audio = null;
		};

		audio.src = '/media/audio/background.mp3';
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (this._audio && curProps.isMuted !== prevProps.isMuted) {
			this._audio.muted = curProps.isMuted;
		}
	}

	testIsChrome() {
		const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

		this.setState({
			isChrome
		});
	}

	render() {
		const { isChrome } = this.state;

		return (
			<div className='app'>
				<Switch>
					<Route path='/:local(ru|en|ua)'>
						<Switch>
							{routes.map((route, i) => (
								<Route
									key={i}
									exact={route.exact}
									path={route.path}
									component={route.component}
								/>
							))}
						</Switch>
					</Route>
					<Redirect from='/' exact to='/ua' />
					<Redirect from='/:other' to='/ua/:other' />
				</Switch>
				<PreLoader/>
				{isChrome &&
				<iframe
					src='/media/audio/silence.mp3'
					allow='autoplay'
					style={{ display: 'none' }}
				/>}
			</div>
		);
	}

}

App.propTypes = propTypes;

function mapStateToProps(state) {
	const { isMuted } = state.sound;

	return { isMuted };
}

export default hot(module)(connect(mapStateToProps)(App));