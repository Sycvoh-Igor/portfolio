import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { showPreloader, setNextPage, isUnloadedPage } from 'redux/actions/preloaderActions';
import UpdateBlocker from 'components/UpdateBlocker';

import './DelayLink.scss';

const propTypes = {
	to: PropTypes.any,
	dispatch: PropTypes.any,
	history: PropTypes.any,
	delay: PropTypes.number,
	disabled: PropTypes.bool
};

const defaultProps = {
	delay: 800,
	disabled: false
};

class DelayLink extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isChanging: false
		};

		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleClick(e) {
		e.preventDefault();
		if (this.state.isChanging || this.props.disabled) {
			return;
		}

		const { to, delay } = this.props;

		this.setState({
			isChanging : true
		});

		if (typeof to === 'string') {
			this.props.dispatch(setNextPage(to));
		}
		this.props.dispatch(showPreloader());
		setTimeout(() => {
			if (!this._isMounted) {
				return;
			}
			this.setState({
				isChanging : false
			});
			this.props.dispatch(isUnloadedPage());
			this.props.history.push(to);
		}, delay);
	}


	render() {
		const {
			to,
			...rest
		} = this.props;

		delete rest.dispatch;
		delete rest.match;
		delete rest.history;
		delete rest.staticContext;

		return (
			<UpdateBlocker>
				<NavLink
					to={to}
					{...rest}
					onClick={this.handleClick}
				/>
			</UpdateBlocker>
		);
	}

}

DelayLink.propTypes = propTypes;
DelayLink.defaultProps = defaultProps;

export default withRouter(connect()(DelayLink));