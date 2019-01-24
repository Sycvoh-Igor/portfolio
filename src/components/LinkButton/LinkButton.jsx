import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setLoaderPos } from 'redux/actions/preloaderActions';

import './LinkButton.scss';

const propTypes = {
	position: PropTypes.oneOf(['one', 'two', 'three', 'four']),
	colors: PropTypes.oneOf(['main', 'color1', 'color2', 'color3', 'color4']),
	image: PropTypes.string,
	alt: PropTypes.string,
	title: PropTypes.string,
	isShow: PropTypes.bool,
	clickable: PropTypes.bool,
	dispatch: PropTypes.any,
	isShowLoader: PropTypes.bool
};
const defaultProps = {
	position: 'one',
	colors: 'main',
	image: null,
	alt: '',
	title: '',
	isShow: false,
	clickable: true
};

class LinkButton extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isHover: false,
			isVertical: false,
			wHeight: 0
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		this.handleResize();

		window.addEventListener('resize', this.handleResize, false);
	}

	/* componentDidUpdate(prevProps) {
	} */

	componentWillUnmount() {
		this._isMounted = false;
		window.removeEventListener('resize', this.handleResize);
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
	}

	handleMouseLeave() {
		if (!this.props.isShowLoader) {
			this.setState({
				isHover: false
			});
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
		const { position, colors, title, image, isShow, isShowLoader } = this.props;
		const { isHover, isVertical, wHeight } = this.state;
		const showClass = isShow ? ' show' : '';
		const hoverClass = (isHover) ? ' hover' : '';
		const unloadClass = (isShowLoader && isHover) ? ' unload' : '';
		const style = !isVertical ? null : {
			width: 0.08 * wHeight
		};

		return (
			<div
				className={`link_btn ${position} ${colors}${showClass}${hoverClass}${unloadClass}`}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onClick={this.handleClick}
				style={style}
			>
				<div className='lb__skeleton'/>
				<div className='lb__content'>
					<div className='lb__text'>
						{title}
					</div>
					<div
						className='lb__circle'
						ref={(el) => {
							this._icon = el;
						}}
					>
						<div className='lb__icon_wr'>
							<div className='lb__icon'>
								<img src={image} alt='' />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

LinkButton.propTypes = propTypes;
LinkButton.defaultProps = defaultProps;

function mapStateToProps(state) {
	const { isShow: isShowLoader } = state.preloader;

	return { isShowLoader };
}

export default connect(mapStateToProps)(LinkButton);