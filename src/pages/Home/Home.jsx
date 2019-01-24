import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { fetchHome, unloadHome } from 'redux/actions/homeActions';
import { hidePreloader } from 'redux/actions/preloaderActions';
import imageAbout from 'images/man.svg';
import imageSkills from 'images/skills.svg';
import imageGallery from 'images/gallery.svg';
import imageContacts from 'images/phone-email.svg';
import ChangeBg from 'components/ChangeBg';
import MainSvgBlock from 'components/MainSvgBlock';
import DelayLink from 'components/DelayLink';
import LangButton from 'components/LangButton';
import SoundButton from 'components/SoundButton';
import ErrorConnect from 'components/ErrorConnect';
import * as colorSheme from 'etc/colorSheme.json';
import * as navMenu from 'etc/navMenu.json';

import './Home.scss';

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

const myNames = {
	ru : 'Игорь',
	ua : 'Ігор',
	en : 'Igor'
};

const mySurname = {
	ru : 'Сычев',
	ua : 'Сичов',
	en : 'Sychov'
};

class Home extends Component {

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
			}, 100);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.props.dispatch(unloadHome());
	}

	static fetchData() {
		return fetchHome();
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
		const metaColor = colorSheme.main[1];
		const localMenu = navMenu[local] ? navMenu[local] : navMenu.ru;

		if (isError) {
			return (
				<div className='home'>
					<ErrorConnect local={local} path='' />
				</div>
			);
		}
		if (!data || Object.keys(data).length < 1) {
			return (
				<div className='home'/>
			);
		}
		return (
			<div className='home'>
				<MetaTags>
					<title>{pTitle}</title>
					<meta name='keywords' content={keywords} />
					<meta name='description' content={description} />
					<meta name='theme-color' content={metaColor} />
					<meta name='msapplication-navbutton-color' content={metaColor} />
				</MetaTags>
				{/* <div className='home__bg' /> */}
				<ChangeBg local={local} />
				<div className={`home__bg_line${showClass}`} />
				<DelayLink to={localMenu.page1.link} disabled={!clickable}>
					<MainSvgBlock
						position='tl'
						image={imageAbout}
						alt='about'
						title={localMenu.page1.name}
						desc={localMenu.page1.desc}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<DelayLink to={localMenu.page2.link} disabled={!clickable}>
					<MainSvgBlock
						position='bl'
						image={imageSkills}
						alt='skills'
						title={localMenu.page2.name}
						desc={localMenu.page2.desc}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<DelayLink to={localMenu.page3.link} disabled={!clickable}>
					<MainSvgBlock
						position='tr'
						image={imageGallery}
						alt='portfolio'
						title={localMenu.page3.name}
						desc={localMenu.page3.desc}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<DelayLink to={localMenu.page4.link} disabled={!clickable}>
					<MainSvgBlock
						position='br'
						image={imageContacts}
						alt='contacts'
						title={localMenu.page4.name}
						desc={localMenu.page4.desc}
						isShow={isShow}
						clickable={clickable}
					/>
				</DelayLink>
				<div className={`home__center_block${showClass}`}>
					<div className='cb__title left'>
						<span>{mySurname[local]}</span>
					</div>
					<div className='cb__lines' />
					<div className='cb__title right'>
						<span>{myNames[local]}</span>
					</div>
					<h1 className='cb__desc'>
						<span className='l'>
							<span>Front-end</span>
						</span>
						<span className='c' />
						<span className='r'>
							<span>Developer</span>
						</span>
					</h1>
				</div>
				<LangButton
					colors='main'
					local={local}
					page='home'
					isShow={isShow}
				/>
				<SoundButton
					colors='main'
					isShow={isShow}
				/>
			</div>
		);
	}

}

Home.propTypes = propTypes;

function mapStateToProps(state) {
	const { data, isLoading, isError } = state.home;
	const { appLoaded, pageLoaded } = state.preloader;

	return { data, isLoading, isError, appLoaded, pageLoaded };
}


export default connect(mapStateToProps)(Home);