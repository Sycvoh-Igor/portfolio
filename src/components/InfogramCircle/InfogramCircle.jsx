import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TweenMax, Power2, Power0, Power3 } from 'gsap';
import { mobileTabletCheck } from 'utils/isMobile';
import image1 from 'images/infogram/css.svg';
import image2 from 'images/infogram/html.svg';
import image3 from 'images/infogram/etc.svg';
import image4 from 'images/infogram/python.svg';
import image5 from 'images/infogram/php.svg';
import image6 from 'images/infogram/js.svg';
import imageFull1 from 'images/infogram/css-full.svg';
import imageFull2 from 'images/infogram/html-full.svg';
import imageFull3 from 'images/infogram/etc-full.svg';
import imageFull4 from 'images/infogram/python-full.svg';
import imageFull5 from 'images/infogram/php-full.svg';
import imageFull6 from 'images/infogram/js-full.svg';


import './InfogramCircle.scss';

const propTypes = {
	isActive: PropTypes.bool,
	isMuted: PropTypes.bool,
	onBeforeChange: PropTypes.func,
	onAfterChange: PropTypes.func
};
const defaultProps = {
	isActive: false,
	onBeforeChange: () => {},
	onAfterChange: () => {}
};

class InfogramCircle extends Component {

	constructor(props) {
		super(props);

		this.state = {
			curItem: -1,
			isChanging: false,
			isMobile: false
		};
		this._maxItems = 6;

		this.handleLeftClick = this.handleLeftClick.bind(this);
		this.handleLeftEnter = this.handleLeftEnter.bind(this);
		this.handleLeftLeave = this.handleLeftLeave.bind(this);
		this.handleRightClick = this.handleRightClick.bind(this);
		this.handleRightEnter = this.handleRightEnter.bind(this);
		this.handleRightLeave = this.handleRightLeave.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		this.setInfogram();

		if (this.props.isActive) {
			this.startInfogram();
		}

		const audio = new Audio();
		const audioDown = new Audio();

		audio.volume = 0.06;
		audio.muted = this.props.isMuted;
		this._audio = audio;

		audio.onerror = () => {
			this._audio = null;
		};

		audio.src = '/media/audio/click_2.mp3';

		audioDown.volume = 0.01;
		audioDown.muted = this.props.isMuted;
		this._audioDown = audioDown;

		audioDown.onerror = () => {
			this._audioDown = null;
		};

		audioDown.src = '/media/audio/down.mp3';

		this.setState({
			isMobile: mobileTabletCheck()
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const curProps = this.props;
		const curState = this.state;

		if (curState.curItem !== prevState.curItem) {
			if (!(curState.curItem === 0 && prevState.curItem >= this._maxItems) &&
				!(curState.curItem === this._maxItems - 1 && prevState.curItem < 0)) {
				this.animateInfogram(prevState.curItem, curState.curItem);
			} else if (curState.isChanging) {
				this.setState({
					isChanging: false
				});
			}
		}
		if (curProps.isActive !== prevProps.isActive) {
			if (curProps.isActive) {
				this.startInfogram();
			} else {
				this.setInfogram();
			}
		}

		if (this._audio && curProps.isMuted !== prevProps.isMuted) {
			this._audio.muted = curProps.isMuted;
		}

		if (this._audioDown && curProps.isMuted !== prevProps.isMuted) {
			this._audioDown.muted = curProps.isMuted;
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		clearInterval(this._interval);

		if (this._svg) {
			TweenMax.killChildTweensOf(this._svg);
		}
		if (this._audioDown) {
			this._audioDown.pause();
		}
	}

	handleLeftClick() {
		const { isChanging, curItem, isMobile } = this.state;

		if (isChanging) {
			return;
		}

		if (this._audio) {
			this._audio.currentTime = 0;
			this._audio.play();
		}

		const nextItem = curItem - 1;

		this.setState({
			curItem: nextItem,
			isChanging: 2
		});

		if (isMobile) {
			TweenMax.to(this._lArrow, 0.3, {
				x: -20,
				ease: Power0.easeNone,
				repeat: 1,
				yoyo: true
			});
		}
	}

	handleLeftEnter() {
		if (!this._lArrow || this.state.isMobile) {
			return;
		}
		TweenMax.to(this._lArrow, 0.6, {
			x: -20,
			ease: Power2.easeOut
		});
	}

	handleLeftLeave() {
		if (!this._lArrow || this.state.isMobile) {
			return;
		}
		TweenMax.to(this._lArrow, 0.6, {
			x: 0,
			ease: Power2.easeOut
		});
	}

	handleRightClick() {
		const { isChanging, curItem, isMobile } = this.state;

		if (isChanging) {
			return;
		}

		if (this._audio) {
			this._audio.currentTime = 0;
			this._audio.play();
		}

		const nextItem = curItem + 1;

		this.setState({
			curItem: nextItem,
			isChanging: true
		});

		if (isMobile) {
			TweenMax.to(this._rArrow, 0.3, {
				x: 20,
				ease: Power0.easeNone,
				repeat: 1,
				yoyo: true
			});
		}
	}

	handleRightEnter() {
		if (!this._rArrow || this.state.isMobile) {
			return;
		}
		TweenMax.to(this._rArrow, 0.6, {
			x: 20,
			ease: Power2.easeOut
		});
	}

	handleRightLeave() {
		if (!this._rArrow || this.state.isMobile) {
			return;
		}
		TweenMax.to(this._rArrow, 0.6, {
			x: 0,
			ease: Power2.easeOut
		});
	}

	setCurItem(num) {
		const { isChanging, curItem } = this.state;

		if (isChanging || num === curItem) {
			return;
		}

		this.setState({
			curItem: num,
			isChanging: true
		});
	}

	setInfogram() {
		const { curItem } = this.state;
		const circles = this._svg.querySelectorAll('.ic__averse');
		const smallCircles = this._svg.querySelectorAll('.ic__reverse');
		const path = this._svg.querySelectorAll('.ic__clip');
		const line = this._svg.querySelectorAll('.ic__angle path');
		const rightNav = this._svg.querySelectorAll('.ic__nav.right');
		const rightNavPath = this._svg.querySelectorAll('.ic__nav.right path');
		const leftNav = this._svg.querySelectorAll('.ic__nav.left');
		const leftNavPath = this._svg.querySelectorAll('.ic__nav.left path');

		TweenMax.set(path, {
			attr: {
				d: 'M 430 40 H 150 L 5000 40 Z'
			}
		});
		TweenMax.set(line, {
			attr: {
				d: 'M 430 40 H 150 L 5000 40'
			}
		});

		TweenMax.set(circles, {
			rotation: 60 * curItem,
			transformOrigin:'50% 50%'
		});

		TweenMax.set(smallCircles, {
			rotation: -60 * curItem,
			transformOrigin: '50% 50%'
		});

		TweenMax.set(rightNav, {
			x: -70
		});
		TweenMax.set(rightNavPath, {
			opacity: 0,
			attr: {
				d: 'M 360 24 H 407 L 360 24'
			}
		});
		TweenMax.set(leftNav, {
			x: 70
		});
		TweenMax.set(leftNavPath, {
			opacity: 0,
			attr: {
				d: 'M 225 24 H 178  L 225 24'
			}
		});
	}

	setTimer() {
		if (!this._timer) {
			return;
		}

		const _this = this;

		this.resetTimer();
		TweenMax.to(this._timer, 9, {
			strokeDashoffset: 0,
			ease: Power0.easeNone,
			onComplete: () => {
				const { isChanging, curItem } = _this.state;

				if (!isChanging && _this._isMounted) {
					_this.setCurItem(curItem + 1);
				}
			}
		});
	}

	resetTimer() {
		if (!this._timer) {
			return;
		}

		if (this._timer.getTotalLength) {
			const totalLength = this._timer.getTotalLength();

			TweenMax.set(this._timer, {
				strokeDasharray: totalLength,
				strokeDashoffset: totalLength
			});
		} else {
			TweenMax.set(this._timer, {
				opacity: 0
			});
		}
	}


	animateInfogram(cur, next) {
		const { curItem } = this.state;
		const { onBeforeChange, onAfterChange } = this.props;

		if (!this._svg) {
			return;
		}

		if (this._audioDown) {
			this._audioDown.currentTime = 0.3;
			this._audioDown.play();
		}

		this.setState({
			isChanging: true
		});

		let curSheme = cur < 0 ? this._maxItems - 1 : cur;
		let nextSheme = next < 0 ? this._maxItems - 1 : next;

		if (curSheme > this._maxItems - 1) curSheme = 0;
		if (nextSheme > this._maxItems - 1) nextSheme = 0;

		if (onBeforeChange) {
			onBeforeChange(curSheme, nextSheme);
		}

		const _this = this;
		const circles = this._svg.querySelectorAll('.ic__averse');
		const smallCircles = this._svg.querySelectorAll('.ic__reverse');

		TweenMax.to(circles, 1.2, {
			rotation: 60 * curItem,
			transformOrigin:'50% 50%',
			ease: Power3.easeInOut,
			onUpdate: () => {
				const rotation = _this._mCircle._gsTransform.rotation;

				TweenMax.set(smallCircles, {
					rotation: -rotation,
					transformOrigin: '50% 50%'
				});
			},
			onComplete: () => {
				let n = curItem >= this._maxItems ? 0 : curItem;

				if (curItem < 0) n = this._maxItems - 1;
				if (n === 0 || n === this._maxItems - 1) {
					TweenMax.set(circles, {
						rotation: n * 60,
						transformOrigin:'50% 50%'
					});
				}
				if (_this._isMounted) {
					if (onBeforeChange) {
						onAfterChange(nextSheme);
					}
					_this.setState({
						curItem: n,
						isChanging: false
					}, () => {
						_this.setTimer();
					});
				}
			}
		});
	}

	startInfogram() {
		const path = this._svg.querySelectorAll('.ic__clip');
		const line = this._svg.querySelectorAll('.ic__angle path');
		const rightNav = this._svg.querySelectorAll('.ic__nav.right');
		const rightNavPath = this._svg.querySelectorAll('.ic__nav.right path');
		const leftNav = this._svg.querySelectorAll('.ic__nav.left');
		const leftNavPath = this._svg.querySelectorAll('.ic__nav.left path');

		this.setInfogram();
		this.resetTimer();
		TweenMax.to(path, 1, {
			attr:{
				d: 'M 430 40 H 150 L 10 282.487 V 320 H 430 Z'
			},
			delay: 1.4,
			ease: Power3.easeOut
		});
		TweenMax.to(line, 1, {
			attr:{
				d: 'M 430 40 H 150 L 10 282.487'
			},
			delay: 1.4,
			ease: Power3.easeOut
		});
		this._startTimer = setTimeout(() => {
			if (this._isMounted) {
				this.setState({
					curItem: 0
				});
			}
		}, 1600);

		TweenMax.to(rightNav, 0.6, {
			x: 0,
			delay: 2.1,
			ease: Power2.easeInOut
		});
		TweenMax.to(rightNavPath, 0.6, {
			opacity: 1,
			attr: {
				d: 'M 360 24 H 407 L 397 6.5'
			},
			delay: 2.1,
			ease: Power2.easeInOut
		});
		TweenMax.to(leftNav, 0.6, {
			x: 0,
			delay: 2.1,
			ease: Power2.easeInOut
		});
		TweenMax.to(leftNavPath, 0.6, {
			opacity: 1,
			attr: {
				d: 'M 225 24 H 178 L 188 6.5'
			},
			delay: 2.1,
			ease: Power2.easeInOut
		});
	}

	renderItems() {
		const cx = 150;
		const cy = 40;
		const len = 210;
		const bR = 50;
		const sR = 38;
		const imageArr = [image1, image2, image3, image4, image5, image6];

		return imageArr.map((value, key) => {
			const deg = key * 60;
			const x = Math.round((cx + len * Math.cos(Math.PI / 180 * deg)) * 10) / 10;
			const y = Math.round((cy + len * Math.sin(Math.PI / 180 * deg)) * 10) / 10;

			return (
				<g
					className='ic__item ic__reverse'
					key={key}
					onClick={() => {
						const { curItem } = this.state;
						let next = 7 - key;

						if (next > 6) next = 1;
						if (curItem < 2 && next === 6) next = 0;
						if (curItem < 2 && next === 5) next = -1;
						this.setCurItem(next);
						if (this._audio) {
							this._audio.currentTime = 0;
							this._audio.play();
						}
					}}
				>
					<circle
						className='dark'
						cx={`${x}`}
						cy={`${y}`}
						r={`${bR + 4}`}
					/>
					<circle
						cx={`${x}`}
						cy={`${y}`}
						r={`${bR}`}
					/>
					<circle
						className='white'
						cx={`${x}`}
						cy={`${y}`}
						r={`${sR}`}
					/>
					<g className='ic__images'>
						<image
							xlinkHref={value}
							x={`${x}`}
							y={`${y}`}
							height='78'
							width='78'
							transform='translate(-39 -39)'
						/>
					</g>
				</g>
			);
		});
	}

	renderClipItems() {
		const cx = 150;
		const cy = 40;
		const len = 210;
		const bR = 50;
		const imageArr = [imageFull1, imageFull2, imageFull3, imageFull4, imageFull5, imageFull6];

		return imageArr.map((value, key) => {
			const deg = key * 60;
			const x = cx + len * Math.cos(Math.PI / 180 * deg);
			const y = cy + len * Math.sin(Math.PI / 180 * deg);

			return (
				<g className='ic__images ic__reverse' key={key}>
					<circle
						className='white'
						cx={`${x}`}
						cy={`${y}`}
						r={`${bR}`}
					/>
					<image
						xlinkHref={value}
						x={`${x}`}
						y={`${y}`}
						height='78'
						width='78'
						transform='translate(-39 -39)'
					/>
				</g>
			);
		});
	}

	render() {
		const { isActive } = this.props;
		const activeClass = isActive ? ' active' : '';

		return (
			<div className={`infogram_cirlce${activeClass}`}>
				<div className='ic__block_wr'>
					<div className='ic__block'>
						<svg
							className='ic__svg'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 430 310'
							ref={el => {
								this._svg = el;
							}}
						>
							<defs>
								<clipPath
									clipPathUnits='userSpaceOnUse'
									id='infogramMainClip'
								>
									<path
										className='ic__clip'
										d='M 430 40 H 150 L 10 282.487 V 320 H 430 Z'
									/>
								</clipPath>
								<clipPath
									clipPathUnits='userSpaceOnUse'
									id='infogramBigCircleClip'
								>
									<circle
										cx='150'
										cy='40'
										r='280'
									/>
								</clipPath>
								<clipPath
									clipPathUnits='userSpaceOnUse'
									id='infogramCircleClip'
								>
									<circle
										cx='255'
										cy='221.865'
										r='50'
									/>
								</clipPath>
								<filter
									style={{ colorInterpolationFilters: 'sRGB' }}
									id='infogramFilter'
								>
									<feFlood
										floodOpacity='0.96'
										floodColor='rgb(0, 0, 0)'
										result='flood'
									/>
									<feComposite
										in='flood'
										in2='SourceGraphic'
										operator='out'
										result='composite1'
									/>
									<feGaussianBlur
										in='composite1'
										stdDeviation='3'
										result='blur'
									/>
									<feOffset
										dx='0'
										dy='0'
										result='offset'
									/>
									<feComposite
										in='offset'
										in2='SourceGraphic'
										operator='in'
										result='composite2'
									/>
								</filter>
							</defs>
							<g clipPath='url(#infogramMainClip)'>
								<g
									className='ic__circles ic__averse'
									ref={el => {
										this._mCircle = el;
									}}
								>
									<circle
										cx='150'
										cy='40'
										r='210'
									/>
									{this.renderItems()}
								</g>
							</g>
							<g clipPath='url(#infogramMainClip)'>
								<g className='ic__current_inc'>
									<circle
										cx='255'
										cy='221.865'
										r='50'
									/>
								</g>
								<g clipPath='url(#infogramCircleClip)'>
									<g className='ic__averse'>
										{this.renderClipItems()}
									</g>
								</g>
							</g>
							<g className='ic__angle' clipPath='url(#infogramBigCircleClip)'>
								<path
									d='M 430 40 H 150 L 10 282.487'
								/>
							</g>
							<g clipPath='url(#infogramMainClip)'>
								<g className='ic__current'>
									<circle
										style={{
											filter: 'url(#infogramFilter)'
										}}
										cx='255'
										cy='221.865'
										r='50'
									/>
								</g>
								<g className='ic__current_out'>
									<circle
										cx='255'
										cy='221.865'
										r='49.7'
									/>
								</g>
								<g className='ic__timer'>
									<circle
										cx='255'
										cy='221.865'
										r='50'
										transform='rotate(-90, 255, 221.865)'
										ref={el => {
											this._timer = el;
										}}
									/>
								</g>
							</g>
							<g
								className='ic__nav right'
								onMouseEnter={this.handleRightEnter}
								onMouseLeave={this.handleRightLeave}
								onClick={this.handleRightClick}
							>
								<rect
									width='70'
									height='35'
									x='360'
									y='0'
								/>
								<path
									d='M 360 24 H 407 L 397 6.5'
									ref={el => {
										this._rArrow = el;
									}}
								/>
							</g>
							<g
								className='ic__nav left'
								onMouseEnter={this.handleLeftEnter}
								onMouseLeave={this.handleLeftLeave}
								onClick={this.handleLeftClick}
							>
								<rect
									width='70'
									height='35'
									x='155'
									y='0'
								/>
								<path
									d='M 225 24 H 178 L 188 6.5'
									ref={el => {
										this._lArrow = el;
									}}
								/>
							</g>
						</svg>
					</div>
				</div>
			</div>
		);
	}

}

InfogramCircle.propTypes = propTypes;
InfogramCircle.defaultProps = defaultProps;


function mapStateToProps(state) {
	const { isMuted } = state.sound;

	return { isMuted };
}

export default connect(mapStateToProps)(InfogramCircle);