import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import { TweenMax } from 'gsap';
import { setLoaderPos } from 'redux/actions/preloaderActions';

import './MainSvgBlock.scss';

const propTypes = {
	position: PropTypes.oneOf(['tl', 'bl', 'tr', 'br']),
	image: PropTypes.string,
	alt: PropTypes.string,
	title: PropTypes.string,
	desc: PropTypes.string,
	isShow: PropTypes.bool,
	clickable: PropTypes.bool,
	dispatch: PropTypes.any,
	isShowLoader: PropTypes.bool
};
const defaultProps = {
	position: 'tl',
	image: null,
	alt: '',
	title: '',
	desc: '',
	isShow: false,
	clickable: true
};
const transforms = {
	tl: [186, 150],
	bl: [186, -150],
	tr: [-186, 150],
	br: [-186, -150]
};

class MainSvgBlock extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isHover: false,
			isStarted: false
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}

	componentDidMount() {
		this.setCircle();
		if (this.props.isShow) {
			this.hideCircle();
		}
		if (this.props.clickable) {
			this.startAnimate();
		}
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (curProps.isShow !== prevProps.isShow && curProps.isShow) {
			this.hideCircle();
		}

		if (curProps.clickable !== prevProps.clickable && curProps.clickable) {
			this.startAnimate();
		}
	}

	handleClick() {
		if (!this._icon) {
			return;
		}

		const el = this._icon;
		const { top, left, width, height } = el.getBoundingClientRect();
		const marginTop = height / 2;
		const marginLeft = width / 2;

		this.props.dispatch(setLoaderPos({ top, left, width, height, marginTop, marginLeft }));
	}

	handleMouseEnter() {
		this.setState({
			isHover: true
		});
		if (this.props.clickable) {
			this.showCircle();
		}
	}

	handleMouseLeave() {
		if (!this.props.isShowLoader) {
			this.setState({
				isHover: false
			});
		}
		if (this.props.clickable) {
			this.hideCircle();
		}
	}

	setCircle() {
		if (!this._circle) {
			return;
		}
		TweenMax.set(this._circle, {
			transform: 'translate(0, 0)'
		});
	}

	startAnimate() {
		this.setState({
			isStarted: true
		});
		if (this.state.isHover) {
			this.showCircle();
		}
	}

	hideCircle() {
		if (!this._circle && this.props.isShow) {
			return;
		}
		const { position } = this.props;
		const pos = transforms[position];

		TweenMax.to(this._circle, 0.4, {
			y: pos[1],
			x: pos[0]
		});
	}

	showCircle() {
		if (!this._circle && this.props.isShow) {
			return;
		}

		TweenMax.to(this._circle, 0.6, {
			y: 0,
			x: 0
		});
	}

	render() {
		const { position, image, alt, title, desc, isShow, isShowLoader } = this.props;
		const { isHover, isStarted } = this.state;
		const showClass = isShow ? ' show' : '';
		const hoverClass = (isHover && isStarted) ? ' hover' : '';
		const unloadClass = (isShowLoader && isHover) ? ' unload' : '';
		const symbolId = `main_figure_${position}`;
		const filterId = `shadow_filter_${position}`;
		const clipPathId = `clip_path_${position}`;
		const cirlePos = transforms[position];

		return (
			<div
				className={`m_svg_block ${position}${showClass}${unloadClass}${hoverClass}`}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onClick={this.handleClick}
			>
				<div
					className='icon_cirlce_wr'
					ref={(el) => {
						this._icon = el;
					}}
				>
					<div className='icon_cirlce'>
						<div className='icon'>
							<img src={image} alt={`${alt}`} />
						</div>
					</div>
				</div>
				<div className='msb__content'>
					<div className='msb__text'>
						{(position === 'bl' || position === 'br') && <div className='desc'>
							{Parser(desc)}
						</div>}
						<div className='title'>
							{title}
						</div>
						{(position === 'tl' || position === 'tr') && <div className='desc'>
							{Parser(desc)}
						</div>}
					</div>
				</div>
				<div className='svg_wr'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306'>
						<symbol id={`${symbolId}`}>
							<path
								d='m 9.09,151.45 83.33759,-144.344929 166.67517,8e-6 83.33758,144.344931 -83.33759,144.34493 -166.67517,0 z'
							/>
						</symbol>
						<filter
							style={{ colorInterpolationFilters: 'sRGB' }}
							id={`${filterId}`}
						>
							<feFlood
								floodOpacity='0.803922'
								floodColor='rgb(0,0,0)'
								result='flood'
							/>
							<feComposite
								in='flood'
								in2='SourceGraphic'
								operator='in'
								result='composite1'
							/>
							<feGaussianBlur
								in='composite1'
								stdDeviation='3'
								result='blur'
							/>
							<feOffset
								dx='0.1'
								dy='1.5'
								result='offset'
							/>
							<feComposite
								in='SourceGraphic'
								in2='offset'
								operator='over'
								result='composite2'
							/>
						</filter>
						<clipPath
							clipPathUnits='userSpaceOnUse'
							id={`${clipPathId}`}
						>
							<circle
								className='circle'
								cx='175'
								cy='153'
								r='270'
								transform={`translate(${cirlePos[0]}, ${cirlePos[1]})`}
								ref={(el) => {
									this._circle = el;
								}}
							/>
						</clipPath>
						<g className='main_figure' style={{ filter: `url(#${filterId})` }}>
							<use xlinkHref={`#${symbolId}`} />
						</g>
						<g
							className='circle_figure'
							clipPath={`url(#${clipPathId})`}
						>
							<use xlinkHref={`#${symbolId}`} />
						</g>
					</svg>
				</div>
			</div>
		);
	}

}

MainSvgBlock.propTypes = propTypes;
MainSvgBlock.defaultProps = defaultProps;

function mapStateToProps(state) {
	const { isShow: isShowLoader } = state.preloader;

	return { isShowLoader };
}

export default connect(mapStateToProps)(MainSvgBlock);