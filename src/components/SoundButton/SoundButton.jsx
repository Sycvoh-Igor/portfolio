import React, { Component } from 'react';
import { PropTypes, instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import { withCookies, Cookies } from 'react-cookie';
import { setSoundOn, setSoundOff } from 'redux/actions/soundActions';
import imageSoundOn from 'images/volume.svg';
import imageSoundOff from 'images/volume-off.svg';

import './SoundButton.scss';

const propTypes = {
	colors: PropTypes.oneOf(['main', 'color1', 'color2', 'color3', 'color4']),
	isShow: PropTypes.bool,
	isMuted: PropTypes.bool,
	dispatch: PropTypes.func,
	cookies: instanceOf(Cookies).isRequired
};
const defaultProps = {
	colors: 'main',
	isShow: true
};


class SoundButton extends Component {

	constructor(props) {
		super(props);

		const { cookies } = this.props;
		let isMuted = 'false';

		if (cookies) {
			isMuted = cookies.get('ismuted');

			if (isMuted !== 'true') {
				isMuted = 'false';
			}
			const date = new Date(new Date().getTime() + 3600 * 30 * 14 * 1000);

			if (isMuted === 'true') this.props.dispatch(setSoundOff());
			cookies.set('ismuted', isMuted, { path: '/', expires: date });
		}

		this.state = {
			isMuted: (isMuted === 'true'),
			isVertical: false,
			wHeight: 0
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		const audio = new Audio();

		audio.volume = 0.12;
		audio.muted = this.props.isMuted;
		this._audio = audio;

		audio.onerror = () => {
			this._audio = null;
		};

		audio.src = '/media/audio/click.mp3';

		this.handleResize();

		window.addEventListener('resize', this.handleResize, false);
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (curProps.isMuted !== prevProps.isMuted) {
			if (curProps.cookies) {
				const date = new Date(new Date().getTime() + 3600 * 24 * 30 * 1000);

				curProps.cookies.set('ismuted', curProps.isMuted, { path: '/', expires: date });
			}

			if (this._audio) {
				this._audio.muted = curProps.isMuted;
			}

			this.setState({
				isMuted: curProps.isMuted
			});
		}
	}

	componentWillUnmount() {
		this._isMounted = false;

		window.removeEventListener('resize', this.handleResize);
	}

	handleClick() {
		if (this.props.isMuted) {
			this.props.dispatch(setSoundOn());
			if (this._audio) {
				this._audio.currentTime = 0;
				this._audio.play();
			}
		} else {
			this.props.dispatch(setSoundOff());
		}
	}

	handleResize() {
		const wWidth = window.innerWidth;
		const wHeight = window.innerHeight;

		this.setState({
			isVertical: wHeight > wWidth,
			wHeight
		});
	}

	render() {
		const { colors, isShow } = this.props;
		const { isMuted, isVertical, wHeight } = this.state;
		const showClass = isShow ? ' show' : '';
		const activeClass = isMuted ? ' active' : '';

		const style = !isVertical ? null : {
			width: 0.085 * wHeight,
			top: 0.127 * wHeight,
			marginLeft: -0.144 * wHeight
		};

		return (
			<div
				className={`sound_btn ${colors}${showClass}${activeClass}`}
				style={style}
			>
				<div className='snd__skeleton'/>
				<div className='snd__content'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 350 306'
						className='snd__svg'
					>
						<path
							className='snd__svg_path'
							d='m 9.09,151.45 83.33759,-144.344929 166.67517,8e-6 83.33758,144.344931 -83.33759,144.34493 -166.67517,0 z'
						/>
					</svg>
					<div
						className='snd__circle'
						onClick={this.handleClick}
					>
						<div className='snd__icon_wr'>
							<div className='snd__icon'>
								<svg
									className='snd__i_svg'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 110 110'
								>
									<defs>
										<clipPath
											clipPathUnits='userSpaceOnUse'
											id='sndAverseClip'
										>
											<rect
												x='55'
												y='0'
												width='55'
												height='110'
											/>
										</clipPath>
									</defs>
									<circle
										cx='55'
										cy='55'
										r='50'
									/>
									<circle
										className='snd__i_inner'
										clipPath='url(#sndAverseClip)'
										cx='55'
										cy='55'
										r='44'
									/>
									<image
										xlinkHref={imageSoundOn}
										x='15'
										y='15'
										width='80'
										height='80'
									/>
								</svg>
							</div>
							<div className='snd__icon reverse'>
								<svg
									className='snd__i_svg'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 110 110'
								>
									<defs>
										<clipPath
											clipPathUnits='userSpaceOnUse'
											id='sndReverseClip'
										>
											<rect
												x='0'
												y='0'
												width='100'
												height='55'
											/>
										</clipPath>
									</defs>
									<circle
										cx='55'
										cy='55'
										r='50'
									/>
									<circle
										className='snd__i_inner'
										clipPath='url(#sndReverseClip)'
										cx='55'
										cy='55'
										r='44'
									/>
									<image
										transform='rotate(-90 50 50)'
										xlinkHref={imageSoundOff}
										x='2'
										y='15'
										width='80'
										height='80'
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

SoundButton.propTypes = propTypes;
SoundButton.defaultProps = defaultProps;

function mapStateToProps(state) {
	const { isMuted } = state.sound;

	return { isMuted };
}

export default withCookies(connect(mapStateToProps)(SoundButton));