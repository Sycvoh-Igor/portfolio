import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { isLoadedApp, isLoadedPage, isUnloadedPage } from 'redux/actions/preloaderActions';

import './PreLoader.scss';

const propTypes = {
	location: PropTypes.any,
	isShow: PropTypes.bool,
	appLoaded: PropTypes.bool,
	isMuted: PropTypes.bool,
	dispatch: PropTypes.func,
	link: PropTypes.string,
	position: PropTypes.object
};

class PreLoader extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isExit: false,
			pathname: this.props.location.pathname
		};
	}

	componentDidMount() {
		const audio = new Audio();

		audio.volume = 0.06;
		audio.muted = this.props.isMuted;
		this._audio = audio;

		audio.onerror = () => {
			this._audio = null;
		};

		audio.src = '/media/audio/change3.mp3';
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (this._audio && curProps.isMuted !== prevProps.isMuted) {
			this._audio.muted = curProps.isMuted;
		}
	}

	render() {
		const { isExit, pathname } = this.state;
		const { isShow, appLoaded, position, link } = this.props;
		let animClass = 'fade';
		let exTime = 150;
		let colorClass = '';

		if (pathname.indexOf('/about') !== -1) {
			animClass = 'fade1';
		} else if (pathname.indexOf('/skills') !== -1) {
			animClass = 'fade2';
		} else if (pathname.indexOf('/portfolio') !== -1) {
			animClass = 'fade3';
		} else if (pathname.indexOf('/contacts') !== -1) {
			animClass = 'fade4';
		} else if (pathname !== '/ru' && pathname !== '/ru/' &&
			pathname !== '/ua' && pathname !== '/ua/' &&
			pathname !== '/en' && pathname !== '/en/') {
			animClass = 'fade_err';
		}

		if (link.indexOf('/about') !== -1) {
			colorClass = 'tl';
		} else if (link.indexOf('/skills') !== -1) {
			colorClass = 'bl';
		} else if (link.indexOf('/portfolio') !== -1) {
			colorClass = 'tr';
		} else if (link.indexOf('/contacts') !== -1) {
			colorClass = 'br';
		} else {
			exTime = 600;
		}

		return (
			<div className='preloader'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306' className='hidden'>
					<symbol id='preloderSvg'>
						<path
							d='m 9.09 151.45 l 83.3376 -144.345 l 166.675 0 l 83.3376 144.345 l -83.3376 144.345 l -166.675 0 Z'
						/>
					</symbol>
				</svg>
				<CSSTransition
					in={(isShow || !isExit) && !appLoaded}
					timeout={{
						enter: 0,
						exit: 1550 // 1550
					}}
					classNames={animClass}
					unmountOnExit
					onExited={() => {
						if (!this.props.appLoaded) {
							this.props.dispatch(isLoadedApp());
						}
					}}
				>
					<div className='prl__main'>
						<div className='prl__bg' />
						<div
							className='prl__content'
							onAnimationIteration={() => {
								this.setState({
									isExit: true
								});
							}}
						>
							<div className='prl__item tl'>
								<div className='svg_wr'>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306'>
										<g className='main_figure'>
											<use xlinkHref='#preloderSvg' />
										</g>
									</svg>
								</div>
							</div>
							<div className='prl__item bl'>
								<div className='svg_wr'>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306'>
										<g className='main_figure'>
											<use xlinkHref='#preloderSvg' />
										</g>
									</svg>
								</div>
							</div>
							<div className='prl__item tr'>
								<div className='svg_wr'>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306'>
										<g className='main_figure'>
											<use xlinkHref='#preloderSvg' />
										</g>
									</svg>
								</div>
							</div>
							<div className='prl__item br'>
								<div className='svg_wr'>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306'>
										<g className='main_figure'>
											<use xlinkHref='#preloderSvg' />
										</g>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</CSSTransition>
				<CSSTransition
					in={isShow && appLoaded}
					timeout={{
						enter: 900,
						exit: exTime
					}}
					classNames='change'
					unmountOnExit
					onEnter={() => {
						if (this._audio) {
							this._audio.currentTime = 0;
							this._audio.play();
						}
					}}
					onEntered={() => {
						this.props.dispatch(isUnloadedPage());
					}}
					onExited={() => {
						this.props.dispatch(isLoadedPage());
					}}
				>
					<div className='prl__second'>
						<div className={`prl__bg2 ${colorClass}`}
							style={position}
						/>
					</div>
				</CSSTransition>
			</div>
		);
	}

}

PreLoader.propTypes = propTypes;

function mapStateToProps(state) {
	const { isShow, appLoaded, link, position } = state.preloader;
	const { isMuted } = state.sound;

	return { isShow, appLoaded, link, position, isMuted };
}

export default withRouter(connect(mapStateToProps)(PreLoader));