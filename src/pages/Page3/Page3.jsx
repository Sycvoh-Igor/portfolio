import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { fetchPage, unloadPage } from 'redux/actions/pageThreeActions';
import { hidePreloader } from 'redux/actions/preloaderActions';
import CanvasBg from 'components/CanvasBg';
import CanvasGallery from 'components/CanvasGallery';
import LinkButton from 'components/LinkButton';
import DelayLink from 'components/DelayLink';
import LangButton from 'components/LangButton';
import SoundButton from 'components/SoundButton';
import ErrorConnect from 'components/ErrorConnect';
import imageGalleryWhite from 'images/gallery-white.svg';
import imageHome from 'images/home.svg';
import imageAbout from 'images/man.svg';
import imageSkills from 'images/skills.svg';
import imageContacts from 'images/phone-email.svg';

import imageP1 from 'images/portfolio/villagio.jpg';
import imageP2 from 'images/portfolio/agalarov.jpg';
import imageP3 from 'images/portfolio/golf-club.jpg';
import imageP4 from 'images/portfolio/flat-corner.jpg';
import imageP5 from 'images/portfolio/cvet32-1.jpg';
import * as colorSheme from 'etc/colorSheme.json';
import * as navMenu from 'etc/navMenu.json';

import './Page3.scss';

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

class Page3 extends Component {

	constructor(props) {
		super(props);

		this.state = {
			clickable: false
		};
	}

	componentDidMount() {
		this._isMounted = true;

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

	static fetchData() {
		return fetchPage();
	}

	render() {
		const { data, isError, appLoaded, pageLoaded, match } = this.props;
		const local = (match && match.params) ? match.params[0] : 'ru';
		const localData = data[local] ? data[local] : {};
		const title = localData.title ? localData.title : '';
		const pTitle = (title && title !== '') ? title : defaultTitle[local];
		const description = localData.description ? localData.description : '';
		const keywords = localData.keywords ? localData.keywords : '';
		const { clickable } = this.state;
		const isShow = (appLoaded && pageLoaded);
		const showClass = isShow ? ' show' : '';
		const metaColor = appLoaded ? colorSheme.page3[1] : colorSheme.main[1];
		const pageData = localData.data ? localData.data : {};
		const localMenu = navMenu[local] ? navMenu[local] : navMenu.ru;
		const links = pageData.links ? pageData.links : [];
		const textArr = pageData.texts ? pageData.texts : [];

		if (isError) {
			return (
				<div className='page3'>
					<ErrorConnect local={local} path='/portfolio' />
				</div>
			);
		}
		if (!data || Object.keys(data).length < 1) {
			return (
				<div className='page3'/>
			);
		}

		return (
			<div className='page3'>
				<MetaTags>
					<title>{pTitle}</title>
					<meta name='keywords' content={keywords} />
					<meta name='description' content={description} />
					<meta name='theme-color' content={metaColor} />
					<meta name='msapplication-navbutton-color' content={metaColor} />
				</MetaTags>
				<CanvasBg isShow={isShow} type='page3' />
				<CanvasGallery
					isShow={isShow}
					images={[imageP1, imageP2, imageP3, imageP4, imageP5]}
					links={links}
					texts={textArr}
					initialSlide={2}
					firstLoad={!appLoaded}
					local={local}
				/>
				<div className={`title_block${showClass}`}>
					<div className='tb__image'>
						<img src={imageGalleryWhite} alt='' />
					</div>
					<div className='tb__title'>
						<h2>
							{pageData.name}
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
				<DelayLink to={localMenu.page1.link} disabled={!clickable}>
					<LinkButton
						position='two'
						colors='color1'
						title={localMenu.page1.name}
						image={imageAbout}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<DelayLink to={localMenu.page2.link} disabled={!clickable}>
					<LinkButton
						position='three'
						colors='color2'
						title={localMenu.page2.name}
						image={imageSkills}
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
				<LangButton
					colors='color3'
					local={local}
					page='page3'
					isShow={isShow}
				/>
				<SoundButton
					colors='color3'
					isShow={isShow}
				/>
			</div>
		);
	}

}

Page3.propTypes = propTypes;

function mapStateToProps(state) {
	const { data, isLoading, isError } = state.page3;
	const { appLoaded, pageLoaded } = state.preloader;

	return { data, isLoading, isError, appLoaded, pageLoaded };
}


export default connect(mapStateToProps)(Page3);