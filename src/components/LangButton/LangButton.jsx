import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as navMenu from 'etc/navMenu.json';
import { mobileTabletCheck } from 'utils/isMobile';

import './LangButton.scss';

const propTypes = {
	colors: PropTypes.oneOf(['main', 'color1', 'color2', 'color3', 'color4']),
	isShow: PropTypes.bool,
	isMuted: PropTypes.bool,
	local: PropTypes.string,
	page: PropTypes.string
};
const defaultProps = {
	colors: 'main',
	isShow: true,
	local: 'ru',
	page: 'home'
};


class LangButton extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isActive: false,
			isMobile: false,
			isVertical: false,
			wHeight: 0
		};

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

		this.setState({
			isMobile: mobileTabletCheck()
		});

		this.handleResize();

		window.addEventListener('resize', this.handleResize, false);
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (this._audio && curProps.isMuted !== prevProps.isMuted) {
			this._audio.muted = curProps.isMuted;
		}
	}

	componentWillUnmount() {
		this._isMounted = false;

		window.removeEventListener('resize', this.handleResize);
	}

	handleClick(name, e) {
		const { local } = this.props;

		if (name && name === local) {
			e.preventDefault();
		}

		if (this._audio) {
			this._audio.currentTime = 0;
			this._audio.play();
		}

		this.setState({
			isActive: !this.state.isActive
		});
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
		const { colors, isShow, local, page } = this.props;
		const { isActive, isMobile, isVertical, wHeight } = this.state;
		const showClass = isShow ? ' show' : '';
		const mobClass  = isMobile ? ' mob' : '';
		const activeClass = isActive ? ' active' : '';

		const style = !isVertical ? null : {
			width: 0.085 * wHeight,
			top: 0.127 * wHeight,
			marginLeft: 0.144 * wHeight
		};

		return (
			<div
				className={`lng_btn ${colors}${showClass}${mobClass}${activeClass}`}
				style={style}
			>
				<div className='lng__skeleton'/>
				<div className='lng__content'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 350 306'
						className='lng__svg'
					>
						<path
							className='lng__svg_path'
							d='m 9.09,151.45 83.33759,-144.344929 166.67517,8e-6 83.33758,144.344931 -83.33759,144.34493 -166.67517,0 z'
						/>
					</svg>
					<Link
						className='lng__select'
						to={navMenu.ua[page].link}
						onClick={this.handleClick.bind(this, 'ua')}
					>
						ua
					</Link>
					<Link
						className='lng__select'
						to={navMenu.ru[page].link}
						onClick={this.handleClick.bind(this, 'ru')}
					>
						ru
					</Link>
					<Link
						className='lng__select'
						to={navMenu.en[page].link}
						onClick={this.handleClick.bind(this, 'en')}
					>
						en
					</Link>
					<div
						className='lng__circle'
						onClick={this.handleClick.bind(this, null)}
					>
						<div className='lng__icon_wr'>
							<div className='lng__icon'>
								<svg
									className='lng__i_svg'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 110 110'
								>
									<defs>
										<clipPath
											clipPathUnits='userSpaceOnUse'
											id='svgAverseClip'
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
										className='lng__i_inner'
										clipPath='url(#svgAverseClip)'
										cx='55'
										cy='55'
										r='44'
									/>
									<text
										x='55'
										y='65'
										textAnchor='middle'
										dx='0 6'
										dy='0 12'
									>
										{local}
									</text>
								</svg>
							</div>
							<div className='lng__icon reverse'>
								<svg
									className='lng__i_svg'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 110 110'
								>
									<defs>
										<clipPath
											clipPathUnits='userSpaceOnUse'
											id='svgReverseClip'
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
										className='lng__i_inner'
										clipPath='url(#svgReverseClip)'
										cx='55'
										cy='55'
										r='44'
									/>
									<path
										d='M 37 37 L 73 73'
									/>
									<path
										d='M 37 73 L 73 37'
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

LangButton.propTypes = propTypes;
LangButton.defaultProps = defaultProps;


function mapStateToProps(state) {
	const { isMuted } = state.sound;

	return { isMuted };
}

export default connect(mapStateToProps)(LangButton);