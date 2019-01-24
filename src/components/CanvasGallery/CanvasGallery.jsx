/* global THREE:true */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TweenMax, Expo, Sine, Power2 } from 'gsap';
import Parser from 'html-react-parser';
import blurImage from 'utils/blur';
import { mobileTabletCheck } from 'utils/isMobile';
import { CSSTransition } from 'react-transition-group';

import './CanvasGallery.scss';

const propTypes = {
	isMuted: PropTypes.bool,
	isShow: PropTypes.bool,
	images: PropTypes.array,
	links: PropTypes.array,
	texts: PropTypes.array,
	initialSlide: PropTypes.number,
	firstLoad: PropTypes.bool,
	local: PropTypes.string
};
const defaultProps = {
	isShow: false,
	images: [],
	links: [],
	texts: [],
	initialSlide: 0,
	firstLoad: true,
	local: 'ru'
};

const linkTextSmall = {
	ru: 'На сайт',
	ua: 'До сайту',
	en: 'To site'
};

const linkTextBig = {
	ru: 'Перейти на сайт',
	ua: 'Перейти до сайту',
	en: 'Go to site'
};

class CanvasGallery extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoaded: false,
			imageLoaded: false,
			isActive: false,
			curSlide: -2,
			isMove: false,
			startLoading: false,
			isMob: false,
			isVertical: false
		};

		this._values = {
			cubeRotation: 9.0,
			maxCubeRotation: 0.0,
			minCubeRotation: 0.0,
			hoverZoom: 1
		};

		this._slides = [];
		this._texturesArray = [];
		this._direction = -1;
		this._isGallMouseDown = false;
		this._mousePrevY = 0;
		this._mouseCurY = 0;
		this._mousePrevX = 0;
		this._mouseCurX = 0;
		this._playerIsLoad = false;
		this._isZooming = false;
		this._currentSlide = 0;
		this._isChangingState = false;
		this._isChangingSlide = false;

		this.canvasAnimate = this.canvasAnimate.bind(this);
		this.canvasResize = this.canvasResize.bind(this);
		this.handleCompleteAnimate = this.handleCompleteAnimate.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		const { firstLoad } = this.props;
		const delay = firstLoad ? 4500 : 1500;

		this.setState({
			isMob : mobileTabletCheck()
		});

		setTimeout(() => {
			if (this._isMounted) {
				this.renderCanvas();
			}
		}, delay);

		if (this._canvasBg) {
			this._canvasBg.addEventListener('touchestart', this.handleResetTouch, true);
			this._canvasBg.addEventListener('touchemove', this.handleResetTouch, true);
		}

		const audioBing = new Audio();
		const audioClick = new Audio();

		audioBing.volume = 0.015;
		audioBing.muted = this.props.isMuted;
		this._audioBing = audioBing;

		audioBing.onerror = () => {
			this._audioBing = null;
		};

		audioBing.src = '/media/audio/down.mp3';

		audioClick.volume = 0.06;
		audioClick.muted = this.props.isMuted;
		this._audioClick = audioClick;

		audioClick.onerror = () => {
			this._audioClick = null;
		};

		audioClick.src = '/media/audio/click_2.mp3';
	}

	componentDidUpdate(prevProps, prevState) {
		const curProps = this.props;
		const curState = this.state;

		if (this._audioBing && curState.curSlide !== prevState.curSlide) {
			this._audioBing.currentTime = 0.5;
			this._audioBing.playbackRate = 3;
			this._audioBing.play();
		}

		if (!curState.isLoaded && (curProps.isShow !== prevProps.isShow || curState.imageLoaded !== prevState.imageLoaded)) {
			if (curProps.isShow && curState.imageLoaded) {
				this.setState({
					isLoaded: true
				});
			}
		}

		if (curState.isLoaded !== prevState.isLoaded && curState.isLoaded) {
			this.startAnimation();
		}

		if (curProps.isMuted !== prevProps.isMuted) {
			if (this._audioBing) {
				this._audioBing.muted = curProps.isMuted;
			}
			if (this._audioClick) {
				this._audioClick.muted = curProps.isMuted;
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		window.removeEventListener('resize', this.canvasResize);
		if (this._canvasBg) {
			this._canvasBg.removeEventListener('touchestart', this.handleResetTouch);
			this._canvasBg.removeEventListener('touchemove', this.handleResetTouch);
		}
		this._scene = null;
		this._renderer = null;
		this._camera = null;
	}

	handleCompleteAnimate() {
		let cubeRotation = this._values.cubeRotation;
		const { maxCubeRotation, minCubeRotation } = this._values;

		setTimeout(() => {
			if (this._isMounted) {
				this.setState({
					isMove: false
				});
			}
		}, 500);

		if (cubeRotation > maxCubeRotation) {
			cubeRotation = maxCubeRotation;
			TweenMax.to(this._values, 1, { cubeRotation, overwrite: 'all', ease: Expo.easeOut });
		} else if (cubeRotation < minCubeRotation) {
			cubeRotation = minCubeRotation;
			TweenMax.to(this._values, 1, { cubeRotation, overwrite: 'all', ease: Expo.easeOut });
		} else {
			TweenMax.to(this._values, 1, { cubeRotation: Math.round(cubeRotation), overwrite: 'all' });
		}
	}

	handleMouseDown(e) {
		this._mousePrevY = e.clientY;
		this._mousePrevX = e.clientX;
		this._isGallMouseDown = true;
	}

	handleMouseUp() {
		this._isGallMouseDown = false;
		if (!this.state.isActive) {
			return;
		}

		let cubeRotation = this._values.cubeRotation;
		const { maxCubeRotation, minCubeRotation } = this._values;

		if (cubeRotation > maxCubeRotation) {
			cubeRotation = maxCubeRotation;
			TweenMax.to(this._values, 2, { cubeRotation, overwrite: 'none', ease: Expo.easeOut });
		}
		if (cubeRotation < minCubeRotation) {
			cubeRotation = minCubeRotation;
			TweenMax.to(this._values, 2, { cubeRotation, overwrite: 'none', ease: Expo.easeOut });
		}
	}

	handleMouseMove(e) {
		if (!this._isGallMouseDown || !this.state.isActive) {
			return;
		}

		const { isVertical } = this.state;

		this.setState({
			isMove: true
		});
		this._mouseCurY = e.clientY;
		this._mouseCurX = e.clientX;
		const { cubeRotation, maxCubeRotation, minCubeRotation } = this._values;

		let gradient = 0;

		if (isVertical) {
			gradient = cubeRotation + (this._mouseCurX - this._mousePrevX) * 0.003;
		} else {
			gradient = cubeRotation - (this._mouseCurY - this._mousePrevY) * 0.003;
		}

		const maximum = maxCubeRotation + 0.3;
		const minimum = minCubeRotation - 0.3;

		gradient = gradient > maximum ? maximum : gradient;
		gradient = gradient < minimum ? minimum : gradient;

		const _this = this;

		TweenMax.to(this._values, 1.5, { cubeRotation: gradient, overwrite: 'all', ease: Sine.easeOut, onComplete: () => {
			_this.handleCompleteAnimate();
		} });
	}

	handleTouchStart(e) {
		const touches = e.changedTouches[0];

		this._mousePrevY = touches.clientY;
		this._mousePrevX = touches.clientX;
		this._isGallMouseDown = true;
	}

	handleTouchEnd() {
		this._isGallMouseDown = false;
		if (!this.state.isActive) {
			return;
		}

		let cubeRotation = this._values.cubeRotation;
		const { maxCubeRotation, minCubeRotation } = this._values;

		setTimeout(() => {
			if (this._isMounted) {
				this.setState({
					isMove: false
				});
			}
		}, 1000);

		if (cubeRotation > maxCubeRotation) {
			cubeRotation = maxCubeRotation;
			TweenMax.to(this._values, 2, { cubeRotation, overwrite: 'none', ease: Expo.easeOut });
		}
		if (cubeRotation < minCubeRotation) {
			cubeRotation = minCubeRotation;
			TweenMax.to(this._values, 2, { cubeRotation, overwrite: 'none', ease: Expo.easeOut });
		}
	}

	handleTouchMove(e) {
		if (!this._isGallMouseDown || !this.state.isActive) {
			return;
		}

		const { isVertical } = this.state;

		this.setState({
			isMove: true
		});

		const touches = e.changedTouches[0];

		this._mouseCurY = touches.clientY;
		this._mouseCurX = touches.clientX;

		const { cubeRotation, maxCubeRotation, minCubeRotation } = this._values;
		let gradient = 0;

		if (isVertical) {
			gradient = cubeRotation + (this._mouseCurX - this._mousePrevX) * 0.008;
		} else {
			gradient = cubeRotation - (this._mouseCurY - this._mousePrevY) * 0.008;
		}
		const maximum = maxCubeRotation + 0.2;
		const minimum = minCubeRotation - 0.2;

		gradient = gradient > maximum ? maximum : gradient;
		gradient = gradient < minimum ? minimum : gradient;

		const _this = this;

		TweenMax.to(this._values, 1.4, { cubeRotation: gradient, overwrite: 'all', ease: Sine.easeOut, onComplete: () => {
			_this.handleCompleteAnimate();
		} });
	}

	handleWheel(e) {
		if (this._isChangingSlide) {
			return;
		}

		const delta = e.deltaY || e.detail || e.wheelDelta;
		const { cubeRotation, maxCubeRotation, minCubeRotation } = this._values;

		if (delta < 0) {
			if (cubeRotation >= maxCubeRotation) {
				return;
			}
			this.animateToValue(cubeRotation + 1);
		}
		if (delta > 0) {
			if (cubeRotation <= minCubeRotation) {
				return;
			}
			this.animateToValue(cubeRotation - 1);
		}
	}

	handleMouseEnter() {
		if (!this._isZooming) {
			this._isZooming = true;
			let cubeRotation = this._values.cubeRotation;
			const { maxCubeRotation, minCubeRotation } = this._values;

			if (cubeRotation > maxCubeRotation) {
				cubeRotation = maxCubeRotation;
			} else if (cubeRotation < minCubeRotation) {
				cubeRotation = minCubeRotation;
			}
			TweenMax.to(this._values, 1, { hoverZoom: 1.4, cubeRotation: Math.round(cubeRotation), overwrite: 'all' });
		}
	}

	handleMouseLeave() {
		this._isZooming = false;
		TweenMax.to(this._values, 0.6, { hoverZoom: 1, overwrite: 'none' });
	}

	handleResetTouch(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	animateSlides() {
		const { isVertical, isMob } = this.state;

		this._slides.forEach((slide, index) => {
			const cubeRotation = this._values.cubeRotation;
			const hoverZoom = this._values.hoverZoom;
			const translate = index + cubeRotation;
			const transAbs = Math.abs(translate);
			const dist = translate < 0 ? -1 : 1;
			const zoom = isMob ? 1 : hoverZoom;

			// const yTrans = translate * (2.32 - (transAbs <= 0.92 ? transAbs : 0.92));
			const yTrans = Math.pow(transAbs, 0.75) * dist * 1.95;
			// const yTrans = translate * (2.52 - (transAbs <= 0.98 ? Math.pow(transAbs, 1.2) : 0.98));
			let zTrans = Math.pow(transAbs, 0.97) * 2 * zoom;

			if (zoom > 1 && zTrans < 1.8) {
				zTrans -= (zoom - 1);
			}

			if (isVertical) {
				slide.position.z = zTrans * -60 + 120;
				slide.position.y = 0;
				slide.position.x = yTrans * 124;
			} else {
				slide.position.z = zTrans * -60;
				slide.position.x = 0;
				slide.position.y = yTrans * 94;
			}

			let opacity = 1 - 0.15 * zTrans;

			opacity = opacity < 0 ? 0 : opacity;

			const tStep = 0.55;
			const textureArr = slide._textureArr;
			let texture = textureArr[0];

			if (zTrans < tStep) {
				texture = textureArr[0];
			} else {
				texture = textureArr[1];
			}

			slide.traverse((node) => {
				if (node.material) {
					node.material.opacity = opacity;
					if (node.material.uniforms) {
						node.material.uniforms.opacity.value = opacity * opacity;
					} else if (node.material.map && node.material.map !== texture) {
						node.material.map = texture;
					}
				}
			});
		});
	}

	animateToValue(num) {
		if (this._isChangingSlide || num === -this.state.curSlide) {
			return;
		}
		this._isChangingSlide = true;

		this.setState({
			isMove: true
		});

		let cubeRotation = num;

		const { maxCubeRotation, minCubeRotation } = this._values;

		if (cubeRotation >= maxCubeRotation - 0.1) {
			cubeRotation = maxCubeRotation;
		}

		if (cubeRotation <= minCubeRotation + 0.1) {
			cubeRotation = minCubeRotation;
		}

		setTimeout(() => {
			if (this._isMounted) {
				this.setState({
					isMove: false
				});
			}
		}, 1450);

		setTimeout(() => {
			this._isChangingSlide = false;
		}, 1500);

		this._isZooming = false;

		TweenMax.to(this._values, 1.5, { cubeRotation: Math.round(cubeRotation), hoverZoom: 1, overwrite: 'all' });
	}

	canvasAnimate() {
		if (!this._isMounted) {
			return;
		}

		try {
			this.animateSlides();

			const { isLoaded, curSlide } = this.state;


			if (!this._isChangingState && isLoaded) {
				const { cubeRotation, minCubeRotation, maxCubeRotation } = this._values;
				const dopusk = 0.09;

				if (cubeRotation <= maxCubeRotation + dopusk &&
						cubeRotation >= minCubeRotation - dopusk) {
					const eAbs = Math.abs(cubeRotation);
					const eRound = Math.round(eAbs);

					if (eRound !== curSlide && eAbs <= eRound + dopusk && eAbs >= eRound - dopusk) {
						this._isChangingState = true;
						this.setState({
							curSlide: eRound
						}, () => {
							this._isChangingState = false;
						});
					}
				}
			}
			this._renderer.render(this._scene, this._camera);
			requestAnimationFrame(this.canvasAnimate);
		} catch (err) {
			console.log('Webgl error');
		}
	}

	canvasInit() {
		const { images } = this.props;
		const wWidth = this._canvasBg.offsetWidth;
		const wHeight = this._canvasBg.offsetHeight;

		this._camera = new THREE.PerspectiveCamera(90, wWidth / wHeight, 1, 1800);
		this._camera.position.x = 0;
		this._camera.position.y = 0;
		this._camera.position.z = 300;
		this._scene = new THREE.Scene();

		this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas,  antialias: true, alpha: true });
		this._renderer.setPixelRatio(window.devicePixelRatio);
		this._renderer.setSize(wWidth, wHeight);

		const vertexShadowShader = `
			varying vec3 vPos;

			void main(void) {
				vPos = position;
				vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * modelViewPosition;
			}
		`;

		const fragmentShaderShadow = `
			uniform vec3 origin;
			uniform vec3 color;
			uniform float minDistance;
			uniform float maxDistance;
			uniform float opacity;
			varying vec3 vPos;
			void main() {
				float PI = 3.14159265359;
				float TWO_PI = 6.28318530718;
				vec2 st = vPos.xy - origin.xy;
				float s = length(st);
				float d = 0.0;
				int N = 6;

				float a = atan(st.x,st.y)+PI;
				float r = TWO_PI/float(N);
				d = cos(floor(.5+a/r)*r-a)*s;
				float distance = clamp(d, minDistance, maxDistance);
				float opac = (1.0 - (distance - minDistance) / (maxDistance - minDistance)) / 1.6;
				gl_FragColor = vec4(color, opac * opac * opacity);
			}
		`;

		const loadManager = new THREE.LoadingManager();

		loadManager.onLoad = () => {
			if (this._scene) {
				this.animateSlides();
				this._slides.forEach((slide) => {
					this._scene.add(slide);
				});
			}

			if (this._isMounted) {
				this.setState({
					imageLoaded: true
				});
			}

			this.canvasAnimate();
		};

		const imageLoader = new THREE.ImageLoader(loadManager);

		const mainGeometry = new THREE.CircleBufferGeometry(120, 6);
		const shadowGeometry = new THREE.PlaneBufferGeometry(400, 400);
		const shadowMaterial = new THREE.ShaderMaterial({
			uniforms: {
				color: {
					value: new THREE.Color(0xffffff)
				},
				origin: {
					value: new THREE.Vector3()
				},
				minDistance: {
					value: 105.0
				},
				maxDistance: {
					value: 136.0
				},
				opacity: {
					value: 1.0
				}
			},
			vertexShader: vertexShadowShader,
			fragmentShader: fragmentShaderShadow,
			transparent: true
		});

		this._values.minCubeRotation = -(images.length - 1);

		this._slides = new Array(images.length).fill(null);

		if (!window._cashTexture) {
			window._cashTextures = [];
		}

		for (let i = 0; i < images.length; i++) {
			imageLoader.load(images[i], (image) => {
				if (!window._cashTextures[i]) {
					const isMob = mobileTabletCheck();

					window._cashTextures[i] = [];
					for (let k = 0; k < 2; k++) {
						let canvas = null;

						if (k === 0 || isMob) {
							canvas = image;
						} else {
							canvas = document.createElement('canvas');

							blurImage(image, canvas, 14 * k);
						}

						const texture = new THREE.Texture(canvas);

						texture.needsUpdate = true;
						window._cashTextures[i].push(texture);
					}
				}

				const shadowMaterialCopy = shadowMaterial.clone();

				this.ganarateSlides(mainGeometry, window._cashTextures[i], shadowGeometry, shadowMaterialCopy, i);
			});
		}

		if (window.innerHeight > window.innerWidth) {
			this.setState({
				isVertical: true
			});
		}

		this._camera.lookAt(this._scene.position);
		window.addEventListener('resize', this.canvasResize, false);
	}

	canvasResize() {
		if (!this._camera || !this._renderer || !this._canvasBg) {
			return;
		}

		this.setState({
			isVertical: (window.innerHeight > window.innerWidth)
		});

		try {
			const wWidth = this._canvasBg.offsetWidth;
			const wHeight = this._canvasBg.offsetHeight;

			this._camera.aspect = wWidth / wHeight;
			this._camera.updateProjectionMatrix();
			this._renderer.setSize(wWidth, wHeight);
		} catch (err) {
			console.log('resize canvas error');
		}
	}

	ganarateSlides(mainGeometry, textureArr, shadowGeometry, showMaterial, key) {
		const group = new THREE.Group();
		const mainMaterial = new THREE.MeshBasicMaterial({ map: textureArr[0] });
		const circle = new THREE.Mesh(mainGeometry, mainMaterial);
		const shadow = new THREE.Mesh(shadowGeometry, showMaterial);

		circle.position.z = 20;
		shadow.position.z = 19;

		mainMaterial.transparent = true;

		group.add(circle);
		group.add(shadow);
		group._textureArr = textureArr;

		this._slides[key] = group;
	}

	startAnimation() {
		const { initialSlide } = this.props;
		const _this = this;

		setTimeout(() => {
			if (_this._isMounted) {
				_this.setState({
					isActive: true
				});
			}
		}, (1.5 + initialSlide * 1) * 1000 - 400);

		TweenMax.to(this._values, 1.5 + initialSlide * 1, {
			cubeRotation: -initialSlide,
			overwrite: 'all',
			ease: Power2.easeOut
		});
	}

	stopAnimation() {}

	renderCanvas() {
		if (!this._canvas || !this._canvasBg) {
			return;
		}

		this.canvasInit();
	}

	renderDots() {
		const { images } = this.props;
		const { curSlide } = this.state;

		return images.map((image, key) => {
			const aClass = key === curSlide ? ' active' : '';
			const hClass = (key - 1 === curSlide || key + 1 === curSlide) ? ' half' : '';

			return (
				<li key={key}>
					<div className={`cgl__dots_btn${aClass}${hClass}`}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 350 306'
							preserveAspectRatio='xMidYMid meet'
						>
							<g
								onClick={() => {
									if (this._audioClick) {
										this._audioClick.currentTime = 0.1;
										this._audioClick.play();
									}
									this.animateToValue(-key);
								}}
							>
								<use xlinkHref='#cgl__clip_path' />
							</g>
						</svg>
					</div>
				</li>
			);
		});
	}

	renderLinks() {
		const { links } = this.props;
		const { curSlide, isMove, isActive, isMob } = this.state;

		return links.map((link, key) => {
			const aClass = (isActive && !isMove && key === curSlide) ? ' active' : '';
			const mobClass = isMob ? ' mob' : '';

			return (
				<div className={`cgl__link${aClass}${mobClass}`} key={key}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 350 306'
						preserveAspectRatio='xMidYMid meet'
						onDragStart={(e) => {
							e.preventDefault();
							e.nativeEvent.preventDefault();
							return false;
						}}
					>
						<mask id={`cgl__mask_${key}`}>
							<use xlinkHref='#cgl__clip_rect' fill='white' />
							<use className='clip-text' xlinkHref='#cgl__clip_text'/>
						</mask>
						<a
							xlinkHref={link}
							target='_blank'
							onMouseEnter={this.handleMouseEnter}
							onMouseLeave={this.handleMouseLeave}
							onMouseDown={(e) => {
								e.stopPropagation();
								e.nativeEvent.stopImmediatePropagation();
							}}
						>
							<g mask={`url(#cgl__mask_${key})`}>
								<use xlinkHref='#cgl__clip_path' />
							</g>
						</a>
					</svg>
				</div>
			);
		});
	}

	renderTexts() {
		const { texts, links, local } = this.props;
		const { curSlide, isMove, isActive } = this.state;

		return texts.map((text, key) => {
			const aClass = (isActive && !isMove && key === curSlide) ? ' active' : '';

			return (
				<div className={`cgl__text${aClass}`} key={key}>
					<div className='cgl__text_main'>
						<div className='cgl__text_content'>
							<div className='cgl__text_inner'>
								{Parser(text)}
								<p>
									<a href={links[key]} target='_blank'>{linkTextBig[local]}</a>
								</p>
							</div>
						</div>
					</div>
					<div className='cgl__text_line'>
						<div className='cgl__text_svg'>
							<div className='svg_wr'>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
									<path d='M 199 100 L 142.42 2 H 28.59 L 17.043 22'/>
									<path d='M 199 100 L 142.42 198 H 28.59 L 17.043 178'/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			);
		});
	}

	render() {
		const { isLoaded } = this.state;
		const { isShow, local } = this.props;
		const aClass = isLoaded ? ' active' : '';

		return (
			<div
				className='canvas_gallery'
				onWheel={this.handleWheel}
				ref={el => {
					this._canvasBg = el;
				}}
			>
				<div
					className='cgl__wrapper'
					onMouseDown={this.handleMouseDown}
					onMouseUp={this.handleMouseUp}
					onMouseMove={this.handleMouseMove}
					onMouseLeave={() => {
						if (this._isGallMouseDown) {
							this.handleMouseUp();
						}
					}}
					onTouchStart={this.handleTouchStart}
					onTouchEnd={this.handleTouchEnd}
					onTouchCancel={this.handleTouchEnd}
					onTouchMove={this.handleTouchMove}
				>
					<canvas
						ref={el => {
							this._canvas = el;
						}}
					/>
					{this.renderTexts()}
					{this.renderLinks()}
				</div>
				<ul className={`cgl__dots${aClass}`}>
					{this.renderDots()}
				</ul>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306' className='hidden'>
					<defs>
						<text
							id='cgl__clip_text'
							x='175'
							y='168'
							dx=' 0 4 4 4 4 4 4 4 4 4'
							textAnchor='middle'
						>
							{linkTextSmall[local]}
						</text>
						<rect
							id='cgl__clip_rect'
							x='0'
							y='0'
							width='350'
							height='306'
						/>
						<path
							id='cgl__clip_path'
							d='m 9.09 151.45 l 83.3376 -144.345 l 166.675 0 l 83.3376 144.345 l -83.3376 144.345 l -166.675 0 Z'
						/>
					</defs>
				</svg>
				<CSSTransition
					in={isShow && !isLoaded}
					timeout={{
						enter: 750,
						exit: 640
					}}
					classNames='pfade'
					mountOnEnter
					unmountOnExit
				>
					<div className='prl__main'>
						<div
							className='prl__content'
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
			</div>
		);
	}

}

CanvasGallery.propTypes = propTypes;
CanvasGallery.defaultProps = defaultProps;

function mapStateToProps(state) {
	const { isMuted } = state.sound;

	return { isMuted };
}

export default connect(mapStateToProps)(CanvasGallery);