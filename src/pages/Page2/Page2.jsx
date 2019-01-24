import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { fetchPage, unloadPage } from 'redux/actions/pageTwoActions';
import { hidePreloader } from 'redux/actions/preloaderActions';
import CanvasBg from 'components/CanvasBg';
import LinkButton from 'components/LinkButton';
import DelayLink from 'components/DelayLink';
import LangButton from 'components/LangButton';
import SoundButton from 'components/SoundButton';
import InfogramCircle from 'components/InfogramCircle';
import InfogramSheme from 'components/InfogramSheme';
import ErrorConnect from 'components/ErrorConnect';
import imageTitle from 'images/skills-white.svg';
import imageHome from 'images/home.svg';
import imageAbout from 'images/man.svg';
import imageGallery from 'images/gallery.svg';
import imageContacts from 'images/phone-email.svg';
import * as colorSheme from 'etc/colorSheme.json';
import * as navMenu from 'etc/navMenu.json';

import './Page2.scss';

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

class Page2 extends Component {

	constructor(props) {
		super(props);

		this.state = {
			clickable: false,
			curSheme: 0,
			isActiveSheme: false
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
		const { clickable, curSheme, isActiveSheme } = this.state;
		const isShow = (appLoaded && pageLoaded);
		const showClass = isShow ? ' show' : '';
		const metaColor = appLoaded ? colorSheme.page2[1] : colorSheme.main[1];
		const pageData = localData.data ? localData.data : {};
		const localMenu = navMenu[local] ? navMenu[local] : navMenu.ru;

		if (isError) {
			return (
				<div className='page2'>
					<ErrorConnect local={local} path='/skills' />
				</div>
			);
		}
		if (!data || Object.keys(data).length < 1) {
			return (
				<div className='page2'/>
			);
		}

		return (
			<div className='page2'>
				<MetaTags>
					<title>{pTitle}</title>
					<meta name='keywords' content={keywords} />
					<meta name='description' content={description} />
					<meta name='theme-color' content={metaColor} />
					<meta name='msapplication-navbutton-color' content={metaColor} />
				</MetaTags>
				<CanvasBg isShow={isShow} type='page2' />
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
				{pageData.sheme &&
				<InfogramSheme
					isActive={isActiveSheme}
					current={curSheme}
					data={pageData.sheme}
				/>}
				<InfogramCircle
					isActive={isShow}
					onBeforeChange={(cur, next) => {
						this.setState({
							curSheme: next,
							isActiveSheme: true
						});
					}}
				/>
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
				<LangButton
					colors='color2'
					local={local}
					page='page2'
					isShow={isShow}
				/>
				<SoundButton
					colors='color2'
					isShow={isShow}
				/>
			</div>
		);
	}

}

Page2.propTypes = propTypes;

function mapStateToProps(state) {
	const { data, isLoading, isError } = state.page2;
	const { appLoaded, pageLoaded } = state.preloader;

	return { data, isLoading, isError, appLoaded, pageLoaded };
}


export default connect(mapStateToProps)(Page2);