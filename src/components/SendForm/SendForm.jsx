import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TweenMax, TimelineMax, Power0, Power2, Back } from 'gsap';
import validator from 'email-validator';
import { fetchMail } from 'redux/actions/mailActions';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { mobileTabletCheck } from 'utils/isMobile';
import imageMail from 'images/scs-mail.svg';
import imageAt from 'images/scs-at.svg';
import imageMessage from 'images/scs-message.svg';

import './SendForm.scss';

const propTypes = {
	isLoading: PropTypes.bool,
	isError: PropTypes.bool,
	data: PropTypes.object,
	isMuted: PropTypes.bool,
	dispatch: PropTypes.func
};
const defaultProps = {};

const errorMessages = {
	isEmpty: 'Не заполнены обязательные поля!',
	notEmail: 'Не правильный email!',
	server: 'Ошибка соединения с сервером!',
	send: 'Ошибка отправки ссобщения!',
	basic: 'Что то пошло не так!'
};

class SendForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isShow: false,
			emailFocused: false,
			msgFocused: false,
			isEValid: true,
			isMValid: true,
			isBtnHover: false,
			isSending: false,
			spanErrors: [],
			spanNum: 0,
			showErrors: false,
			errorMsg: '',
			isMobile: false
		};

		this.handleInputBlur = this.handleInputBlur.bind(this);
		this.handleInputFocus = this.handleInputFocus.bind(this);
		this.handleMsgBlur = this.handleMsgBlur.bind(this);
		this.handleMsgFocus = this.handleMsgFocus.bind(this);
		this.handleBtnEnter = this.handleBtnEnter.bind(this);
		this.handleBtnLeave = this.handleBtnLeave.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		this.setupAnimation();

		this.setState({
			isShow: true,
			isMobile: mobileTabletCheck()
		}, () => {
			if (this._startTimeLite) {
				this._startTimeLite.play();
			}
		});

		const audioClick = new Audio();
		const audioError = new Audio();
		const audioSuccess = new Audio();
		const audioSend = new Audio();

		audioClick.volume = 0.03;
		audioClick.muted = this.props.isMuted;
		this._audioClick = audioClick;

		audioClick.onerror = () => {
			this._audioClick = null;
		};

		audioClick.src = '/media/audio/click_2.mp3';

		audioError.volume = 0.015;
		audioError.muted = this.props.isMuted;
		this._audioError = audioError;

		audioError.onerror = () => {
			this._audioError = null;
		};

		audioError.src = '/media/audio/error2.mp3';

		audioSend.volume = 0.015;
		audioSend.muted = this.props.isMuted;
		this._audioSend = audioSend;

		audioSend.onerror = () => {
			this._audioSend = null;
		};

		audioSend.src = '/media/audio/down.mp3';

		audioSuccess.volume = 0.1;
		audioSuccess.muted = this.props.isMuted;
		this._audioSuccess = audioSuccess;

		audioSuccess.onerror = () => {
			this._audioSuccess = null;
		};

		audioSuccess.src = '/media/audio/money.mp3';
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (curProps.isLoading !== prevProps.isLoading && !curProps.isLoading) {
			this.handleResponse();
		}

		if (curProps.isMuted !== prevProps.isMuted) {
			if (this._audioClick) {
				this._audioClick.muted = curProps.isMuted;
			}

			if (this._audioError) {
				this._audioError.muted = curProps.isMuted;
			}

			if (this._audioSend) {
				this._audioSend.muted = curProps.isMuted;
			}

			if (this._audioSuccess) {
				this._audioSuccess.muted = curProps.isMuted;
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleInputBlur() {
		let val = '';

		if (this._eField) {
			val = this._eField.value;
		}

		this.setState({
			emailFocused: false,
			isEValid: validator.validate(val)
		}, () => {
			if (this._eTimeLite) {
				const _this = this;

				this._eTimeLite.eventCallback('onRepeat', () => {
					_this._eTimeLite.pause();
				});
				this._eTimeLite.timeScale(4);
			}
		});
	}

	handleInputFocus() {
		if (this._audioClick) {
			this._audioClick.currentTime = 0;
			this._audioClick.play();
		}
		this.setState({
			emailFocused: true,
			isEValid: true
		}, () => {
			if (this._eTimeLite) {
				this._eTimeLite.eventCallback('onRepeat', null);
				this._eTimeLite.timeScale(1);
				this._eTimeLite.play();
			}
		});
	}

	handleMsgBlur() {
		let val = '';

		if (this._mField) {
			val = this._mField.value.trim();
		}
		this.setState({
			msgFocused: false,
			isMValid: val !== ''
		}, () => {
			if (this._mTimeLite) {
				const _mTimeLite = this._mTimeLite;

				_mTimeLite.eventCallback('onRepeat', () => {
					_mTimeLite.pause();
				});
				_mTimeLite.timeScale(4);
			}
		});
	}

	handleMsgFocus() {
		if (this._audioClick) {
			this._audioClick.currentTime = 0;
			this._audioClick.play();
		}
		this.setState({
			msgFocused: true,
			isMValid: true
		}, () => {
			if (this._mTimeLite) {
				this._mTimeLite.eventCallback('onRepeat', null);
				this._mTimeLite.timeScale(1);
				this._mTimeLite.play();
			}
		});
	}

	handleBtnEnter() {
		this.setState({
			isBtnHover: true
		}, () => {
			if (this._bTimeLite && !this.props.isLoading) {
				this._bTimeLite.eventCallback('onRepeat', null);
				this._bTimeLite.timeScale(1);
				this._bTimeLite.play();
			}
		});
	}

	handleBtnLeave() {
		this.setState({
			isBtnHover: false
		}, () => {
			if (this._bTimeLite) {
				const _bTimeLite = this._bTimeLite;

				_bTimeLite.eventCallback('onRepeat', () => {
					_bTimeLite.pause();
				});
				_bTimeLite.timeScale(6);
			}
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		e.nativeEvent.preventDefault();

		if (this.state.isSending) {
			return;
		}

		const params = {};
		const elements = e.target.elements;
		let isValid = true;

		for (let i = 0; i < elements.length; i++) {
			if (elements[i].name === 'femail') {
				const isValidEmail = validator.validate(elements[i].value);

				this.setState({
					isEValid: isValidEmail
				});

				if (!isValidEmail) isValid = false;
			} else if (elements[i].name === 'fmessage') {
				const isValidMsg = elements[i].value.trim() !== '';

				this.setState({
					isMValid: isValidMsg
				});

				if (!isValidMsg) isValid = false;
			} else if (elements[i].type === 'submit') {
				continue;
			}

			const name = elements[i].name;
			const value = elements[i].value;

			params[name] = value;
		}

		if (isValid) {
			if (this._audioClick) {
				this._audioClick.currentTime = 0;
				this._audioClick.play();
			}
			if (this._audioSend) {
				this._audioSend.currentTime = 0.3;
				this._audioSend.play();
			}
			this.setState({
				isSending: true,
				showErrors: false,
				errorMsg: ''
			}, () => {
				this.props.dispatch(fetchMail(params));

				if (this._sTimeLite && this._bTimeLite) {
					this._sTimeLite.pause(0);
					this._sTimeLite.progress(0);
					this._sTimeLite.timeScale(1);
					this._sTimeLite.play();
					const _bTimeLite = this._bTimeLite;

					_bTimeLite.eventCallback('onRepeat', () => {
						_bTimeLite.pause();
					});
					_bTimeLite.timeScale(6);
				}
			});
		} else {
			if (this._audioError) {
				this._audioError.currentTime = 0;
				this._audioError.play();
			}
			const { spanErrors, spanNum } = this.state;
			const newErrors = spanErrors.slice();
			const newNum = spanNum + 1;

			newErrors.push(newNum);
			this.setState({
				spanErrors: newErrors,
				spanNum: newNum
			}, () => {
				this.setState({
					spanErrors: []
				});
			});
		}
	}

	handleResponse() {
		const { isError, data } = this.props;

		let showErrors = false;
		let errorMsg = '';

		if (isError) {
			showErrors = true;
			errorMsg = errorMessages.server;
		} else if (data.status !== 'SUCCESS') {
			showErrors = true;
			errorMsg = errorMessages.basic;
			if (data.sended !== 'OK') {
				errorMsg = errorMessages.send;
			} else if (data.fields.femail === 0 || data.fields.fmessage === 0) {
				errorMsg = errorMessages.isEmpty;
			} else if (data.fields.femail === 1) {
				errorMsg = errorMessages.notEmail;
			}
		}

		if (!showErrors && this._successTimeLite) {
			setTimeout(() => {
				this.afterRespondse = null;
				this._bTimeLite.pause();
				this._sTimeLite.timeScale(5);
				this._successTimeLite.play();
			}, 300);
			setTimeout(() => {
				if (this._audioSuccess) {
					this._audioSuccess.currentTime = 0;
					this._audioSuccess.play();
				}
			}, 600);
		} else {
			this.afterRespondse = () => {
				this.setState({
					showErrors,
					errorMsg
				});
			};
			setTimeout(() => {
				const { isBtnHover } = this.state;

				if (this._sTimeLite) {
					this._sTimeLite.timeScale(5);
				}
				if (isBtnHover && this._bTimeLite && !this.props.isLoading) {
					this._bTimeLite.eventCallback('onRepeat', null);
					this._bTimeLite.timeScale(1);
					this._bTimeLite.play();
				}
			}, 300);

			setTimeout(() => {
				if (this._audioError) {
					this._audioError.currentTime = 0;
					this._audioError.play();
				}
			}, 1000);
		}
	}

	setupAnimation() {
		if (this._eSvg) {
			const path = this._eSvg.querySelector('path');
			const eLength = path.getTotalLength();

			TweenMax.set(path, {
				strokeDasharray: eLength
			});

			const tlE = new TimelineMax({
				paused: true,
				repeat: -1
			});

			tlE.to(this._eSvg, 0.25, {
				scale: 1.15,
				ease: Power0.easeNone
			});

			tlE.to(this._eSvg, 0.2, {
				scale: 0,
				opacity: 0,
				ease: Power0.easeNone
			});
			tlE.set(this._eSvg, {
				opacity: 1,
				scale: 1
			});
			tlE.set(path, {
				strokeDashoffset: eLength
			});
			tlE.to(path, 2, {
				strokeDashoffset: 0,
				ease: Power0.easeNone
			});

			this._eTimeLite = tlE;
		}

		if (this._mSvg) {
			const trPath = this._mSvg.querySelectorAll('.snf__text_trans');
			const opPath = this._mSvg.querySelectorAll('.snf__text_paths path');

			let mLength = 0;

			if (opPath[0]) mLength = opPath[0].getTotalLength();

			TweenMax.set(opPath, {
				strokeDasharray: mLength
			});

			const tlM = new TimelineMax({
				paused: true,
				repeat: -1
			});

			tlM.to(opPath, 0.3, {
				opacity: 0,
				ease: Power0.easeNone
			}, 0);

			tlM.to(trPath, 0.6, {
				y: 60,
				ease: Power0.easeNone
			}, 0);

			tlM.set(opPath, {
				opacity: 1,
				strokeDashoffset: mLength
			});

			tlM.addLabel('writeLabel');

			tlM.staggerTo(opPath, 0.5, {
				strokeDashoffset: 0,
				ease: Power0.easeNone
			}, 0.5);

			tlM.to(trPath, 0.5 * opPath.length, {
				y: 0,
				ease: Power0.easeNone
			}, 'writeLabel');

			this._mTimeLite = tlM;
		}

		if (this._bSvg) {
			const plane = this._bSvg.querySelectorAll('.snf__btn_plane');
			const btnPath = this._bSvg.querySelectorAll('.snf__btn_paths path');

			let bLength = 0;

			for (let i = 0; i < btnPath.length; i++) {
				bLength = btnPath[i].getTotalLength();
			}

			for (let i = 0; i < btnPath.length; i++) {
				TweenMax.set(btnPath[i], {
					strokeDasharray: `${bLength / 2} ${bLength / 4}`,
					strokeDashoffset: bLength / 3.5 * i
				});
			}

			const tlB = new TimelineMax({
				paused: true,
				repeat: -1
			});

			tlB.to(btnPath, 0.6, {
				strokeDashoffset: -bLength,
				ease: Power0.easeNone
			}, 0);

			tlB.to(plane, 0.6, {
				y: -60,
				x: 60,
				ease: Power0.easeNone
			}, 0);

			tlB.to(plane, 0.6, {
				y: 0,
				x: 0,
				ease: Power0.easeNone
			});

			tlB.to(btnPath, 0.6, {
				strokeDashoffset: -bLength * 2,
				ease: Power0.easeNone
			}, 0.6);

			this._bTimeLite = tlB;

			const allPaths = this._bSvg.querySelectorAll('.snf__btn_all');
			const _this = this;
			const tlS = new TimelineMax({
				paused: true,
				onComplete: () => {
					_this.setState({
						isSending: false
					});
					if (_this.afterRespondse) {
						_this.afterRespondse();
					}
				}
			});

			tlS.to(allPaths, 3, {
				bezier: {
					values: [
						{ x: 226, y: -226, scale: 0.5, rotation: -90 },
						{ x: 0, y: -320, scale: 0.5, rotation: -135 },
						{ x: -226, y: -226, scale: 0.5, rotation: -180 },
						{ x: -320, y: 0, scale: 0.5, rotation: -225 },
						{ x: -226, y: 226, scale: 0.5, rotation: -270 },
						{ x: 0, y: 320, scale: 0.5, rotation: -315 },
						{ x: 226, y: 226, scale: 0.5, rotation: -360 },
						{ x: 320, y: 0, scale: 0.5, rotation: -405 },
						{ x: 226, y: -226, scale: 0.5, rotation: -450 },
						{ x: 0, y: -320, scale: 0.5, rotation: -495 },
						{ x: -226, y: -226, scale: 0.5, rotation: -540 },
						{ x: -320, y: 0, scale: 0.5, rotation: -585 },
						{ x: -226, y: 226, scale: 0.5, rotation: -630 }
					],
					type: 'soft'
				},
				svgOrigin: '450 450',
				ease: Power0.easeNone
			});
			tlS.to(allPaths, 0.5, {
				x: 0,
				y: 0,
				rotation: -720,
				ease: Power0.easeNone
			});
			tlS.to(allPaths, 0.3, {
				scale: 1,
				ease: Power0.easeNone
			});

			this._sTimeLite = tlS;
		}

		if (this._sendForm) {
			const btnSvg = this._sendForm.querySelectorAll('.snf__btn_svg');
			const btnSvgWr = this._sendForm.querySelectorAll('.snf__btn_wr');
			const circleSvg = this._sendForm.querySelectorAll('#snf__circle');
			const mainPath = this._sendForm.querySelectorAll('.snf__mainpath');
			const form = this._sendForm.querySelectorAll('form');
			const formRow = this._sendForm.querySelectorAll('.snf__row');
			const rect1 = this._sendForm.querySelectorAll('.snf__mask_rect1');
			const rect2 = this._sendForm.querySelectorAll('.snf__mask_rect2');
			const imgSalute = this._sendForm.querySelectorAll('.snf__images_salute image');

			TweenMax.set(circleSvg, {
				svgOrigin: '175 297'
			});
			TweenMax.set(mainPath, {
				svgOrigin: '175 153'
			});
			TweenMax.set(imgSalute, {
				scale: 0,
				transformOrigin: '50% 50%'
			});
			TweenMax.set(rect1, {
				x: -160,
				y: -160
			});

			TweenMax.set(rect2, {
				x: -160,
				y: 160
			});

			const tlSuccess = new TimelineMax({
				paused: true
			});

			tlSuccess.to(btnSvg, 0.2, {
				opacity: 0,
				ease: Power0.easeNone
			});
			tlSuccess.to(btnSvgWr, 0.15, {
				scale: 0,
				ease: Power2.easeIn
			}, 0);
			tlSuccess.to(circleSvg, 0.15, {
				scale: 0,
				ease: Power2.easeIn
			}, 0);

			tlSuccess.to(form, 0.2, {
				opacity: 0,
				ease: Power0.easeNone
			}, 0);

			tlSuccess.set(form, {
				css: {
					display: 'none'
				}
			});

			tlSuccess.set(btnSvgWr, {
				css: {
					display: 'none'
				}
			});

			tlSuccess.to(mainPath, 0.35, {
				attr: {
					d: 'M 9.09,151.45 C 9.7158786,92.392465 40.874942,36.807147 92.42759,7.105071 c 53.0407,-31.227558 117.67508,-28.284263 166.67517,8e-6 34.04656,17.765691 83.58311,70.094058 83.33758,144.344931 -0.35323,64.08803 -35.26492,114.59114 -83.33759,144.34493 -47.91302,28.16121 -116.83414,30.06871 -166.67517,0 C 31.182595,258.15778 8.7483561,205.47178 9.09,151.45 Z'
				},
				scale: 0.6,
				ease: Power2.easeOut
			}, 0.35);

			tlSuccess.to(mainPath, 0.3, {
				scale: 0.86,
				ease: Back.easeOut
			});

			tlSuccess.to(rect1, 0.25, {
				x: 0,
				y: 0,
				ease: Power2.easeInOut
			}, '-=0.25');

			tlSuccess.to(rect2, 0.25, {
				x: 0,
				y: 0,
				ease: Power2.easeInOut
			}, '-=0.20');

			tlSuccess.addLabel('salute', '-=0.45');

			for (let i = 0; i < imgSalute.length; i++) {
				const img = imgSalute[i];
				const rad = ((i * 15) - 165) * Math.PI / 180;
				const cos = Math.cos(rad);
				const sin = Math.sin(rad);
				const grad = (i % 2 === 0) ? 1 : 0.8;
				const xD = 280 * cos * grad;
				const yD = 310 * sin * grad;

				tlSuccess.to(img, 1, {
					bezier: {
						values: [
							{ x: 0, y: 0, scale: 1, opacity: 1 },
							{ x: xD, y: yD, scale: 1.2, opacity: 0.8 },
							{ x: xD * 1.2, y: yD + 120, scale: 0.3, opacity: 0 }
						],
						type: 'soft'
					},
					ease: Power2.easeOut
				}, 'salute');
				tlSuccess.set(img, {
					css: {
						display: 'none'
					}
				});
			}

			this._successTimeLite = tlSuccess;

			TweenMax.set(circleSvg, {
				scale: 0
			});
			TweenMax.set(this._sendForm, {
				scale: 0.1
			});
			TweenMax.set(formRow, {
				opacity: 0
			});
			TweenMax.set(btnSvg, {
				opacity: 0
			});

			TweenMax.set(btnSvgWr, {
				scale: 0
			});

			const tlStart = new TimelineMax({
				paused: true
			});

			tlStart.to(this._sendForm, 0.8, {
				scale: 1,
				clearProps: 'scale',
				ease: Power2.easeOut,
				delay: 1
			});

			tlStart.to(circleSvg, 0.6, {
				scale: 1,
				ease: Power2.easeInOut
			}, '-=0.6');

			tlStart.to(btnSvgWr, 0.6, {
				scale: 1,
				clearProps: 'scale',
				ease: Power2.easeInOut
			}, '-=0.6');

			tlStart.to(btnSvg, 0.4, {
				opacity: 1,
				ease: Power2.easeIn
			}, '-=0.3');

			tlStart.staggerTo(formRow, 0.4, {
				opacity: 1,
				ease: Power2.easeIn
			}, 0.1, '-=0.4');

			this._startTimeLite = tlStart;
		}
	}

	renderSpanErrors() {
		return this.state.spanErrors.map((val) => {
			return (
				<CSSTransition
					key={val}
					timeout={400}
					classNames='fade'
				>
					<span/>
				</CSSTransition>
			);
		});
	}

	renderSaluteImages() {
		const images = [];

		for (let i = 0; i < 11; i++) {
			let img = imageMail;

			if (i % 3 === 1) {
				img = imageAt;
			} else if (i % 3 === 2) {
				img = imageMessage;
			}

			images.push(
				<image
					key={i}
					xlinkHref={img}
					x='167'
					y='145'
					width='16'
					height='16'
				/>
			);
		}

		return images;
	}

	render() {
		const { isShow, emailFocused, msgFocused, isEValid, isMValid, showErrors, errorMsg, isMobile } = this.state;
		const showClass = isShow ? ' show' : '';
		const eFClass = emailFocused ? ' focus' : '';
		const mFClass = msgFocused ? ' focus' : '';
		const eErrFClass = isEValid ? '' : ' error';
		const mErrFClass = isMValid ? '' : ' error';
		const fullClass = (isMobile && (emailFocused || msgFocused)) ? ' fullscreen' : '';

		return (
			<div
				className={`send_form${showClass}${fullClass}`}
				ref={(el) => {
					this._sendForm = el;
				}}
			>
				<div className='snf__skeleton' />
				<div className='snf__content'>
					<form
						noValidate
						onSubmit={this.handleSubmit}
					>
						<div className={`snf__row${eErrFClass}`}>
							<div className={`snf__inp_wr${eFClass}`}>
								<input
									id='snfMail'
									type='email'
									name='femail'
									onFocus={this.handleInputFocus}
									onBlur={this.handleInputBlur}
									ref={el => {
										this._eField = el;
									}}
								/>
							</div>
							<label htmlFor='snfMail' className='snf__email_img'>
								<svg
									className='snf__email_svg'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 235 235'
									ref={el => {
										this._eSvg = el;
									}}
								>
									<path
										d='m 162.111,66.640 -8.5725,43.058444 c 0,0 -39.793,67.965 -69.726,55.99 0,0 -25.707,-10.917 -6.691,-59.866 16.903,-36.624 42.258,-36.976 42.258,-36.976 25.723,-4.289 34.486,15.722 34.159,40.85 l -7.747,39.793 c -1.089,26.038 29.51,21.515 39.26,18.106 11.264,-3.553 23.619,-10.394 32.423,-25.184 15.555,-25.451 2.355,-62.744 2.355,-62.744 C 211.94,60.316 199.395,45.234 183.457,32.783 156.402,10.185 115.99,11.718 115.989,11.715 56.059,12.99 17.109,59.773 12.931,109.831 c -3.846,46.079 24.3468,101.604 86.658,113.613 18.324,5.122 47.27,-0.373 60.716,-5.353'
									/>
								</svg>
							</label>
						</div>
						<div className={`snf__row big${mErrFClass}`}>
							<div className='snf__text'>
								<div className={`snf__inp_wr${mFClass}`}>
									<textarea
										id='snfMessage'
										name='fmessage'
										onFocus={this.handleMsgFocus}
										onBlur={this.handleMsgBlur}
										ref={el => {
											this._mField = el;
										}}
									/>
								</div>
								<label htmlFor='snfMessage' className='snf__text_img'>
									<svg
										className='snf__text_svg'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='-38 0 460 660'
										ref={el => {
											this._mSvg = el;
										}}
									>
										<defs>
											<g id='svgTextPath' className='snf__text_trans'>
												<g transform='translate(-20 20)' >
													<path
														d='M 132.97352,43.05038 -15.220623,184.59705 v 290.1832 c 0,33.65322 27.092506,60.74573 60.74573,60.74573 H 321.05105 c 33.65322,0 60.74573,-27.09251 60.74573,-60.74573 V 103.79611 c 0,-33.653225 -27.09251,-60.74573 -60.74573,-60.74573 z'
													/>
												</g>
											</g>
											<clipPath
												clipPathUnits='userSpaceOnUse'
												id='svgTextClip'
											>
												<path
													className='snf__text_trans'
													d='M 112.97352,63.05038 -15.220623,184.59705 v 290.1832 c 0,33.65322 27.092506,60.74573 60.74573,60.74573 H 321.05105 c 33.65322,0 60.74573,-27.09251 60.74573,-60.74573 V 103.79611 c 0,-33.653225 -27.09251,-60.74573 -60.74573,-60.74573 z'
												/>
											</clipPath>
											<mask
												clipPathUnits='userSpaceOnUse'
												id='svgTextMask'
											>
												<rect
													x='0'
													y='0'
													width='100%'
													height='100%'
													fill='white'
												/>
												<use xlinkHref='#svgTextPath' fill='#000' />
											</mask>
										</defs>
										<rect
											width='397.01773'
											height='492.47556'
											x='7.558959'
											y='13.762733'
											ry='60.745884'
											mask='url(#svgTextMask)'
										/>
										<use xlinkHref='#svgTextPath' />
										<g className='snf__text_trans snf__text_paths'>
											<path
												d='M 24 250 H 306'
											/>
											<path
												d='M 24 310 H 306'
											/>
											<path
												d='M 24 370 H 306'
											/>
											<path
												d='M 24 430 H 306'
											/>
										</g>
										<g clipPath='url(#svgTextClip)'>
											<g
												transform='translate(-250, -350)'
											>
												<use xlinkHref='#svgTextPath' />
											</g>
										</g>
									</svg>
								</label>
							</div>
						</div>
						<div className='snf__btn_wr'>
							<div className='snf__btn_skl' />
							<button
								className='snf__btn'
								onMouseEnter={this.handleBtnEnter}
								onMouseLeave={this.handleBtnLeave}
							>
								<svg
									className='snf__btn_svg'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 900 900'
									ref={el => {
										this._bSvg = el;
									}}
								>
									<g className='snf__btn_all'>
										<g className='snf__btn_plane'>
											<path
												d='m 440.24576,342.61509 v 0 m -3.03804,295.82731 58.81415,-79.43756 M 370.47601,517.25149 659.64673,214.27421 437.97475,538.72836 M 478.08502,320.70542 659.64673,214.27421 658.11267,606.99413 437.97475,538.72836 437.20772,638.4424 370.47601,517.25149 220.90495,470.4626 401.15726,363.75221'
											/>
											<g className='snf__btn_paths'>
												<path
													d='M 376.407 641.288 229.632 819.565'
												/>
												<path
													d='M 317.831 555.59 174.853 722.12428'
												/>
												<path
													d='M 538.576 627.186 419.463 775.408'
												/>
											</g>
										</g>
									</g>
								</svg>
								<TransitionGroup>
									{this.renderSpanErrors()}
								</TransitionGroup>
							</button>
						</div>
					</form>
				</div>
				<div className='snf__svg'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306'>
						<symbol id='snf__symbol'>
							<path
								className='snf__mainpath'
								d='M 9.09,151.45 C 9.233575,150.95774 92.069678,7.3537647 92.42759,7.105071 c 0.28715,-0.1333196 166.1624,-0.3896955 166.67517,8e-6 0.34827,0.262412 83.23503,143.770631 83.33758,144.344931 -0.0615,0.3897 -82.94789,143.95523 -83.33759,144.34493 -0.41021,0.26664 -166.223934,0.20511 -166.67517,0 C 92.058387,295.56932 9.1925536,151.79868 9.09,151.45 Z'
							/>
						</symbol>
						<defs>
							<circle
								id='snf__circle'
								cx='175'
								cy='297'
								r='56'
							/>
							<clipPath
								clipPathUnits='userSpaceOnUse'
								id='svgMainClipScs'
							>
								<path
									d='m 257.06672,96.976307 c -3.09605,-2.919322 -7.85468,-3.056779 -11.11437,-0.373097 l -77.09366,63.71453 -51.37614,-30.82307 c -3.41024,-2.04222 -7.77613,-1.43348 -10.49254,1.49895 -2.69677,2.90621 -2.99132,7.31138 -0.69382,10.55798 l 55.67656,78.78897 c 1.55785,2.20586 4.09098,3.52806 6.78775,3.55424 0.0262,0 0.0524,0 0.0785,0 2.67059,0 5.19064,-1.26329 6.77466,-3.43643 L 258.08781,108.0514 c 2.48731,-3.41024 2.06186,-8.155771 -1.02111,-11.075093 z'
								/>
							</clipPath>
							<mask
								clipPathUnits='userSpaceOnUse'
								id='snf__mask'
							>
								<rect
									x='0'
									y='0'
									width='100%'
									height='100%'
									fill='white'
								/>
								<use xlinkHref='#snf__circle' fill='#000' />
								<g clipPath='url(#svgMainClipScs)'>
									<g className='snf__mask_rect1'>
										<rect
											transform='matrix(0.52296868,0.8523519,-0.89074552,-0.45450238,0,0)'
											x='83.639534'
											y='-147.17725'
											ry='64.914528'
											width='178.32263'
											height='178.32263'
											fill='#000'
										/>
									</g>
									<g className='snf__mask_rect2'>
										<rect
											transform='matrix(0.86296541,-0.50526301,-0.47296051,0.88108362,0,0)'
											x='394.3013'
											y='376.75412'
											ry='65.960022'
											width='180.12352'
											height='181.19464'
											fill='#000'
										/>
									</g>
								</g>
							</mask>
						</defs>
						<filter
							style={{ colorInterpolationFilters: 'sRGB' }}
							id='snf__filter'
						>
							<feFlood
								floodOpacity='0.6'
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
								stdDeviation='1.2'
								result='blur'
							/>
							<feOffset
								dx='0.1'
								dy='1.0'
								result='offset'
							/>
							<feComposite
								in='SourceGraphic'
								in2='offset'
								operator='over'
								result='composite2'
							/>
						</filter>
						<g className='main_figure' style={{ filter: 'url(#snf__filter)' }}>
							<use
								xlinkHref='#snf__symbol'
								mask='url(#snf__mask)'
							/>
						</g>
						<g
							className='snf__images_salute'
						>
							{this.renderSaluteImages()}
						</g>
					</svg>
				</div>
				<CSSTransition
					in={showErrors}
					timeout={400}
					classNames='fade'
					mountOnEnter
					unmountOnExit
				>
					<div className='snf__errors'>
						<div className='snf__errors_ctn'>
							<div className='snf__errors_sk'/>
							<div className='snf__errors_svg'>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 350 306'>
									<defs>
										<circle
											id='snf__errors_c'
											cx='280'
											cy='10'
											r='50'
										/>
										<mask
											clipPathUnits='userSpaceOnUse'
											id='snf__errors_mask'
										>
											<rect
												x='0'
												y='0'
												width='100%'
												height='100%'
												fill='white'
											/>
											<use xlinkHref='#snf__errors_c' fill='#000' />
										</mask>
									</defs>
									<g style={{ filter: 'url(#snf__filter)' }}>
										<use
											xlinkHref='#snf__symbol'
											mask='url(#snf__errors_mask)'
										/>
										<g
											className='snf__errors_close'
											onClick={() => {
												this.setState({
													showErrors: false
												});
											}}
										>
											<circle
												cx='280'
												cy='10'
												r='30'
											/>
											<path
												d='M 270 0 L 290 20'
											/>
											<path
												d='M 270 20 L 290 0'
											/>
										</g>
									</g>
								</svg>
							</div>
							<div className='snf__errors_msg'>
								{errorMsg}
							</div>
						</div>
					</div>
				</CSSTransition>
			</div>
		);
	}

}

SendForm.propTypes = propTypes;
SendForm.defaultProps = defaultProps;

function mapStateToProps(state) {
	const { isLoading, isError, data } = state.mail;
	const { isMuted } = state.sound;

	return { isLoading, isError, data, isMuted };
}

export default connect(mapStateToProps)(SendForm);