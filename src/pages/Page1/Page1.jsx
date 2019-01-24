import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { Scrollbars } from 'react-custom-scrollbars';
import Parser from 'html-react-parser';
import { fetchPage, unloadPage } from 'redux/actions/pageOneActions';
import { hidePreloader, showPreloader, setNextPage, isUnloadedPage, setLoaderPos } from 'redux/actions/preloaderActions';
import CanvasBg from 'components/CanvasBg';
import LinkButton from 'components/LinkButton';
import DelayLink from 'components/DelayLink';
import LangButton from 'components/LangButton';
import SoundButton from 'components/SoundButton';
import { mobileTabletCheck } from 'utils/isMobile';

import imageAbotWhite from 'images/man-white.svg';
import imageHome from 'images/home.svg';
import imageSkills from 'images/skills.svg';
import imageGallery from 'images/gallery.svg';
import imageContacts from 'images/phone-email.svg';
import ErrorConnect from 'components/ErrorConnect';
import * as colorSheme from 'etc/colorSheme.json';
import * as navMenu from 'etc/navMenu.json';

import './Page1.scss';

const propTypes = {
	match:  PropTypes.object,
	data: PropTypes.object,
	isLoading: PropTypes.bool,
	isError: PropTypes.bool,
	appLoaded: PropTypes.bool,
	pageLoaded: PropTypes.bool,
	dispatch: PropTypes.func
};

const defaultTitle = {
	ru: '... | Сычев Игорь',
	ua: '... | Сичов Ігор',
	en: '... | Sychov Igor'
};

class Page1 extends Component {

	constructor(props) {
		super(props);

		this.state = {
			clickable: false,
			isMobile: false
		};

		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		this.setState({
			isMobile: mobileTabletCheck()
		});

		if (this.props.isLoading) {
			this.props.dispatch(this.constructor.fetchData());
		} else {
			this.props.dispatch(hidePreloader());
		}

		if (this.props.appLoaded && this.props.pageLoaded) {
			setTimeout(() => {
				if (this._isMounted) {
					this.setState({
						clickable: true
					});
				}
			}, 100);
		}
	}

	componentDidUpdate(prevProps) {
		const curProps = this.props;

		if (prevProps.isLoading !== curProps.isLoading) {
			if (!curProps.isLoading) {
				this.props.dispatch(hidePreloader());
			}
		}
		if ((prevProps.appLoaded !== curProps.appLoaded || prevProps.pageLoaded !== curProps.pageLoaded) && curProps.appLoaded && curProps.pageLoaded) {
			setTimeout(() => {
				if (this._isMounted) {
					this.setState({
						clickable: true
					});
				}
			}, 700);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.props.dispatch(unloadPage());
	}

	handleClick(e) {
		const target = e.target;
		const className = target.className;

		if (className.indexOf('react_link') === -1) {
			return true;
		}

		e.preventDefault();
		e.stopPropagation();

		const href = target.getAttribute('href');
		const top = e.clientY;
		const left = e.clientX;

		this.props.dispatch(setLoaderPos({ top, left, width: 0, height: 0, marginTop: 0, marginLeft: 0 }));
		if (typeof href === 'string') {
			this.props.dispatch(setNextPage(href));
		}
		this.props.dispatch(showPreloader());
		setTimeout(() => {
			if (!this._isMounted) {
				return;
			}

			this.props.dispatch(isUnloadedPage());
			this.props.history.push(href);
		}, 800);
	}

	static fetchData() {
		return fetchPage();
	}

	renderTrackVertical(props) {
		return (
			<div className='tb__rail' {...props} />
		);
	}

	render() {
		const { data, isError, appLoaded, pageLoaded, match } = this.props;
		const local = (match && match.params) ? match.params[0] : 'ru';
		const localData = data[local] ? data[local] : {};
		const title = localData.title ? localData.title : '';
		const pTitle = (title && title !== '') ? title : defaultTitle[local];
		const description = localData.description ? localData.description : '';
		const keywords = localData.keywords ? localData.keywords : '';
		const { clickable, isMobile } = this.state;
		const isShow = (appLoaded && pageLoaded);
		const showClass = isShow ? ' show' : '';
		const mobClass = isMobile ? ' mob' : '';
		const metaColor = appLoaded ? colorSheme.page1[1] : colorSheme.main[1];
		const pageData = localData.data ? localData.data : {};
		const localMenu = navMenu[local] ? navMenu[local] : navMenu.ru;

		if (isError) {
			return (
				<div className='page1'>
					<ErrorConnect local={local} path='/about' />
				</div>
			);
		}
		if (!data || Object.keys(data).length < 1) {
			return (
				<div className='page1'/>
			);
		}

		return (
			<div className='page1'>
				<MetaTags>
					<title>{pTitle}</title>
					<meta name='keywords' content={keywords} />
					<meta name='description' content={description} />
					<meta name='theme-color' content={metaColor} />
					<meta name='msapplication-navbutton-color' content={metaColor} />
				</MetaTags>
				<CanvasBg isShow={isShow} type='page1' />
				<div className={`title_block${showClass}`}>
					<div className='tb__image'>
						<img src={imageAbotWhite} alt='' />
					</div>
					<div className='tb__title'>
						<h2>
							{pageData.name && Parser(pageData.name)}
						</h2>
					</div>
				</div>
				<DelayLink to={localMenu.home.link} disabled={!clickable}>
					<LinkButton
						position='one'
						colors='main'
						title={localMenu.home.name}
						image={imageHome}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<DelayLink to={localMenu.page2.link} disabled={!clickable}>
					<LinkButton
						position='two'
						colors='color2'
						title={localMenu.page2.name}
						image={imageSkills}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<DelayLink to={localMenu.page3.link} disabled={!clickable}>
					<LinkButton
						position='three'
						colors='color3'
						title={localMenu.page3.name}
						image={imageGallery}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<DelayLink to={localMenu.page4.link} disabled={!clickable}>
					<LinkButton
						position='four'
						colors='color4'
						title={localMenu.page4.name}
						image={imageContacts}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<div className={`text_block${showClass}${mobClass}`}>
					<div className='tb__bg' />
					<Scrollbars
						universal
						renderTrackVertical={this.renderTrackVertical}
					>
						<div
							className='tb__content'
							onClick={this.handleClick}
						>
							{pageData.text && Parser(pageData.text)}
						</div>
					</Scrollbars>
				</div>
				<LangButton
					colors='color1'
					local={local}
					page='page1'
					isShow={isShow}
				/>
				<SoundButton
					colors='color1'
					isShow={isShow}
				/>
			</div>
		);
	}

}

Page1.propTypes = propTypes;

function mapStateToProps(state) {
	const { data, isLoading, isError } = state.page1;
	const { appLoaded, pageLoaded } = state.preloader;

	return { data, isLoading, isError, appLoaded, pageLoaded };
}


export default connect(mapStateToProps)(Page1);