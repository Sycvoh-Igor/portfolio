import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node
};

class UpdateBlocker extends React.PureComponent {

	render() {
		return this.props.children;
	}

}

UpdateBlocker.propTypes = propTypes;

export default UpdateBlocker;