import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import image1 from 'images/bg-1.jpg';
import image2 from 'images/bg-2.jpg';
import image3 from 'images/bg-3.jpg';

import './ChangeBg.scss';


const propTypes = {
	isMuted: PropTypes.bool,
	local: PropTypes.string
};
const defaultProps = {
	local: 'ru'
};

const imagesObj = {
	ru: image1,
	ua: image2,
	en: image3
};

class ChangeBg extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this._isMounted = true;

		const audio = new Audio();

		audio.volume = 0.005;
		audio.muted = this.props.isMuted;
		this._audio = audio;

		audio.onerror = () => {
			this._audio = null;
		};

		audio.src = '/media/audio/down.mp3';

		const imageArr = [];

		Object.keys(imagesObj).forEach((key) => {
			if (key !== this.props.local) {
				const img = new Image();

				img.src = imagesObj[key];
				imageArr.push(img);
			}
		});
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (this._audio && curProps.isMuted !== prevProps.isMuted) {
			this._audio.muted = curProps.isMuted;
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		const { local } = this.props;

		return (
			<div className='change_bg'>
				<CSSTransition
					in={(local === 'ru')}
					timeout={900}
					classNames='fade'
					mountOnEnter
					unmountOnExit
					onEnter={() => {
						if (this._audio) {
							this._audio.currentTime = 0.3;
							this._audio.play();
						}
					}}
				>
					<div
						className='chbg__image'
						style={{
							backgroundImage: `url(${imagesObj.ru})`,
							zIndex: (local === 'ru') ? 2 : 1
						}}
					/>
				</CSSTransition>
				<CSSTransition
					in={(local === 'ua')}
					timeout={900}
					classNames='fade'
					mountOnEnter
					unmountOnExit
					onEnter={() => {
						if (this._audio) {
							this._audio.currentTime = 0.3;
							this._audio.play();
						}
					}}
				>
					<div
						className='chbg__image'
						style={{
							backgroundImage: `url(${imagesObj.ua})`,
							zIndex: (local === 'ua') ? 2 : 1
						}}
					/>
				</CSSTransition>
				<CSSTransition
					in={(local === 'en')}
					timeout={900}
					classNames='fade'
					mountOnEnter
					unmountOnExit
					onEnter={() => {
						if (this._audio) {
							this._audio.currentTime = 0.3;
							this._audio.play();
						}
					}}
				>
					<div
						className='chbg__image'
						style={{
							backgroundImage: `url(${imagesObj.en})`,
							zIndex: (local === 'en') ? 2 : 1
						}}
					/>
				</CSSTransition>
			</div>
		);
	}

}

ChangeBg.propTypes = propTypes;
ChangeBg.defaultProps = defaultProps;

function mapStateToProps(state) {
	const { isMuted } = state.sound;

	return { isMuted };
}

export default connect(mapStateToProps)(ChangeBg);