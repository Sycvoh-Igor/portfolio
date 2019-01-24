import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { TweenMax, TimelineMax, Power2, Power0 } from 'gsap';
import image1 from 'images/infogram/html.svg';
import image2 from 'images/infogram/css.svg';
import image3 from 'images/infogram/js.svg';
import image4 from 'images/infogram/php.svg';
import image5 from 'images/infogram/python.svg';
import image6 from 'images/infogram/etc.svg';


import './InfogramSheme.scss';

const propTypes = {
	isActive: PropTypes.bool,
	isMuted: PropTypes.bool,
	current: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
	data: PropTypes.array
};
const defaultProps = {
	isActive: false,
	current: 0,
	data: []
};

class InfogramSheme extends Component {

	constructor(props) {
		super(props);

		this._maxItems = 6;
		this._items = [];
		this._tls = [];
	}

	componentDidMount() {
		this._isMounted = true;

		this.setupAnimation();

		const audioUp = new Audio();

		audioUp.volume = 0.06;
		audioUp.muted = this.props.isMuted;
		this._audioUp = audioUp;

		audioUp.onerror = () => {
			this._audioUp = null;
		};

		audioUp.src = '/media/audio/up2.mp3';
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (curProps.isActive !== prevProps.isActive && curProps.isActive) {
			this.changeSlides(curProps.current, null);
		}
		if (curProps.current !== prevProps.current && curProps.isActive) {
			this.changeSlides(curProps.current, prevProps.current);
		}

		if (this._audioUp && curProps.isMuted !== prevProps.isMuted) {
			this._audioUp.muted = curProps.isMuted;
		}
	}

	componentWillUnmount() {
		this._isMounted = false;

		for (let i = 0; i < this._tls.length; i++) {
			this._tls[i].kill();
		}
		clearTimeout(this._audioTimeOut);
		if (this._audioUp) {
			this._audioUp.pause();
		}
	}

	setupAnimation() {
		if (!this._svg) {
			return;
		}

		const { data } = this.props;

		for (let i = 0; i < this._items.length; i++) {
			const item = this._items[i];
			const mPath = item.querySelectorAll('.m_path path');
			const headI = item.querySelectorAll('.is__head .icon');
			const headT = item.querySelectorAll('.is__head text');
			const itemI = item.querySelectorAll('.is__item_h path');
			const itemT = item.querySelectorAll('.is__item_h text');
			const segmC = item.querySelectorAll('.is__item_m circle');
			const segmT = item.querySelectorAll('.is__item_m text');
			const segments = item.querySelectorAll('.is__item_m');
			let maxL = 0;

			for (let j = 0; j < mPath.length; j++) {
				const p = mPath[j];
				const tL = p.getTotalLength();

				if (maxL < tL) maxL = tL;
			}

			TweenMax.set(headI, {
				scale: 0,
				svgOrigin: '260 30'
			});

			TweenMax.set(headT, {
				y: 10,
				opacity: 0
			});

			TweenMax.set(mPath, {
				strokeDasharray: maxL,
				strokeDashoffset: maxL
			});

			for (let k = 0; k < itemI.length; k++) {
				const icon = itemI[k];
				const x = icon.getAttribute('data-x');
				const y = icon.getAttribute('data-y');

				TweenMax.set(icon, {
					scale: 0,
					svgOrigin: `${x} ${y}`
				});
			}

			TweenMax.set(itemT, {
				y: 5,
				opacity: 0
			});

			TweenMax.set(segmC, {
				scale: 0,
				transformOrigin: '50% 50%'
			});

			TweenMax.set(segmT, {
				y: 5,
				opacity: 0
			});

			for (let j = 0; j < segments.length; j++) {
				const segm = segments[j];
				const paths = segm.querySelectorAll('.in_path path');
				let maxSL = 0;

				for (let k = 0; k < paths.length; k++) {
					const p = paths[k];
					const tSL = p.getTotalLength();

					if (maxSL < tSL) maxSL = tSL;
				}

				TweenMax.set(paths, {
					strokeDasharray: maxSL,
					strokeDashoffset: maxSL
				});
			}
		}

		for (let i = 0; i < data.length && i < this._maxItems; i++) {
			this.setupTimeLine(i);
		}
	}

	setupTimeLine(key) {
		const tl = new TimelineMax({
			paused: true
		});
		const item = this._items[key];
		const headI = item.querySelectorAll('.is__head .icon');
		const headT = item.querySelectorAll('.is__head text');
		const mPath = item.querySelectorAll('.m_path path');
		const parts = item.querySelectorAll('.is__item');
		const mSpeed = 0.7;
		let delay = 1;

		tl.to(headI, 0.9 * mSpeed, {
			scale: 1,
			ease: Power2.easeOut
		}, `${delay}`);
		tl.to(headT, 0.5 * mSpeed, {
			y: 0,
			opacity: 1,
			ease: Power2.easeIn
		}, `${delay}`);

		let mT = 0;

		for (let i = 0; i < mPath.length; i++) {
			const p = mPath[i];
			const tL = p.getTotalLength();
			const cT = tL / 100 * mSpeed;

			if (mT < cT) mT = cT;
		}

		delay += 0.35;
		tl.to(mPath, mT, {
			strokeDashoffset: 0,
			ease: Power0.easeNone
		}, `${delay}`);

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const mP = part.querySelector('.m_path path');
			const tL = mP.getTotalLength();
			const partI = part.querySelectorAll('.is__item_h path');
			const partT = part.querySelectorAll('.is__item_h text');
			const segments = part.querySelectorAll('.is__item_m');
			const paths = part.querySelectorAll('.in_path path');

			const t = tL / 100 * mSpeed;

			tl.to(partI, 0.8, {
				scale: 1,
				ease: Power2.easeOut
			}, `${delay + t}`);
			tl.to(partT, 0.5, {
				y: 0,
				opacity: 1,
				ease: Power2.easeIn
			}, `${delay + t}`);

			let mST = 0;

			for (let j = 0; j < paths.length; j++) {
				const p = paths[j];
				const tSL = p.getTotalLength();
				const cST = tSL / 100 * mSpeed;

				if (mST < cST) mST = cST;
			}

			tl.to(paths, mST, {
				strokeDashoffset: 0,
				ease: Power0.easeNone
			}, `${delay + t}`);

			for (let j = 0; j < segments.length; j++) {
				const segm = segments[j];
				const mSP = segm.querySelector('.in_path path');
				const tSL = mSP.getTotalLength();
				const segmC = segm.querySelectorAll('circle');
				const segmT = segm.querySelectorAll('text');
				const tS = tSL / 100 * mSpeed;

				tl.to(segmC, 0.4, {
					scale: 1,
					ease: Power2.easeOut
				}, `${delay + t + tS}`);

				tl.to(segmT, 0.4, {
					y: 0,
					opacity: 1,
					ease: Power2.easeIn
				}, `${delay + t + tS}`);
			}
		}


		this._tls[key] = tl;
	}

	changeSlides(cur, prev) {
		const tl = this._tls[cur];

		if (prev !== null) {
			const tlPrev = this._tls[prev];

			if (tlPrev) {
				clearTimeout(this._audioTimeOut);
				if (this._audioUp) this._audioUp.pause();
				tlPrev.pause();
				tlPrev.timeScale(tlPrev.totalTime() * tlPrev.progress() / 1.1);
				tlPrev.reverse();
			}
		}
		if (tl) {
			const dur = tl.duration();
			let rate = 1.8 / dur;

			if (rate < 0.5) rate = 0.5;

			this._audioTimeOut = setTimeout(() => {
				if (this._audioUp) {
					this._audioUp.currentTime = 0;
					this._audioUp.playbackRate = rate;
					this._audioUp.play();
				}
			}, 600);
			tl.timeScale(1);
			tl.play();
		}
	}

	generateDX(len, d) {
		let dx = '';

		for (let i = 0; i < len; i++) {
			if (i === 0) {
				dx += '0';
			} else {
				dx += ` ${d}`;
			}
		}

		return dx;
	}

	dotPath(arr) {
		const d  = 12;
		const dx = 6;
		const dy = 10.4;
		const x = arr[0];
		const y = arr[1];

		return `M ${x - d} ${y} L ${x - dx} ${y - dy} L ${x + dx} ${y - dy} L ${x + d} ${y} L ${x + dx} ${y + dy} L ${x - dx} ${y + dy} Z`;
	}

	renderSegments(segments, lastPoint, dir) {
		if (!segments || !lastPoint) {
			return;
		}

		const sX = lastPoint[0];
		const sY = lastPoint[1];
		const anchor = (dir === -1) ? 'end' : 'start';

		return segments.map((s, key) => {
			return (
				<g className='is__item_m' key={s}>
					<g className='is__path in_path'>
						<path
							d={`M ${sX} ${sY} V ${sY + 28 + key * 24} H ${sX + 15 * dir}`}
						/>
					</g>
					<circle
						cx={`${sX + 15 * dir}`}
						cy={`${sY + 28 + key * 24}`}
						r='7'
					/>
					<text
						x={`${sX + 30 * dir}`}
						y={`${sY + 32.5 + key * 24}`}
						textAnchor={anchor}
					>
						{s}
					</text>
				</g>
			);
		});
	}

	renderItems(items) {
		if (!items) {
			return;
		}

		const lPoint = [290, 75];
		const rPoint = [230, 75];

		return items.map((item, key) => {
			let cPoint = lPoint;
			let dir = 1;
			let anchor = 'start';
			const len = item.segments ? item.segments.length : 0;
			const prevLen = (items[key - 1] && items[key - 1].segments) ? items[key - 1].segments.length : 0;
			const name = item.name;
			const delta = len ? 68 : 50;
			let step = (prevLen * 28 + delta) / 2;

			if (key === 0 || (items[key - 1] && (!items[key - 1].segments || !items[key - 1].segments.length))) {
				step = 50 / 2;
			}

			if (key % 2 !== 0) {
				cPoint = rPoint;
				dir = -1;
				anchor = 'end';
				lPoint[1] = rPoint[1] + step;
			} else {
				rPoint[1] = lPoint[1] + step;
			}
			const mainPath = `M 260 30 V ${cPoint[1]} H ${cPoint[0]}`;
			const prevPoint = cPoint.slice();

			return (
				<g className='is__item' key={key}>
					<g className='is__path m_path'>
						<path
							d={mainPath}
						/>
					</g>
					{this.renderSegments(item.segments, prevPoint, dir)}
					<g className='is__item_h'>
						<path
							data-x={prevPoint[0]}
							data-y={prevPoint[1]}
							d={this.dotPath(prevPoint)}
						/>
						<text
							x={`${prevPoint[0] + 18 * dir}`}
							y={`${prevPoint[1] + 5}`}
							dx={this.generateDX(name.length, 0.4)}
							textAnchor={anchor}
						>
							{name}
						</text>
					</g>
				</g>
			);
		});
	}

	renderData() {
		const { data, current, isActive } = this.props;
		const images = [image1, image2, image3, image4, image5, image6];

		if (!data) return;

		return data.map((item, key) => {
			const title = item.title;

			return (
				<CSSTransition
					key={key}
					in={(current === key && isActive)}
					timeout={{
						enter: 300,
						exit: 1200
					}}
					classNames='trans'
				>
					<g
						className='is__data'
						ref={(el) => {
							this._items[key] = el;
						}}
					>
						{this.renderItems(item.items)}
						<g className='is__head'>
							<g className='icon'>
								<circle
									cx='260'
									cy= '30'
									r='26'
								/>
								<image
									xlinkHref={images[key]}
									x='260'
									y='30'
									height='56'
									width='56'
									transform='translate(-28 -28)'
								/>
							</g>
							<text
								x='300'
								y='40'
								dx={this.generateDX(title.length, 1)}
							>
								{title}
							</text>
						</g>
					</g>
				</CSSTransition>
			);
		});
	}

	render() {
		return (
			<div className='infogram_sheme'>
				<div className='is__block_wr'>
					<div className='is__block'>
						<svg
							className='is__svg'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 520 310'
							ref={el => {
								this._svg = el;
							}}
						>
							{this.renderData()}
						</svg>
					</div>
				</div>
			</div>
		);
	}

}

InfogramSheme.propTypes = propTypes;
InfogramSheme.defaultProps = defaultProps;

function mapStateToProps(state) {
	const { isMuted } = state.sound;

	return { isMuted };
}

export default connect(mapStateToProps)(InfogramSheme);