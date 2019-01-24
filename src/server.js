require('events').EventEmitter.defaultMaxListeners = 100;
import path from 'path';
import express from 'express';
import compression from 'compression';
import enforce from 'express-sslify';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDom from 'react-dom/server';
import { StaticRouter, Route } from 'react-router';
import { Provider } from 'react-redux';
import { matchPath } from 'react-router-dom';
import MetaTagsServer from 'react-meta-tags/server';
import { MetaTagsContext } from 'react-meta-tags';
import { CookiesProvider } from 'react-cookie';
import cookiesMiddleware from 'universal-cookie-express';
import configureStore from './redux/configureStore';
import baseUrl from 'etc/baseUrl';
import routes from 'routes';
import App from 'components/App';
import * as mail from 'utils/MailUtils';
import homeData from 'pagesData/home';
import aboutData from 'pagesData/about';
import skillsData from 'pagesData/skills';
import portfolioData from 'pagesData/portfolio';
import contactsData from 'pagesData/contacts';


const app  = express();

app.use(compression());
app.use(express.static(path.join(__dirname, '../public')));

if (process.env.NODE_ENV === 'production') {
	app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(bodyParser.json());
app.use(cookiesMiddleware());

app.get('/api/home', (req, res) => {
	res.json(homeData);
});

app.get('/api/page1', (req, res) => {
	res.json(aboutData);
});

app.get('/api/page2', (req, res) => {
	res.json(skillsData);
});

app.get('/api/page3', (req, res) => {
	res.json(portfolioData);
});

app.get('/api/page4', (req, res) => {
	res.json(contactsData);
});

app.get('/api(/*)?', (req, res) => {
	const message = {};

	res.status(400).json(message);
});

app.post('/api/mail', (req, res) => {
	mail.sendMail(req, res);
});

app.post('/api(/*)?', (req, res) => {
	const message = {};

	res.status(400).json(message);
});

app.use((req, res) => {
	const store = configureStore();
	const context = {};
	const metaTagsInstance = MetaTagsServer();
	const promises = [];

	routes.some(route => {
		const match = matchPath(req.path, route);
		if (match && route.component.fetchData){
			promises.push(store.dispatch(route.component.fetchData()));
		}
		if (route.status) {
			res.status(route.status);
		}
		return match;
	});

	Promise.all(promises).then(() => {
		renderPage(req, res, store, context, metaTagsInstance);
	});
});

const jsCssHash = process.env.JS_CSS_HASH ? '?' + process.env.JS_CSS_HASH : '';
const styles = process.env.NODE_ENV !== 'production' ?  '' : `<link rel="stylesheet" href="${baseUrl}assets/css/main.min.css${jsCssHash}">`;

function renderHTML(componentHTML, initialState, meta) {
	return `
		<!DOCTYPE html>
			<html>
			<head>
					<link rel="manifest" href="/manifest.json">
					<meta charset="utf-8">
					<meta name="mobile-web-app-capable" content="yes">
					<meta name="apple-mobile-web-app-capable" content="yes">
					<meta name="application-name" content="Portfolio">
					<meta name="apple-mobile-web-app-title" content="Portfolio">
					<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
					<meta name="msapplication-starturl" content="/">
					<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
					<meta name="google" content="notranslate" />
					${meta}
					<link rel="icon" href="/favicons/favicon.png" type="image/png" size="16x16">
					<link rel="icon" href="/favicons/favicon.32.png" type="image/png" size="32x32">
					<link rel="icon" href="/favicons/icon.72.png" type="image/png" size="72x72">
					<link rel="icon" href="/favicons/icon.114.png" type="image/png" size="114x114">
					<link rel="apple-touch-icon" type="image/png" href="/favicons/icon.57.png">
					<link rel="apple-touch-icon" type="image/png" href="/favicons/icon.72.png" sizes="72x72">
					<link rel="apple-touch-icon" type="image/png" href="/favicons/icon.114.png" size="114x114">
					<link rel="apple-touch-icon" type="image/png" href="/favicons/icon.180.png" size="180x180">
					${styles}
					<script type="application/javascript">
						window.REDUX_INITIAL_STATE = ${JSON.stringify(initialState)};
					</script>
			</head>
			<body>
				<script type="application/javascript">
					var body = document.body;
					body.classList ? body.classList.add('withJs') : body.className += ' withJs';
				</script>
				<div id="main-point">${componentHTML}</div>
				<script type="application/javascript" src="${baseUrl}assets/js/main.min.js${jsCssHash}"></script>
			</body>
		</html>
	`;
}

function renderPage(req, res, store, context, metaTagsInstance){
	const componentHTML = ReactDom.renderToString(
		<Provider store={store}>
			<CookiesProvider cookies={req.universalCookies}>
				<MetaTagsContext extract = {metaTagsInstance.extract}>
					<StaticRouter
						location={req.url}
						context={context}
					>
						<Route component={App} path='/' />
					</StaticRouter>
				</MetaTagsContext>
			</CookiesProvider>
		</Provider>
	);

	if(context.url){
		return res.redirect(context.url);
	}

	const state = store.getState();
	const meta = metaTagsInstance.renderToString();

	return res.end(renderHTML(componentHTML, state, meta));
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server listening on: ${PORT}`);
});