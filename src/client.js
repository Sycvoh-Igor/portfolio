import 'nodelist-foreach-polyfill';
import React      from 'react';
import { hydrate }   from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import configureStore from 'redux/configureStore';

import 'mainStyles/fonts/font.scss';
import 'mainStyles/mainStyles.scss';

import App from 'components/App';

const initialState = window.REDUX_INITIAL_STATE || {};
const store = configureStore(initialState);

const component = (
	<Provider store={store}>
		<CookiesProvider>
			<Router>
				<Route component={App} path='/' />
			</Router>
		</CookiesProvider>
	</Provider>
);

hydrate(component, document.getElementById('main-point'));