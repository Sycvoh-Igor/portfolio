import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { fetchPage, unloadPage } from 'redux/actions/pageFourActions';
import { hidePreloader } from 'redux/actions/preloaderActions';
import CanvasBg from 'components/CanvasBg';
import LinkButton from 'components/LinkButton';
import SoundButton from 'components/SoundButton';
import DelayLink from 'components/DelayLink';
import LangButton from 'components/LangButton';
import SendForm from 'components/SendForm';
import ErrorConnect from 'components/ErrorConnect';
import imageTitle from 'images/phone-email-white.svg';
import imageHome from 'images/home.svg';
import imageAbout from 'images/man.svg';
import imageSkills from 'images/skills.svg';
import imageGallery from 'images/gallery.svg';
import imageViber from 'images/viber.svg';
import imageSkype from 'images/skype.svg';
import imageMail from 'images/letter.svg';
import * as colorSheme from 'etc/colorSheme.json';
import * as navMenu from 'etc/navMenu.json';

import './Page4.scss';

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

class Page4 extends Component {

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
		const metaColor = appLoaded ? colorSheme.page4[1] : colorSheme.main[1];
		const pageData = localData.data ? localData.data : {};
		const localMenu = navMenu[local] ? navMenu[local] : navMenu.ru;

		if (isError) {
			return (
				<div className='page4'>
					<ErrorConnect local={local} path='/contacts' />
				</div>
			);
		}
		if (!data || Object.keys(data).length < 1) {
			return (
				<div className='page4'/>
			);
		}

		return (
			<div className='page4'>
				<MetaTags>
					<title>{pTitle}</title>
					<meta name='keywords' content={keywords} />
					<meta name='description' content={description} />
					<meta name='theme-color' content={metaColor} />
					<meta name='msapplication-navbutton-color' content={metaColor} />
				</MetaTags>
				<CanvasBg isShow={isShow} type='page4' />
				<div className='page__content'>
					{isShow && <SendForm />}
					<div className='page__links'>
						<a href='tel:+380676072114' className={`page__link${showClass}`}>
							<div className='page__link_l'>
								<span>+38 067 607 2114</span>
							</div>
							<div className='page__link_r'>
								<img src={imageViber} />
							</div>
						</a>
						<a href='skype:igor_alex30?chat' className={`page__link${showClass}`}>
							<div className='page__link_l'>
								igor_alex<span>30</span>
							</div>
							<div className='page__link_r'>
								<img src={imageSkype} />
							</div>
						</a>
						<a href='mailto:igoralexsy@gmail.com' className={`page__link${showClass}`}>
							<div className='page__link_l'>
								igoralexsy@gmail.com
							</div>
							<div className='page__link_r'>
								<img src={imageMail} />
							</div>
						</a>
					</div>
				</div>
				<div className={`title_block${showClass}`}>
					<div className='tb__image'>
						<img src={imageTitle} alt='' />
					</div>
					<div className='tb__title'>
						<h2>
							<span>{pageData.name}</span>
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
				<DelayLink to={localMenu.page3.link} disabled={!clickable}>
					<LinkButton
						position='four'
						colors='color3'
						title={localMenu.page3.name}
						image={imageGallery}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<LangButton
					colors='color4'
					local={local}
					page='page4'
					isShow={isShow}
				/>
				<SoundButton
					colors='color4'
					isShow={isShow}
				/>
			</div>
		);
	}

}

Page4.propTypes = propTypes;

function mapStateToProps(state) {
	const { data, isLoading, isError } = state.page4;
	const { appLoaded, pageLoaded } = state.preloader;

	return { data, isLoading, isError, appLoaded, pageLoaded };
}


export default connect(mapStateToProps)(Page4);