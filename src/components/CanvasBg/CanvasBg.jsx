/* global THREE:true */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TweenMax, Power2 } from 'gsap';
import * as colorSheme from 'etc/colorSheme.json';

import './CanvasBg.scss';

const propTypes = {
	type: PropTypes.oneOf(['page1', 'page2', 'page3', 'page4']),
	isShow: PropTypes.bool
};
const defaultProps = {
	type: 'page1',
	isShow: true
};

const bgPos = {
	page1: [
		[-6, -2, 0, 2, -2, -6], [-6, -1, 1, 2, -1, -5], [-6, 0, 1, 2, 1, -5],    [-6, 1, 0, 2, 2, -6], // menu [ xPos, yPos, colorType, delayType]
		[-7, -4, 1, 1, -7, -6], [-7, -2, 0, 0, -7, -2], [-7, 2, 0, 0, -7, 2],    [-7, 4, 1, 1, -7, 6],
		[-6, -5, 0, 1, -6, -6], [-6, -4, 0, 0, -6, -4],  [-6, 3, 0, 0, -6, -3],    [-6, 4, 0, 1, -6, -2],
		[-5, -4, 1, 0, -6, 1], [-5, -3, 1, 1, -6, 2], [-5, -2, 0, 0, -6, 3],  [-5, -1, 0, 1, -6, 5],  [-5, 2, 0, 0, -5, -5],   [-5, 3, 1, 1, -5, -4], [-5, 4, 0, 0, -5, -1],
		[-4, -6, 0, 0, -5, 0], [-4, -5, 1, 1, -5, 1], [-4, -4, 0, 0, -5, 2],  [-4, -3, 0, 1, -5, 4],  [-4, -1, 1, 0, -5, 5], [-4, 2, 0, 1, -9, -5, 2], [-4, 3, 0, 0, -4, -6], [-4, 4, 1, 1, -4, -5], [-4, 5, 0, 0, -4, 0],
		[-3, -5, 0, 0, -4, 1], [-3, -3, 0, 0, -4, 4], [-3, -1, 0, 0, -4, 5],   [-3, 2, 1, 0, -9, -4, 2], [-3, 4, 0, 1, -3, -5],
		[-2, -3, 1, 1, -3, 1], [-2, -1, 0, 1, -3, 5], [-2, 2, 0, 1, -9, -4, 2], [-2, 4, 1, 0, -2, 5],
		[-1, -4, 0, 1, -1, 5], [-1, -3, 0, 0, 0, -6], [-1, -2, 0, 1, 0, 5], [-1, -1, 1, 0, 1, 5], [-1, 2, 0, 0, 2, 5],  [-1, 3, 0, 0, 3, -5],  [-1, 4, 0, 0, 3, 5], [-1, 5, 1, 1, 3, 1],
		[0, -5, 0, 0, 4, -6],  [0, -4, 1, 1, 4, -5],  [0, -3, 0, 1, 4, 0],  [0, 2, 1, 1, 4, 1],   [0, 3, 0, 1, 4, 4],   [0, 4, 1, 1, 4, 5],
		[1, -3, 1, 0, 5, -5],  [1, 3, 1, 0, 5, -4],   [1, 4, 0, 0, 5, -1],
		[2, -5, 1, 1, 5, 0],  [2, -4, 0, 1, 5, 1],  [2, 3, 0, 1, 5, 2],   [2, 4, 1, 1, 5, 4],   [2, 5, 0, 0, 5, 5],
		[3, -6, 0, 0, 6, -6],  [3, -5, 0, 1, 6, -4],  [3, -4, 1, 0, 6, -3],  [3, 4, 0, 0, 6, -2],   [3, 5, 0, 1, 6, 1],
		[4, -5, 0, 0, 6, 2],  [4, -4, 0, 1, 6, 3],  [4, 3, 1, 1, 6, 5],   [4, 4, 1, 0, 7, -6],   [4, 5, 0, 1, 7, -4],
		[5, -5, 0, 0, 7, -3],  [5, -3, 1, 0, 7, -1],  [5, 3, 0, 0, 7, 1],   [5, 5, 0, 0, 7, 3],
		[6, -4, 1, 0, 7, 4],  [6, -3, 0, 1, 7, 6],  [6, 2, 0, 1, -5, 3],   [6, 3, 1, 0, 5, 3],
		[7, -4, 0, 1],  [7, -2, 0, 0],  [7, -1, 0, 1],  [7, 0, 1, 0],   [7, 1, 1, 1],   [7, 2, 1, 0]
	],
	page2: [
		[-6, -2, 0, 2, -2, -6], [-6, -1, 1, 2, -1, -5], [-6, 0, 1, 2, 1, -5],    [-6, 1, 0, 2, 2, -6], // menu [ xPos, yPos, colorType, delayType]
		[-7, -4, 1, 1, -7, -6], [-7, -2, 0, 0, -7, -2], [-7, 2, 0, 0, -7, 2],  [-7, 4, 1, 1, -7, 6],
		[-6, -5, 0, 1, -6, -6], [-6, -4, 0, 0, -6, -4], [-6, -3, 0, 1, -6, -3], [-6, 3, 0, 0, -6, -2],  [-6, 4, 0, 1, -6, 1],
		[-5, -4, 1, 0, -6, 2], [-5, -3, 1, 1, -6, 3], [-5, 2, 0, 0, -6, 5],  [-5, 3, 1, 1, -5, -5],  [-5, 4, 0, 0, -5, -4],
		[-4, -6, 0, 0, -5, -3], [-4, -5, 1, 1, -5, -2], [-4, -4, 0, 0, -5, -1], [-4, -3, 0, 1, -5, 0], [-4, 1, 0, 1, -5, 1], [-4, 4, 1, 1, -5, 2], [-4, 5, 0, 0, -5, 3],
		[-3, -5, 0, 0, -5, 4], [-3, -3, 0, 0, -5, 5], [-3, 2, 0, 1, -4, -6],  [-3, 3, 0, 0, -4, -5],  [-3, 4, 0, 1, -4, -2], [-3, 5, 0, 0, -4, -1],
		[-2, -5, 0, 0, -4, 3], [-2, -4, 1, 1, -4, 4], [-2, -3, 0, 0, -3, -5], [-2, 1, 1, 1, -3, -1],  [-2, 2, 0, 0, -3, 5], [-2, 4, 0, 0, -2, 5],
		[-1, -4, 1, 1, -1, 5], [-1, -3, 1, 0, 0, -6], [-1, 3, 0, 0, 0, 5],  [-1, 4, 1, 0, 1, 5],  [-1, 5, 1, 1, 2, 5],
		[0, -4, 0, 1, 3, -5],  [0, -3, 0, 1, 3, -1],  [0, -2, 0, 0, 3, 5],  [0, 3, 0, 1, 4, -6],   [0, 4, 0, 1, 4, -5],   [0, 5, 0, 1, 4, -2],
		[1, -6, 1, 0, 4, -1],  [1, -5, 0, 1, 4, 3],  [1, -4, 0, 0, 4, 4],  [1, -3, 1, 1, 5, -5],  [1, 3, 1, 0, 5, -4],  [1, 4, 0, 0, 5, -3],  [1, 5, 1, 1, 5, -2],
		[2, -5, 0, 0, 5, -1],  [2, -3, 1, 0, 5, 0],  [2, 1, 1, 0, 5, 1],   [2, 2, 0, 0, 5, 2],   [2, 4, 0, 1, 5, 3],
		[3, -5, 0, 1, 5, 4],  [3, -4, 0, 0, 5, 5],  [3, -3, 0, 1, 6, -6],  [3, 2, 0, 0, 6, -4],   [3, 3, 0, 1, 6, -3],  [3, 5, 0, 1, 6, -2],
		[4, -6, 1, 1, 6, 1],  [4, -5, 0, 0, 6, 2],  [4, -4, 0, 1, 6, 3],  [4, -3, 0, 0, 6, 5],  [4, 1, 1, 0, 7, -6],  [4, 3, 0, 0, 7, 2],  [4, 4, 1, 0, 7, -2],  [4, 5, 0, 1, 7, 6],
		[5, -5, 0, 0],  [5, -3, 1, 0],  [5, 2, 0, 1],   [5, 3, 0, 0],   [5, 4, 0, 1],  [5, 5, 0, 0],
		[6, -5, 0, 1],  [6, -4, 1, 0],  [6, -3, 0, 1],  [6, 2, 0, 1],   [6, 3, 1, 0],
		[7, -3, 0, 1],  [7, -2, 0, 0],  [7, -1, 0, 1],  [7, 0, 1, 0],   [7, 1, 1, 1],  [7, 2, 1, 0]
	],
	page3: [
		[-6, -2, 0, 2, -2, -6], [-6, -1, 1, 2, -1, -5], [-6, 0, 1, 2, 1, -5],    [-6, 1, 0, 2, 2, -6], // menu [ xPos, yPos, colorType, delayType]
		[-7, -4, 1, 1, -7, -6], [-7, -2, 0, 0, -7, -2], [-7, 2, 0, 0, -7, 2],  [-7, 4, 1, 1, -7, 6],
		[-6, -5, 0, 1, -6, -6], [-6, -4, 0, 0, -6, -4], [-6, 3, 0, 0, -6, -3],  [-6, 4, 0, 1, -6, -2],
		[-5, -4, 0, 0, -6, 1], [-5, -3, 1, 1, -6, 2], [-5, -2, 0, 0, -6, 3]/* , [-5, 1, 0, 1] */,  [-5, 2, 0, 0, -6, 5],  [-5, 3, 1, 1, -5, -5], [-5, 4, 1, 0, -5, -4],
		[-4, -6, 0, 0, -5, -3], [-4, -5, 1, 1, -5, -2], [-4, -4, 0, 0, -5, -1], [-4, -3, 1, 0, -5, 0],  [-4, 2, 0, 1, -5, 1], [-4, 3, 0, 0, -5, 2], [-4, 4, 1, 1, -5, 3], [-4, 5, 0, 0, -5, 4],
		[-3, -4, 0, 1, -5, 5], [-3, -2, 0, 0, -4, -6], [-3, -1, 0, 1, 10, 10, 1],  [-3, 3, 0, 0, -4, -5],  [-3, 5, 0, 1, -4, -4],
		[-2, -5, 1, 1, -4, -2], [-2, -3, 0, 1, 10, 10, 2], [-2, -2, 0, 1, 10, 10, 1],  [-2, 2, 1, 0, 10, 10, 1],  [-2, 3, 0, 1, 10, 10, 2],
		[-1, -5, 1, 0, -4, -1], [-1, -4, 0, 1, -4, 0], [-1, -3, 0, 0, -4, 3], [-1, -2, 0, 0, -4, 4], [-1, 2, 0, 0, 10, 10, 1],  [-1, 3, 0, 0, -3, -5],  [-1, 4, 0, 0, -3, 0],
		[0, -5, 1, 0, -3, 5],  [0, -4, 0, 1, -2, 5],  [0, -3, 1, 1, -1, 5],  [0, 2, 0, 1, 10, 10, 1],   [0, 3, 1, 1, 0, -6],   [0, 4, 0, 1, 0, 5],
		[1, -4, 0, 1, 1, 5],  [1, -3, 1, 0, 2, 5],  [1, 3, 1, 0, 3, -5],
		[2, -6, 0, 0, 3, 0],  [2, -5, 1, 1, 3, 5],  [2, -4, 0, 1, 4, -6],  [2, 3, 0, 1, 4, -5],   [2, 4, 1, 1, 4, -4],
		[3, -5, 0, 1, 4, -2],  [3, -4, 0, 0, 4, -1],  [3, 4, 1, 0, 4, 0],   [3, 5, 0, 1, 4, 3],   [3, 6, 0, 0, 4, 4],
		[4, -6, 0, 1, 5, -5],  [4, -5, 1, 0, 5, -4],  [4, -4, 1, 1, 5, -3],  [4, 3, 0, 1, 5, -2],   [4, 4, 0, 0, 5, -1],
		[5, -5, 0, 0, 5, 0],  [5, -3, 0, 0, 5, 1],  [5, 3, 1, 0, 5, 2],   [5, 5, 0, 0, 5, 3],
		[6, -4, 1, 0, 5, 4],  [6, -3, 0, 1, 5, 5],  [6, 2, 0, 1, 6, -6],   [6, 3, 1, 0, 6, -4],
		[7, -4, 0, 1, 6, -3],  [7, -2, 0, 0, 6, -2],  [7, -1, 1, 1, 6, 1],  [7, 0, 1, 0, 6, 2],   [7, 1, 1, 1, 6, 3],   [7, 2, 0, 0, 6, 5],
		[8, -8, 0, 1, 7, -6],  [8, -8, 0, 0, 7, -2],  [8, -8, 0, 1, 7, 2],  [8, -8, 0, 1, 7, 6]
	],
	page4: [
		[-6, -2, 0, 2, -2, -6], [-6, -1, 1, 2, -1, -5], [-6, 0, 1, 2, 1, -5],    [-6, 1, 0, 2, 2, -6], // menu [ xPos, yPos, colorType, delayType]
		[-7, -4, 1, 1, -7, -6], [-7, -2, 0, 0, -7, -2], [-7, 2, 0, 0, -7, 2],  [-7, 4, 1, 1, -7, 6],
		[-6, -5, 0, 1, -6, -6], [-6, -4, 0, 0], [-6, -3, 0, 1, -6, -3], [-6, 3, 0, 0, -6, -2],  [-6, 4, 0, 1, -6, 1],
		[-5, -4, 1, 0, -6, 2], [-5, -3, 1, 1, -6, 3], [-5, -2, 0, 0, -6, 5], [-5, 2, 0, 0, -5, -5],  [-5, 3, 1, 1, -5, -4],  [-5, 4, 0, 0, -5, -3],
		[-4, -6, 0, 0, -5, -2], [-4, -5, 1, 1, -5, -1], [-4, -4, 0, 0, -5, 0], [-4, -3, 0, 1, -5, 1], [-4, 2, 1, 0, -5, 2], [-4, 4, 1, 1, -5, 3], [-4, 5, 0, 0, -5, 4],
		[-3, -5, 0, 0, -5, 5], [-3, -3, 0, 0, -4, -6], [-3, -2, 0, 1, -3, -4], [-3, 2, 0, 1, -3, -3],  [-3, 3, 0, 0, -4, -3],  [-3, 4, 0, 1, -4, -1], [-3, 5, 0, 0, -4, 0],
		[-2, -5, 0, 0, -4, 1], [-2, -4, 1, 1, -3, -5], [-2, -3, 0, 0, -4, 2], [-2, 2, 0, 0, -4, 3], [-2, 4, 0, 0, -4, 4],
		[-1, -4, 1, 1, -3, 0], [-1, -3, 1, 0, -3, 5], [-1, 3, 0, 0, -2, 5],  [-1, 4, 1, 0, -1, 5],  [-1, 5, 1, 1, 0, 5],
		[0, -4, 0, 1, 0, -6],  [0, 3, 0, 1, 1, 5],   [0, 4, 0, 1, 2, 5],   [0, 5, 0, 1, 3, -5],
		[1, -6, 1, 0, 3, -4],  [1, -5, 0, 1, 3, -3],  [1, -4, 0, 0, 3, 0],  [1, -3, 1, 1, 3, 5],  [1, 3, 1, 0, 4, -6],  [1, 4, 0, 0, 4, -3],  [1, 5, 1, 1, 4, -1],
		[2, -5, 0, 0, 4, 0],  [2, -3, 1, 0, 4, 1],  [2, 2, 0, 0, 4, 2],   [2, 4, 0, 1, 4, 3],
		[3, -5, 0, 1, 4, 4],  [3, -4, 0, 0, 5, -5],  [3, -3, 0, 1, 5, -4],  [3, -2, 0, 0, 5, -3],  [3, 2, 0, 0, 5, -2],   [3, 3, 0, 1, 5, -1],  [3, 5, 0, 1, 5, 0],
		[4, -6, 1, 1, 5, 1],  [4, -5, 0, 0, 5, 2],  [4, -4, 0, 1, 5, 3],  [4, -3, 0, 0, 5, 4],  [4, 2, 1, 1, 5, 5],  [4, 3, 0, 0, 6, -6],  [4, 4, 1, 0, 6, -3],  [4, 5, 0, 1, 6, -2],
		[5, -5, 0, 0, 6, 1],  [5, -3, 1, 0, 6, 2],  [5, 3, 0, 0, 6, 3],   [5, 4, 0, 1, 6, 5],  [5, 5, 0, 0, 7, -6],
		[6, -5, 0, 1, 7, -2],  [6, -4, 1, 0, 7, 2],  [6, -3, 0, 1, 7, 6],  [6, 2, 0, 1],   [6, 3, 1, 0],
		[7, -3, 0, 1, -4, -4],  [7, -2, 0, 0, 4, -4],  [7, -1, 0, 1],  [7, 0, 1, 0],   [7, 1, 1, 1],  [7, 2, 1, 0]
	]
};


class CanvasBg extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isSHorizDevice: false,
			isVertical: false
		};

		this._groups = [];
		this._scales = {
			l0: 0, l1: 0, l2: 0
		};
		this._isAnim = true;

		this.canvasAnimate = this.canvasAnimate.bind(this);
		this.canvasResize = this.canvasResize.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		this.renderCanvas();
		if (this.props.isShow) {
			this.startAnimation();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const curProps = this.props;
		const curState = this.state;

		if (curProps.isShow !== prevProps.isShow) {
			if (curProps.isShow) {
				this.startAnimation();
			} else {
				this.stopAnimation();
			}
		}

		if (curState.isVertical !== prevState.isVertical) {
			this.changeOrientation();
		}

		if (curState.isSHorizDevice !== prevState.isSHorizDevice) {
			this.hideOnSmallHorizontal();
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		window.removeEventListener('resize', this.canvasResize, false);
		this._scene = null;
		this._renderer = null;
		this._camera = null;
	}

	changeOrientation() {
		const { isVertical } = this.state;

		for (let i = 0; i < this._groups.length; i++) {
			const group = this._groups[i];
			const x = 192;
			const y = 111;
			const hPos = group._horiz;
			const vPos = group._vert;
			let px = isVertical ? vPos[0] : hPos[0];
			let py = isVertical ? vPos[1] : hPos[1];

			if (typeof px === 'undefined' || typeof py === 'undefined') {
				px = 10;
				py = 10;
			}

			group.position.x = x * px;

			if (px % 2 === 0) {
				group.position.y = y * (py * 2 + 1);
			} else {
				group.position.y = y * (py * 2);
			}
		}
	}

	hideOnSmallHorizontal() {
		const { isSHorizDevice } = this.state;

		for (let i = 0; i < this._groups.length; i++) {
			const group = this._groups[i];
			const isHide = group._hideOnSmall;
			const isShow = group._showOnSmall;

			if (isHide) {
				group.traverse((node) => {
					if (node.material) {
						node.material = node.material.clone();
						node.material.transparent = true;
						node.material.opacity = isSHorizDevice ? 0 : 1;
						node.material.needsUpdate = true;
					}
				});
			}
			if (isShow) {
				group.traverse((node) => {
					if (node.material) {
						node.material = node.material.clone();
						node.material.transparent = true;
						node.material.opacity = isSHorizDevice ? 1 : 0;
						node.material.needsUpdate = true;
					}
				});
			}
		}
	}

	canvasAnimate() {
		if (!this._isMounted) {
			return;
		}
		try {
			if (this._isAnim) {
				const scales = this._scales;

				for (let i = 0; i < this._groups.length; i++) {
					const group = this._groups[i];
					const pos = group._pos;
					const key = `l${pos}`;

					if (scales[key]) {
						group.scale.x = group.scale.y = group.scale.z = scales[key];
					}
				}
			}

			this._renderer.render(this._scene, this._camera);
			requestAnimationFrame(this.canvasAnimate);
		} catch (err) {
			console.log('webgl error');
		}
	}

	canvasInit() {
		const { type } = this.props;
		const pageBg = bgPos[type];
		const pageColors = colorSheme[type];
		const wWidth = window.innerWidth;
		const wHeight = window.innerHeight;
		// const maxSize = Math.max(window.innerWidth, window.innerHeight);
		const aspect = wWidth / 1280;
		const hAspect = wHeight / 1280;
		// const frustumSize = wWidth / wHeight * 2 / aspect;

		if (wHeight > wWidth) {
			this._camera = new THREE.OrthographicCamera(wWidth / -1 / hAspect * 1.044, wWidth / 1 / hAspect * 1.044, wWidth / 1 / aspect * 1.044, wWidth / -1 / aspect * 1.044, 1, 2000);
		} else {
			this._camera = new THREE.OrthographicCamera(wWidth / aspect / -1, wWidth / aspect / 1, wHeight / aspect / 1, wHeight / aspect / -1, 1, 2000);
		}
		this._camera.position.x = 0;
		this._camera.position.z = 500;
		this._scene = new THREE.Scene();

		this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas,  antialias: true, alpha: true });
		this._renderer.setPixelRatio(window.devicePixelRatio);
		this._renderer.setSize(wWidth, wHeight);

		const geometry = new THREE.CircleBufferGeometry(127, 6);
		const geometryInner = new THREE.CircleBufferGeometry(121, 6);
		const texture = new THREE.Texture(this.createRadialGradient());

		texture.needsUpdate = true;

		const material = new THREE.MeshBasicMaterial({ color: pageColors[1] });
		const materialWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const materialGrad = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });

		/* material.transparent = true;
		materialWhite.transparent = true;
		materialGrad.transparent = true;
		material.opacity = 0.7;
		materialWhite.opacity = 0.6;
		materialGrad.opacity = 0.6; */

		const x = 192;
		const y = 111;

		for (let i = 0; i < pageBg.length; i++) {
			const params = pageBg[i];
			const group = new THREE.Group();
			const circle = new THREE.Mesh(geometry, material);
			const materialInner = params[2] === 1 ? materialGrad : materialWhite;
			const circleInner = new THREE.Mesh(geometryInner, materialInner);
			const px = params[0];
			const py = params[1];

			group.add(circle);
			group.add(circleInner);
			group.position.x = x * px;

			if (px % 2 === 0) {
				group.position.y = y * (py * 2 + 1);
			} else {
				group.position.y = y * (py * 2);
			}
			group.scale.x = group.scale.y = group.scale.z = 0.001;
			group._pos = params[3];

			group._horiz = [params[0], params[1]];
			group._vert = [params[4], params[5]];

			if (params[6] && params[6] === 1) {
				group._hideOnSmall = true;
			} else {
				group._hideOnSmall = false;
			}
			if (params[6] && params[6] === 2) {
				group._showOnSmall = true;
				group.traverse((node) => {
					if (node.material) {
						node.material = node.material.clone();
						node.material.transparent = true;
						node.material.opacity = this.state.isSHorizDevice ? 1 : 0;
						node.material.needsUpdate = true;
					}
				});
			} else {
				group._showOnSmall = false;
			}
			this._groups.push(group);
			this._scene.add(group);
		}

		// const gridHelper = new THREE.GridHelper(frustumSize, 22, 10);

		// gridHelper.rotation.x = -90 * Math.PI / 180;
		// this._scene.add(gridHelper);

		this._camera.lookAt(this._scene.position);

		if (wHeight > wWidth) {
			this.setState({
				isVertical: true
			});
		}

		if (wHeight < wWidth && wWidth < 980) {
			this.setState({
				isSHorizDevice: true
			});
		}
		window.addEventListener('resize', this.canvasResize, false);
	}

	canvasResize() {
		if (!this._camera || !this._renderer) {
			return;
		}
		try {
			const wWidth = window.innerWidth;
			const wHeight = window.innerHeight;
			// const maxSize = Math.max(window.innerWidth, window.innerHeight);
			const aspect = wWidth / 1280;
			const hAspect = wHeight / 1280;
			// const frustumSize = maxSize * 2 / aspect;

			if (wHeight > wWidth) {
				this._camera.left = wWidth / -1 / hAspect * 1.044;
				this._camera.right = wWidth / 1 / hAspect * 1.044;
				this._camera.top = wWidth / 1 / aspect * 1.044;
				this._camera.bottom = wWidth / -1 / aspect * 1.044;
			} else {
				this._camera.left = wWidth / -1 / aspect;
				this._camera.right = wWidth / 1 / aspect;
				this._camera.top = wHeight / 1 / aspect;
				this._camera.bottom = wHeight / -1 / aspect;
			}

			this._camera.updateProjectionMatrix();
			this._renderer.setSize(wWidth, wHeight);

			this.setState({
				isSHorizDevice: (wHeight < wWidth && wWidth < 980),
				isVertical: (wHeight > wWidth)
			});
		} catch (err) {
			console.log('resize canvas error');
		}
	}

	createRadialGradient() {
		const size = 128;
		const canvas = document.createElement('canvas');
		const { type } = this.props;
		const pageColors = colorSheme[type];

		canvas.width = size;
		canvas.height = size;

		const context = canvas.getContext('2d');
		const gradient = context.createRadialGradient(size / 2, size / 2, size / 3.4, size / 2, size / 2, size / 2.1);

		context.rect(0, 0, size, size);

		gradient.addColorStop(0, '#ffffff');
		gradient.addColorStop(1, pageColors[0]);
		context.fillStyle = gradient;
		context.fill();

		return canvas;
	}

	startAnimation() {
		const _this = this;

		TweenMax.to(this._scales, 1, {
			l2 : 1,
			ease: Power2.easeOut,
			delay: 0,
			onStart: () => {
				_this._isAnim = true;
			}
		});
		TweenMax.to(this._scales, 1, {
			l0 : 1,
			ease: Power2.easeOut,
			delay: 0.2
		});
		TweenMax.to(this._scales, 1, {
			l1 : 1,
			ease: Power2.easeOut,
			delay: 0.4,
			onComplete: () => {
				_this._isAnim = false;
			}
		});

		clearTimeout(this._animTimeout);
		clearInterval(this._animInterval);
		this._animTimeout = setTimeout(() => {
			TweenMax.to(_this._scales, 2, {
				l0 : 0.6,
				ease: Power2.easeIn,
				onStart: () => {
					_this._isAnim = true;
				},
				onComplete: () => {
					TweenMax.to(_this._scales, 2, {
						l0 : 1,
						ease: Power2.easeOut
					});
				}
			});
			TweenMax.to(_this._scales, 2, {
				l1 : 0.6,
				ease: Power2.easeIn,
				delay: 0.7,
				onComplete: () => {
					TweenMax.to(_this._scales, 2, {
						l1 : 1,
						ease: Power2.easeOut,
						onComplete: () => {
							_this._isAnim = false;
						}
					});
				}
			});
			this._animInterval = setInterval(() => {
				TweenMax.to(_this._scales, 2, {
					l0 : 0.6,
					ease: Power2.easeIn,
					onStart: () => {
						_this._isAnim = true;
					},
					onComplete: () => {
						TweenMax.to(_this._scales, 2, {
							l0 : 1,
							ease: Power2.easeOut
						});
					}
				});
				TweenMax.to(_this._scales, 2, {
					l1 : 0.6,
					ease: Power2.easeIn,
					delay: 0.7,
					onComplete: () => {
						TweenMax.to(_this._scales, 2, {
							l1 : 1,
							ease: Power2.easeOut,
							onComplete: () => {
								_this._isAnim = false;
							}
						});
					}
				});
			}, 10000);
		}, 6000);
	}

	stopAnimation() {
		clearTimeout(this._animTimeout);
		clearInterval(this._animInterval);
		TweenMax.set(this._scales, {
			l0 : 0,
			l1 : 0,
			l2 : 0
		});
	}

	renderCanvas() {
		if (!this._canvas) {
			return;
		}

		this.canvasInit();
		this.canvasAnimate();
	}

	render() {
		return (
			<div className='canvas_bg'>
				<canvas
					ref={el => {
						this._canvas = el;
					}}
				/>
			</div>
		);
	}

}

CanvasBg.propTypes = propTypes;
CanvasBg.defaultProps = defaultProps;

export default CanvasBg;